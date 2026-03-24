import { axiosClient } from "./axiosClient";

export interface OrderQueryParams {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
}

export const orderApi = {
  async getOrders(params: OrderQueryParams = {}) {
    // Admin/staff orders listing comes from /orders/all
    const response = await axiosClient.get("/orders/all", { params });
    return response.data;
  },

  async getOrder(id: string) {
    const response = await axiosClient.get(`/orders/${id}`);
    return response.data;
  },

  async markPaid(id: string) {
    // Map "mark paid" action to backend status update
    const response = await axiosClient.put(`/orders/${id}/status`, {
      status: "confirmed",
    });
    return response.data;
  },

  async markDelivered(id: string) {
    const response = await axiosClient.put(`/orders/${id}/status`, {
      status: "delivered",
    });
    return response.data;
  },
};

