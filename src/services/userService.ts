import { axiosClient } from "@/api/axiosClient";

export type UserRole = "admin" | "staff" | "user";

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string | null;
  createdAt: string;
  updatedAt?: string;
}

export interface PaginatedUsers {
  users: User[];
  total: number;
  page: number;
  limit: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface GetUsersParams {
  page?: number;
  limit?: number;
  role?: UserRole | "";
}

export interface CreateUserBody {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface UpdateUserBody {
  name?: string;
  email?: string;
  role?: UserRole;
  avatar?: string;
}

async function getData<T>(res: { data: ApiResponse<T> }): Promise<T> {
  const { data } = res;
  if (!data.success && data.data === undefined) {
    throw new Error(data.message || "Request failed");
  }
  return data.data as T;
}

export const userService = {
  async getUsers(params: GetUsersParams = {}): Promise<PaginatedUsers> {
    const { page = 1, limit = 10, role } = params;
    const query = new URLSearchParams();
    query.set("page", String(page));
    query.set("limit", String(limit));
    if (role) query.set("role", role);
    const res = await axiosClient.get<ApiResponse<PaginatedUsers>>(
      `/users?${query.toString()}`
    );
    return getData(res);
  },

  async getUserById(id: string): Promise<User> {
    const res = await axiosClient.get<ApiResponse<User>>(`/users/${id}`);
    return getData(res);
  },

  async createUser(body: CreateUserBody): Promise<User> {
    const res = await axiosClient.post<ApiResponse<User>>("/users", body);
    return getData(res);
  },

  async updateUser(id: string, body: UpdateUserBody): Promise<User> {
    const res = await axiosClient.put<ApiResponse<User>>(`/users/${id}`, body);
    return getData(res);
  },

  async deleteUser(id: string): Promise<void> {
    const res = await axiosClient.delete<ApiResponse<null>>(`/users/${id}`);
    getData(res);
  },
};
