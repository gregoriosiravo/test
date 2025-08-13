import type { Order } from "@/types";
import { defineStore } from "pinia";

export const useOrdersStore = defineStore("orders", {
  state: () => ({
    orders: [] as Order[],
    selectedOrder: null as Order | null,
    loading: false,
    error: undefined as string | undefined,
  }),
  getters: {
    getOrders: (state) => state.orders,
    getSelectedOrder: (state) => state.selectedOrder,
    isLoading: (state) => state.loading,
    getError: (state) => state.error,
  },
  actions: {
    async fetchOrders() {
      this.loading = true;
      try {
        const res = await fetch("http://localhost:8000/api/orders");
        if (!res.ok) throw new Error("Error while loading orders");
        this.orders = await res.json();
      } catch (e) {
        console.log((e as Error).message);
      } finally {
        this.loading = false;
      }
    },
    async fetchOrderById(id: number) {
      this.loading = true;
      try {
        const res = await fetch(`http://localhost:8000/api/orders/${id}`);
        if (!res.ok) throw new Error("Error while loading order");
        this.selectedOrder = await res.json();
      } catch (e) {
        console.log((e as Error).message);
      } finally {
        this.loading = false;
      }
    },
    async updateOrder(order: Order) {
      this.loading = true;
      console.log("Updating order:", order);
      try {
        const res = await fetch(
          `http://localhost:8000/api/orders/${order.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json", // Add this
              "X-Requested-With": "XMLHttpRequest", // Add this
            },
            body: JSON.stringify(order),
          }
        );
        if (!res.ok) throw new Error("Error while updating order");
        const updatedOrder = await res.json();
        const index = this.orders.findIndex((o) => o.id === updatedOrder.id);
        if (index !== -1) {
          this.orders[index] = updatedOrder;
        }
        this.selectedOrder = updatedOrder;
      } catch (err) {
        this.error = (err as Error).message;
      } finally {
        this.loading = false;
      }
    },
    async deleteOrder(id: number) {
      try {
        await fetch(`http://localhost:8000/api/orders/${id}`, {
          method: "DELETE",
        });
        this.orders = this.orders.filter((o) => o.id !== id);
      } catch (err) {
        this.error = (err as Error).message;
      }
    },
  },
});
