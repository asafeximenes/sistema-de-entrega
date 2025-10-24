import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('delivery_app.db');

export interface User {
  id: number;
  email: string;
  name: string;
  address: string;
  isAdmin: boolean;
  createdAt: string;
}

export interface Appointment {
  id: number;
  userId: number;
  date: string;
  time: string;
  status: 'pending' | 'completed' | 'failed';
  createdAt: string;
}

// Inicializar o banco de dados
export const initDatabase = () => {
  return new Promise<void>((resolve, reject) => {
    try {
      db.execSync(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          email TEXT UNIQUE NOT NULL,
          name TEXT NOT NULL,
          address TEXT NOT NULL,
          isAdmin INTEGER DEFAULT 0,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
        );
      `);

      db.execSync(`
        CREATE TABLE IF NOT EXISTS appointments (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          userId INTEGER NOT NULL,
          date TEXT NOT NULL,
          time TEXT NOT NULL,
          status TEXT DEFAULT 'pending',
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (userId) REFERENCES users (id)
        );
      `);

      // Inserir usuário admin padrão
      db.runSync(
        `INSERT OR IGNORE INTO users (email, name, address, isAdmin) VALUES (?, ?, ?, ?)`,
        ['admin@admin.com', 'Administrador', 'Endereço Admin', 1]
      );

      // Inserir alguns usuários de exemplo
      db.runSync(
        `INSERT OR IGNORE INTO users (email, name, address, isAdmin) VALUES (?, ?, ?, ?)`,
        ['luquinhas@mdisia.com', 'Lucas', 'Rua das Flores, 123', 0]
      );

      console.log('Banco de dados inicializado com sucesso');
      resolve();
    } catch (error) {
      console.error('Erro ao inicializar banco de dados:', error);
      reject(error);
    }
  });
};

// Funções para usuários
export const createUser = (email: string, name: string, address: string): Promise<number> => {
  return new Promise((resolve, reject) => {
    try {
      const result = db.runSync(
        'INSERT INTO users (email, name, address) VALUES (?, ?, ?)',
        [email, name, address]
      );
      resolve(result.lastInsertRowId);
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      reject(error);
    }
  });
};

export const getUserByEmail = (email: string): Promise<User | null> => {
  return new Promise((resolve, reject) => {
    try {
      const result = db.getAllSync(
        'SELECT * FROM users WHERE email = ?',
        [email]
      );
      
      if (result.length > 0) {
        const user = result[0] as any;
        resolve({
          id: user.id,
          email: user.email,
          name: user.name,
          address: user.address,
          isAdmin: user.isAdmin === 1,
          createdAt: user.createdAt
        });
      } else {
        resolve(null);
      }
    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
      reject(error);
    }
  });
};

export const getAllUsers = (): Promise<User[]> => {
  return new Promise((resolve, reject) => {
    try {
      const result = db.getAllSync('SELECT * FROM users ORDER BY createdAt DESC');
      const users: User[] = result.map((user: any) => ({
        id: user.id,
        email: user.email,
        name: user.name,
        address: user.address,
        isAdmin: user.isAdmin === 1,
        createdAt: user.createdAt
      }));
      resolve(users);
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      reject(error);
    }
  });
};

// Funções para agendamentos
export const createAppointment = (userId: number, date: string, time: string): Promise<number> => {
  return new Promise((resolve, reject) => {
    try {
      const result = db.runSync(
        'INSERT INTO appointments (userId, date, time) VALUES (?, ?, ?)',
        [userId, date, time]
      );
      resolve(result.lastInsertRowId);
    } catch (error) {
      console.error('Erro ao criar agendamento:', error);
      reject(error);
    }
  });
};

export const getAppointmentsByDate = (date: string): Promise<Appointment[]> => {
  return new Promise((resolve, reject) => {
    try {
      const result = db.getAllSync(
        'SELECT * FROM appointments WHERE date = ? ORDER BY time',
        [date]
      );
      const appointments: Appointment[] = result.map((appointment: any) => ({
        id: appointment.id,
        userId: appointment.userId,
        date: appointment.date,
        time: appointment.time,
        status: appointment.status,
        createdAt: appointment.createdAt
      }));
      resolve(appointments);
    } catch (error) {
      console.error('Erro ao buscar agendamentos:', error);
      reject(error);
    }
  });
};

export const getAllAppointments = (): Promise<(Appointment & { userName: string; userEmail: string; userAddress: string })[]> => {
  return new Promise((resolve, reject) => {
    try {
      const result = db.getAllSync(`
        SELECT a.*, u.name as userName, u.email as userEmail, u.address as userAddress 
        FROM appointments a 
        JOIN users u ON a.userId = u.id 
        ORDER BY a.date DESC, a.time DESC
      `);
      
      const appointments: (Appointment & { userName: string; userEmail: string; userAddress: string })[] = result.map((appointment: any) => ({
        id: appointment.id,
        userId: appointment.userId,
        date: appointment.date,
        time: appointment.time,
        status: appointment.status,
        createdAt: appointment.createdAt,
        userName: appointment.userName,
        userEmail: appointment.userEmail,
        userAddress: appointment.userAddress
      }));
      resolve(appointments);
    } catch (error) {
      console.error('Erro ao buscar todos os agendamentos:', error);
      reject(error);
    }
  });
};

export const updateAppointmentStatus = (id: number, status: 'completed' | 'failed'): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      db.runSync(
        'UPDATE appointments SET status = ? WHERE id = ?',
        [status, id]
      );
      resolve();
    } catch (error) {
      console.error('Erro ao atualizar status do agendamento:', error);
      reject(error);
    }
  });
};

export const getAppointmentCountByTimeSlot = (date: string, time: string): Promise<number> => {
  return new Promise((resolve, reject) => {
    try {
      const result = db.getFirstSync(
        'SELECT COUNT(*) as count FROM appointments WHERE date = ? AND time = ? AND status != ?',
        [date, time, 'failed']
      );
      resolve((result as any).count);
    } catch (error) {
      console.error('Erro ao contar agendamentos:', error);
      reject(error);
    }
  });
};

export const isDateFullyBooked = (date: string): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    try {
      const timeSlots = ['08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'];
      let fullyBooked = true;

      for (const timeSlot of timeSlots) {
        const result = db.getFirstSync(
          'SELECT COUNT(*) as count FROM appointments WHERE date = ? AND time = ? AND status != ?',
          [date, timeSlot, 'failed']
        );
        const count = (result as any).count;
        if (count < 2) {
          fullyBooked = false;
          break;
        }
      }

      resolve(fullyBooked);
    } catch (error) {
      console.error('Erro ao verificar se data está lotada:', error);
      reject(error);
    }
  });
};