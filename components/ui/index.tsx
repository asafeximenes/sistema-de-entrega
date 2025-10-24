import { ThemedText } from '@/components/themed-text';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  disabled?: boolean;
  loading?: boolean;
  style?: any;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  style,
}) => {
  const getButtonStyle = () => {
    const baseStyle = {
      padding: 16,
      borderRadius: 8,
      alignItems: 'center' as const,
    };

    switch (variant) {
      case 'primary':
        return {
          ...baseStyle,
          backgroundColor: disabled ? '#C7C7CC' : '#007AFF',
        };
      case 'secondary':
        return {
          ...baseStyle,
          backgroundColor: disabled ? '#C7C7CC' : '#34C759',
        };
      case 'danger':
        return {
          ...baseStyle,
          backgroundColor: disabled ? '#C7C7CC' : '#FF3B30',
        };
      case 'success':
        return {
          ...baseStyle,
          backgroundColor: disabled ? '#C7C7CC' : '#34C759',
        };
      default:
        return baseStyle;
    }
  };

  const getTextStyle = () => ({
    color: '#fff',
    fontSize: 16,
    fontWeight: '600' as const,
  });

  return (
    <TouchableOpacity
      style={[getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled || loading}
    >
      <ThemedText style={getTextStyle()}>
        {loading ? 'Carregando...' : title}
      </ThemedText>
    </TouchableOpacity>
  );
};

interface LogoutButtonProps {
  onPress: () => void;
}

export const LogoutButton: React.FC<LogoutButtonProps> = ({ onPress }) => {
  return (
    <TouchableOpacity
      style={{
        padding: 8,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#FF3B30',
      }}
      onPress={onPress}
    >
      <ThemedText style={{ color: '#FF3B30', fontWeight: '600' }}>
        Sair
      </ThemedText>
    </TouchableOpacity>
  );
};

interface StatusBadgeProps {
  status: 'pending' | 'completed' | 'failed';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return '#34C759';
      case 'failed':
        return '#FF3B30';
      default:
        return '#FF9500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Concluída';
      case 'failed':
        return 'Falhou';
      default:
        return 'Pendente';
    }
  };

  return (
    <View
      style={{
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        backgroundColor: getStatusColor(status),
      }}
    >
      <ThemedText style={{ color: '#fff', fontSize: 12, fontWeight: '600' }}>
        {getStatusText(status)}
      </ThemedText>
    </View>
  );
};

interface LoadingScreenProps {
  message?: string;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ 
  message = 'Carregando...' 
}) => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ThemedText style={{ fontSize: 18, opacity: 0.7 }}>
        {message}
      </ThemedText>
    </View>
  );
};

interface EmptyStateProps {
  message: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ message }) => {
  return (
    <View
      style={{
        padding: 40,
        alignItems: 'center',
        backgroundColor: '#F2F2F7',
        borderRadius: 12,
      }}
    >
      <ThemedText style={{ fontSize: 16, opacity: 0.7, textAlign: 'center' }}>
        {message}
      </ThemedText>
    </View>
  );
};
