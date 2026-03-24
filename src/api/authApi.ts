import { axiosClient } from "./axiosClient";

export interface AuthUser {
  _id: string;
  email: string;
  name: string;
  role: "admin" | "staff" | "user";
  avatar?: string;
}

export interface LoginResponse {
  user: AuthUser;
  token: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const authApi = {
  async login(email: string, password: string): Promise<LoginResponse> {
    const res = await axiosClient.post<ApiResponse<LoginResponse>>(
      "/auth/login",
      { email, password }
    );
    return res.data.data;
  },

  async register(
    fullName: string,
    email: string,
    password: string
  ): Promise<LoginResponse> {
    const res = await axiosClient.post<ApiResponse<LoginResponse>>(
      "/auth/register",
      { name: fullName, email, password }
    );
    return res.data.data;
  },
};
