export interface User {
  id: string;
  username: string;
  email: string;
  avatarUrl?: string;
  isAdmin?: boolean;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

export interface LoginFormData {
  username: string;
  password: string;
}

export interface RegisterFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}