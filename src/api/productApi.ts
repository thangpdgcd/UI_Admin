import { axiosClient } from "./axiosClient";

export interface ProductQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
}

export const productApi = {
  async getProducts(params: ProductQueryParams = {}) {
    const response = await axiosClient.get("/products", { params });
    return response.data;
  },

  async getProduct(id: string) {
    const response = await axiosClient.get(`/products/${id}`);
    return response.data;
  },

  async createProduct(data: FormData) {
    const response = await axiosClient.post("/products", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  async updateProduct(id: string, data: FormData) {
    const response = await axiosClient.put(`/products/${id}`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  async deleteProduct(id: string) {
    const response = await axiosClient.delete(`/products/${id}`);
    return response.data;
  },
};

