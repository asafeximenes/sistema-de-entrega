import { router } from 'expo-router';
import React from 'react';
import { TextInput } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Button } from '@/components/ui';
import { useAuth, useDatabase } from '@/hooks';
import { loginStyles } from '@/styles';

export default function LoginScreen() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const { login, loading } = useAuth();

  useDatabase();

  const handleLogin = () => {
    login(email, password);
  };

  const handleCreateUser = () => {
    router.push('/create-user' as any);
  };

  return (
    <ThemedView style={loginStyles.container}>
      <ThemedView style={loginStyles.header}>
        <ThemedText type="title" style={loginStyles.title}>
          Sistema de Agendamento
        </ThemedText>
        <ThemedText style={loginStyles.subtitle}>
          Faça login para acessar o sistema
        </ThemedText>
      </ThemedView>

      <ThemedView style={loginStyles.form}>
        <ThemedView style={loginStyles.inputContainer}>
          <ThemedText style={loginStyles.label}>Email:</ThemedText>
          <TextInput
            style={loginStyles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Digite seu email"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </ThemedView>

        <ThemedView style={loginStyles.inputContainer}>
          <ThemedText style={loginStyles.label}>Senha:</ThemedText>
          <TextInput
            style={loginStyles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="Digite sua senha"
            secureTextEntry
          />
        </ThemedView>

        <ThemedText style={loginStyles.passwordHint}>
          Senha padrão: 123456
        </ThemedText>

        <Button
          title="Entrar"
          onPress={handleLogin}
          disabled={loading}
          loading={loading}
          variant="primary"
          style={loginStyles.loginButton}
        />

        <Button
          title="Criar Novo Usuário"
          onPress={handleCreateUser}
          variant="success"
          style={loginStyles.createUserButton}
        />
      </ThemedView>
    </ThemedView>
  );
}
