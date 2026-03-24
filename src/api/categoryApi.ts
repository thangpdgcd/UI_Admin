import { axiosClient } from "./axiosClient";

export interface CategoryQueryParams {
  page?: number;
  limit?: number;
  search?: string;
}

export const categoryApi = {
  async getCategories(params: CategoryQueryParams = {}) {
    const response = await axiosClient.get("/categories", { params });
    return response.data;
  },

  async getCategory(id: string) {
    const response = await axiosClient.get(`/categories/${id}`);
    return response.data;
  },

  async createCategory(data: FormData | Record<string, unknown>) {
    const payload = data instanceof FormData ? data : data;
    const response = await axiosClient.post("/categories", payload);
    return response.data;
  },

  async updateCategory(id: string, data: FormData | Record<string, unknown>) {
    const payload = data instanceof FormData ? data : data;
    const response = await axiosClient.put(`/categories/${id}`, payload);
    return response.data;
  },

  async deleteCategory(id: string) {
    const response = await axiosClient.delete(`/categories/${id}`);
    return response.data;
  },
};

