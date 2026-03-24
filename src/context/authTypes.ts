import { createContext } from "react";

export interface User {
  _id: string;
  email: string;
  name: string;
  role: "admin" | "staff" | "user";
  avatar?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (fullName: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export const TOKEN_KEY = "token";
export const USER_KEY = "user";

