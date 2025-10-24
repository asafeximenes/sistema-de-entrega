import { router } from 'expo-router';
import React from 'react';
import { Alert, ScrollView, TouchableOpacity } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { EmptyState, LoadingScreen, LogoutButton, StatusBadge } from '@/components/ui';
import { useUserDeliveries } from '@/hooks';
import { userDeliveriesStyles } from '@/styles';

export default function UserDeliveriesScreen() {
  const { userDeliveries, loading, formatDate } = useUserDeliveries();

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

  const handleBackToDashboard = () => {
    router.push('/user-dashboard' as any);
  };

  if (loading) {
    return <LoadingScreen message="Carregando suas entregas..." />;
  }

  const pendingDeliveries = userDeliveries.filter(d => d.status === 'pending');
  const completedDeliveries = userDeliveries.filter(d => d.status === 'completed');
  const failedDeliveries = userDeliveries.filter(d => d.status === 'failed');

  return (
    <ThemedView style={userDeliveriesStyles.container}>
      <ThemedView style={userDeliveriesStyles.header}>
        <TouchableOpacity onPress={handleBackToDashboard}>
          <ThemedText style={{ color: '#007AFF', fontSize: 16, fontWeight: '600' }}>
            ← Voltar
          </ThemedText>
        </TouchableOpacity>
        <ThemedText type="title" style={userDeliveriesStyles.title}>
          Todas as Entregas
        </ThemedText>
        <LogoutButton onPress={handleLogout} />
      </ThemedView>

      <ScrollView style={userDeliveriesStyles.content}>
        <ThemedView style={userDeliveriesStyles.statsContainer}>
          <ThemedView style={userDeliveriesStyles.statCard}>
            <ThemedText style={userDeliveriesStyles.statNumber}>{pendingDeliveries.length}</ThemedText>
            <ThemedText style={userDeliveriesStyles.statLabel}>Pendentes</ThemedText>
          </ThemedView>
          <ThemedView style={userDeliveriesStyles.statCard}>
            <ThemedText style={userDeliveriesStyles.statNumber}>{completedDeliveries.length}</ThemedText>
            <ThemedText style={userDeliveriesStyles.statLabel}>Concluídas</ThemedText>
          </ThemedView>
          <ThemedView style={userDeliveriesStyles.statCard}>
            <ThemedText style={userDeliveriesStyles.statNumber}>{failedDeliveries.length}</ThemedText>
            <ThemedText style={userDeliveriesStyles.statLabel}>Falharam</ThemedText>
          </ThemedView>
        </ThemedView>

        <ThemedView style={userDeliveriesStyles.deliveriesSection}>
          <ThemedText style={userDeliveriesStyles.sectionTitle}>Histórico Completo:</ThemedText>
          
          {userDeliveries.length === 0 ? (
            <EmptyState message="Você ainda não possui entregas agendadas." />
          ) : (
            userDeliveries.map((delivery) => (
              <ThemedView key={delivery.id} style={userDeliveriesStyles.deliveryCard}>
                <ThemedView style={userDeliveriesStyles.deliveryHeader}>
                  <ThemedText style={userDeliveriesStyles.deliveryDate}>
                    {formatDate(delivery.date)}
                  </ThemedText>
                  <StatusBadge status={delivery.status} />
                </ThemedView>
                
                <ThemedText style={userDeliveriesStyles.deliveryInfo}>
                  Horário: {delivery.time}
                </ThemedText>
                <ThemedText style={userDeliveriesStyles.deliveryInfo}>
                  Endereço: {delivery.userAddress}
                </ThemedText>
                <ThemedText style={userDeliveriesStyles.deliveryInfo}>
                  Status: {delivery.status === 'pending' ? 'Aguardando entrega' : 
                          delivery.status === 'completed' ? 'Entregue com sucesso' : 
                          'Entrega falhou'}
                </ThemedText>
                <ThemedText style={userDeliveriesStyles.deliveryInfo}>
                  Agendado em: {new Date(delivery.createdAt).toLocaleDateString('pt-BR')}
                </ThemedText>
              </ThemedView>
            ))
          )}
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}
