import { router } from 'expo-router';
import React from 'react';
import { ScrollView, TextInput, TouchableOpacity } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Button } from '@/components/ui';
import { useCreateUser } from '@/hooks';
import { createUserStyles } from '@/styles';

export default function CreateUserScreen() {
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [address, setAddress] = React.useState('');
  const { createNewUser, loading } = useCreateUser();

  const handleCreateUser = () => {
    createNewUser(name, email, address);
  };

  const handleBack = () => {
    router.push('/');
  };

  return (
    <ThemedView style={createUserStyles.container}>
      <ThemedView style={createUserStyles.header}>
        <TouchableOpacity style={createUserStyles.backButton} onPress={handleBack}>
          <ThemedText style={createUserStyles.backButtonText}>← Voltar</ThemedText>
        </TouchableOpacity>
        <ThemedText type="title" style={createUserStyles.title}>
          Criar Novo Usuário
        </ThemedText>
      </ThemedView>

      <ScrollView style={createUserStyles.content}>
        <ThemedView style={createUserStyles.form}>
          <ThemedView style={createUserStyles.inputContainer}>
            <ThemedText style={createUserStyles.label}>Nome Completo:</ThemedText>
            <TextInput
              style={createUserStyles.input}
              value={name}
              onChangeText={setName}
              placeholder="Digite o nome completo"
              autoCapitalize="words"
            />
          </ThemedView>

          <ThemedView style={createUserStyles.inputContainer}>
            <ThemedText style={createUserStyles.label}>Email:</ThemedText>
            <TextInput
              style={createUserStyles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Digite o email"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </ThemedView>

          <ThemedView style={createUserStyles.inputContainer}>
            <ThemedText style={createUserStyles.label}>Endereço:</ThemedText>
            <TextInput
              style={[createUserStyles.input, createUserStyles.textArea]}
              value={address}
              onChangeText={setAddress}
              placeholder="Digite o endereço completo"
              multiline
              numberOfLines={3}
            />
          </ThemedView>

          <ThemedView style={createUserStyles.infoBox}>
            <ThemedText style={createUserStyles.infoTitle}>Informações Importantes:</ThemedText>
            <ThemedText style={createUserStyles.infoText}>
              • A senha padrão será: 123456
            </ThemedText>
            <ThemedText style={createUserStyles.infoText}>
              • O usuário poderá fazer login imediatamente após a criação
            </ThemedText>
            <ThemedText style={createUserStyles.infoText}>
              • Cada email só pode ser usado uma vez
            </ThemedText>
          </ThemedView>

          <Button
            title="Criar Usuário"
            onPress={handleCreateUser}
            disabled={loading}
            loading={loading}
            variant="success"
            style={createUserStyles.createButton}
          />
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}
