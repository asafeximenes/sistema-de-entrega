import {
    Appointment,
    createAppointment,
    createUser,
    getAllAppointments,
    getAppointmentCountByTimeSlot,
    getUserByEmail,
    getUserByEmail as getUserByEmailDB,
    initDatabase,
    isDateFullyBooked,
    updateAppointmentStatus
} from '@/database';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';

// Hook para autenticação
export const useAuth = () => {
  const [loading, setLoading] = useState(false);

  const login = async (email: string, password: string) => {
    if (!email || !password) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos');
      return;
    }

    setLoading(true);

    try {
      const user = await getUserByEmail(email);
      
      if (!user) {
        Alert.alert('Erro', 'Usuário não encontrado');
        setLoading(false);
        return;
      }

      // Simulação de verificação de senha
      if (password === '123456') {
        if (user.isAdmin) {
          router.push('/admin');
        } else {
          router.push('/user-dashboard' as any);
        }
      } else {
        Alert.alert('Erro', 'Senha incorreta');
      }
    } catch (error) {
      console.error('Erro no login:', error);
      Alert.alert('Erro', 'Erro interno do sistema');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    Alert.alert(
      'Sair',
      'Tem certeza que deseja sair?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Sair', onPress: () => router.push('/') }
      ]
    );
  };

  return { login, logout, loading };
};

// Hook para criação de usuários
export const useCreateUser = () => {
  const [loading, setLoading] = useState(false);

  const createNewUser = async (name: string, email: string, address: string) => {
    if (!name || !email || !address) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos');
      return;
    }

    // Validação básica de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Erro', 'Por favor, insira um email válido');
      return;
    }

    setLoading(true);

    try {
      await createUser(email, name, address);
      Alert.alert(
        'Sucesso',
        'Usuário criado com sucesso!\n\nSenha padrão: 123456',
        [
          {
            text: 'OK',
            onPress: () => router.push('/')
          }
        ]
      );
    } catch (error: any) {
      console.error('Erro ao criar usuário:', error);
      if (error.message && error.message.includes('UNIQUE constraint failed')) {
        Alert.alert('Erro', 'Este email já está em uso');
      } else {
        Alert.alert('Erro', 'Erro interno do sistema');
      }
    } finally {
      setLoading(false);
    }
  };

  return { createNewUser, loading };
};

// Hook para agendamentos
export const useAppointments = () => {
  const [appointments, setAppointments] = useState<(Appointment & { userName: string; userEmail: string; userAddress: string })[]>([]);
  const [loading, setLoading] = useState(true);

  const loadAppointments = async () => {
    try {
      const data = await getAllAppointments();
      setAppointments(data);
    } catch (error) {
      console.error('Erro ao carregar agendamentos:', error);
      Alert.alert('Erro', 'Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: number, status: 'completed' | 'failed') => {
    try {
      await updateAppointmentStatus(id, status);
      
      setAppointments(prevAppointments =>
        prevAppointments.map(appointment =>
          appointment.id === id
            ? { ...appointment, status: status }
            : appointment
        )
      );

      const statusText = status === 'completed' ? 'concluída' : 'falhou';
      Alert.alert('Status Atualizado', `Entrega marcada como ${statusText}`);
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      Alert.alert('Erro', 'Erro ao atualizar status da entrega');
    }
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  return { appointments, loading, updateStatus, loadAppointments };
};

// Hook para agendamento de usuário
export const useUserSchedule = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [timeSlots, setTimeSlots] = useState<{id: string; time: string; available: boolean; currentCount: number}[]>([]);
  const [loading, setLoading] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  const timeSlotTimes = ['08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'];

  const loadTimeSlots = async () => {
    try {
      const dateString = selectedDate.toISOString().split('T')[0];
      const slots: {id: string; time: string; available: boolean; currentCount: number}[] = [];

      for (const time of timeSlotTimes) {
        const count = await getAppointmentCountByTimeSlot(dateString, time);
        slots.push({
          id: time,
          time: time,
          available: count < 2,
          currentCount: count
        });
      }

      setTimeSlots(slots);
    } catch (error) {
      console.error('Erro ao carregar horários:', error);
    }
  };

  const handleTimeSlotSelect = (timeSlot: {id: string; time: string; available: boolean; currentCount: number}) => {
    if (!timeSlot.available) {
      Alert.alert('Horário Indisponível', 'Este horário já atingiu a capacidade máxima (2 pessoas).');
      return;
    }
    setSelectedTimeSlot(timeSlot.id);
  };

  const handleSchedule = async () => {
    if (!selectedTimeSlot) {
      Alert.alert('Erro', 'Por favor, selecione um horário');
      return;
    }

    setLoading(true);

    try {
      const user = await getUserByEmailDB(userEmail);
      if (!user) {
        Alert.alert('Erro', 'Usuário não encontrado');
        return;
      }

      const dateString = selectedDate.toISOString().split('T')[0];
      
      // Verificar se o dia está completamente lotado
      const isFullyBooked = await isDateFullyBooked(dateString);
      if (isFullyBooked) {
        Alert.alert('Dia Lotado', 'Este dia já atingiu a capacidade máxima. Por favor, escolha outro dia.');
        return;
      }

      // Verificar novamente se o horário ainda está disponível
      const currentCount = await getAppointmentCountByTimeSlot(dateString, selectedTimeSlot);
      if (currentCount >= 2) {
        Alert.alert('Horário Indisponível', 'Este horário foi ocupado por outro usuário. Por favor, escolha outro horário.');
        await loadTimeSlots();
        return;
      }

      await createAppointment(user.id, dateString, selectedTimeSlot);
      
      Alert.alert(
        'Agendamento Confirmado',
        `Seu agendamento foi confirmado para:\n${formatDate(selectedDate)}\nHorário: ${selectedTimeSlot}`,
        [
          {
            text: 'OK',
            onPress: () => {
              loadTimeSlots();
              setSelectedTimeSlot(null);
            }
          }
        ]
      );
    } catch (error) {
      console.error('Erro ao criar agendamento:', error);
      Alert.alert('Erro', 'Erro interno do sistema');
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (days: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    setSelectedDate(newDate);
    setSelectedTimeSlot(null);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  useEffect(() => {
    setUserEmail('luquinhas@mdisia.com');
    loadTimeSlots();
  }, [selectedDate]);

  return {
    selectedDate,
    selectedTimeSlot,
    timeSlots,
    loading,
    handleTimeSlotSelect,
    handleSchedule,
    handleDateChange,
    formatDate,
    loadTimeSlots
  };
};

// Hook para entregas do usuário
export const useUserDeliveries = () => {
  const [userDeliveries, setUserDeliveries] = useState<(Appointment & { userName: string; userEmail: string; userAddress: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [userEmail] = useState('luquinhas@mdisia.com');

  const loadUserDeliveries = async () => {
    try {
      const allAppointments = await getAllAppointments();
      const userAppointments = allAppointments.filter(appointment => 
        appointment.userEmail === userEmail
      );
      setUserDeliveries(userAppointments);
    } catch (error) {
      console.error('Erro ao carregar entregas do usuário:', error);
      Alert.alert('Erro', 'Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUserDeliveries();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return { userDeliveries, loading, formatDate, loadUserDeliveries };
};

// Hook para inicialização do banco
export const useDatabase = () => {
  useEffect(() => {
    initDatabase().catch(console.error);
  }, []);
};
