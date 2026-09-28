# Minha participação

Participei da concepção da ideia do sistema e do desenvolvimento de partes da interface e experiência visual da aplicação, em colaboração com outro integrante da equipe.



# Sistema de Agendamento de Entrega

Um aplicativo React Native desenvolvido com Expo para gerenciamento de agendamentos de entrega, seguindo as melhores práticas de desenvolvimento.

## 🏗️ Arquitetura e Boas Práticas

### 📁 Estrutura de Pastas

```
my-app/
├── app/                    # Telas da aplicação
│   ├── (tabs)/           # Navegação por tabs
│   ├── admin.tsx         # Painel administrativo
│   ├── create-user.tsx   # Criação de usuários
│   ├── schedule.tsx      # Agendamento de entregas
│   ├── user-dashboard.tsx # Dashboard do usuário
│   └── user-deliveries.tsx # Histórico de entregas
├── components/           # Componentes reutilizáveis
│   └── ui/              # Componentes de interface
├── hooks/               # Hooks personalizados
├── styles/              # Estilos centralizados
├── database.ts          # Lógica do banco de dados
└── package.json
```

### 🎨 Separação de Responsabilidades

#### **Estilos (`styles/index.ts`)**
- Todos os estilos CSS separados dos componentes
- Estilos organizados por tela/funcionalidade
- Reutilização de estilos comuns

#### **Componentes (`components/ui/index.tsx`)**
- Componentes reutilizáveis e modulares
- Props tipadas com TypeScript
- Componentes: `Button`, `LogoutButton`, `StatusBadge`, `LoadingScreen`, `EmptyState`

#### **Hooks (`hooks/index.ts`)**
- Lógica de negócio separada da UI
- Hooks personalizados para cada funcionalidade:
  - `useAuth`: Autenticação
  - `useCreateUser`: Criação de usuários
  - `useAppointments`: Gerenciamento de agendamentos
  - `useUserSchedule`: Agendamento de usuários
  - `useUserDeliveries`: Entregas do usuário
  - `useDatabase`: Inicialização do banco

#### **Banco de Dados (`database.ts`)**
- Interface SQLite com Expo
- Funções tipadas para todas as operações
- Tratamento de erros consistente

## 🚀 Funcionalidades

### 👤 **Para Usuários**
- **Dashboard**: Visualização de estatísticas pessoais
- **Agendamento**: Seleção de data e horário com capacidade máxima
- **Histórico**: Visualização de todas as entregas (pendentes, concluídas, falhadas)
- **Navegação**: Entre telas de agendamento e histórico

### 👨‍💼 **Para Administradores**
- **Painel Completo**: Todas as entregas do sistema
- **Estatísticas**: Contadores em tempo real
- **Gerenciamento**: Marcar entregas como concluídas ou falhadas
- **Visão Detalhada**: Informações completas de cada entrega

### 🔐 **Sistema de Autenticação**
- Login baseado em credenciais específicas
- Redirecionamento automático baseado no tipo de usuário

### 📊 **Banco de Dados**
- **SQLite** para persistência local
- Tabelas: `users` e `appointments`
- Dados permanentes entre sessões

## 🛠️ Tecnologias

- **React Native + Expo**: Framework mobile
- **TypeScript**: Tipagem estática
- **SQLite**: Banco de dados local
- **Expo Router**: Navegação
- **Componentes Temáticos**: Suporte a modo claro/escuro


O app está completamente refatorado seguindo as melhores práticas de desenvolvimento, com código mais limpo, manutenível e escalável.
