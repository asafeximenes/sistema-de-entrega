import { router } from 'expo-router';
import React from 'react';
import { Alert, ScrollView, TouchableOpacity } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Button, LogoutButton } from '@/components/ui';
import { useUserSchedule } from '@/hooks';
import { scheduleStyles } from '@/styles';

export default function ScheduleScreen() {
  const {
    selectedDate,
    selectedTimeSlot,
    timeSlots,
    loading,
    handleTimeSlotSelect,
    handleSchedule,
    handleDateChange,
    formatDate,
  } = useUserSchedule();

  const handleLogout = () => {
    Alert.alert(
      'Sair',
      'Tem certeza que deseja sair?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Sair', onPress: () => router.push('/') }
      ]
    );
  };

  return (
    <ThemedView style={scheduleStyles.container}>
      <ThemedView style={scheduleStyles.header}>
        <ThemedText type="title" style={scheduleStyles.title}>
          Agendar Entrega
        </ThemedText>
        <LogoutButton onPress={handleLogout} />
      </ThemedView>

      <ScrollView style={scheduleStyles.content}>
        <ThemedView style={scheduleStyles.dateSection}>
          <ThemedText style={scheduleStyles.sectionTitle}>Selecionar Data:</ThemedText>
          
          <ThemedView style={scheduleStyles.dateControls}>
            <TouchableOpacity style={scheduleStyles.dateButton} onPress={() => handleDateChange(-1)}>
              <ThemedText style={scheduleStyles.dateButtonText}>← Anterior</ThemedText>
            </TouchableOpacity>
            
            <ThemedView style={scheduleStyles.currentDateContainer}>
              <ThemedText style={scheduleStyles.currentDateText}>{formatDate(selectedDate)}</ThemedText>
            </ThemedView>
            
            <TouchableOpacity style={scheduleStyles.dateButton} onPress={() => handleDateChange(1)}>
              <ThemedText style={scheduleStyles.dateButtonText}>Próximo →</ThemedText>
            </TouchableOpacity>
          </ThemedView>
        </ThemedView>

        <ThemedView style={scheduleStyles.timeSection}>
          <ThemedText style={scheduleStyles.sectionTitle}>Horários Disponíveis:</ThemedText>
          <ThemedText style={scheduleStyles.capacityInfo}>
            Capacidade máxima: 2 pessoas por horário
          </ThemedText>
          
          <ThemedView style={scheduleStyles.timeGrid}>
            {timeSlots.map((slot) => (
              <TouchableOpacity
                key={slot.id}
                style={[
                  scheduleStyles.timeSlot,
                  !slot.available && scheduleStyles.timeSlotUnavailable,
                  selectedTimeSlot === slot.id && scheduleStyles.timeSlotSelected,
                ]}
                onPress={() => handleTimeSlotSelect(slot)}
                disabled={!slot.available}
              >
                <ThemedText
                  style={[
                    scheduleStyles.timeSlotText,
                    !slot.available && scheduleStyles.timeSlotTextUnavailable,
                    selectedTimeSlot === slot.id && scheduleStyles.timeSlotTextSelected,
                  ]}
                >
                  {slot.time}
                </ThemedText>
                <ThemedText
                  style={[
                    scheduleStyles.capacityText,
                    !slot.available && scheduleStyles.capacityTextUnavailable,
                    selectedTimeSlot === slot.id && scheduleStyles.capacityTextSelected,
                  ]}
                >
                  {slot.currentCount}/2
                </ThemedText>
              </TouchableOpacity>
            ))}
          </ThemedView>
        </ThemedView>

        <Button
          title="Confirmar Agendamento"
          onPress={handleSchedule}
          disabled={!selectedTimeSlot || loading}
          loading={loading}
          variant="success"
          style={scheduleStyles.scheduleButton}
        />
      </ScrollView>
    </ThemedView>
  );
}
