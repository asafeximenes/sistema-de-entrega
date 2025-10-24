import { router } from 'expo-router';
import React from 'react';
import { Alert, ScrollView, TouchableOpacity } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { EmptyState, LoadingScreen, LogoutButton, StatusBadge } from '@/components/ui';
import { useAppointments } from '@/hooks';
import { adminStyles } from '@/styles';

export default function AdminScreen() {
  const { appointments, loading, updateStatus } = useAppointments();

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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const pendingDeliveries = appointments.filter(d => d.status === 'pending');
  const completedDeliveries = appointments.filter(d => d.status === 'completed');
  const failedDeliveries = appointments.filter(d => d.status === 'failed');

  if (loading) {
    return <LoadingScreen message="Carregando dados..." />;
  }

  return (
    <ThemedView style={adminStyles.container}>
      <ThemedView style={adminStyles.header}>
        <ThemedText type="title" style={adminStyles.title}>
          Painel Administrativo
        </ThemedText>
        <LogoutButton onPress={handleLogout} />
      </ThemedView>

      <ScrollView style={adminStyles.content}>
        <ThemedView style={adminStyles.statsContainer}>
          <ThemedView style={adminStyles.statCard}>
            <ThemedText style={adminStyles.statNumber}>{pendingDeliveries.length}</ThemedText>
            <ThemedText style={adminStyles.statLabel}>Pendentes</ThemedText>
          </ThemedView>
          <ThemedView style={adminStyles.statCard}>
            <ThemedText style={adminStyles.statNumber}>{completedDeliveries.length}</ThemedText>
            <ThemedText style={adminStyles.statLabel}>Concluídas</ThemedText>
          </ThemedView>
          <ThemedView style={adminStyles.statCard}>
            <ThemedText style={adminStyles.statNumber}>{failedDeliveries.length}</ThemedText>
            <ThemedText style={adminStyles.statLabel}>Falharam</ThemedText>
          </ThemedView>
        </ThemedView>

        <ThemedView style={adminStyles.deliveriesSection}>
          <ThemedText style={adminStyles.sectionTitle}>Todas as Entregas:</ThemedText>
          
          {appointments.length === 0 ? (
            <EmptyState message="Nenhuma entrega agendada ainda." />
          ) : (
            appointments.map((delivery) => (
              <ThemedView key={delivery.id} style={adminStyles.deliveryCard}>
                <ThemedView style={adminStyles.deliveryHeader}>
                  <ThemedText style={adminStyles.customerName}>{delivery.userName}</ThemedText>
                  <StatusBadge status={delivery.status} />
                </ThemedView>
                
                <ThemedText style={adminStyles.deliveryInfo}>Email: {delivery.userEmail}</ThemedText>
                <ThemedText style={adminStyles.deliveryInfo}>Data: {formatDate(delivery.date)}</ThemedText>
                <ThemedText style={adminStyles.deliveryInfo}>Horário: {delivery.time}</ThemedText>
                <ThemedText style={adminStyles.deliveryInfo}>Endereço: {delivery.userAddress}</ThemedText>
                
                {delivery.status === 'pending' && (
                  <ThemedView style={adminStyles.actionButtons}>
                    <TouchableOpacity
                      style={[adminStyles.actionButton, adminStyles.completeButton]}
                      onPress={() => updateStatus(delivery.id, 'completed')}
                    >
                      <ThemedText style={adminStyles.actionButtonText}>Marcar como Concluída</ThemedText>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[adminStyles.actionButton, adminStyles.failButton]}
                      onPress={() => updateStatus(delivery.id, 'failed')}
                    >
                      <ThemedText style={adminStyles.actionButtonText}>Marcar como Falhou</ThemedText>
                    </TouchableOpacity>
                  </ThemedView>
                )}
              </ThemedView>
            ))
          )}
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}
