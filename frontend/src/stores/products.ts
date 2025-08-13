import type { Product } from "@/types";
import { defineStore } from "pinia";

export const useProductsStore = defineStore("products", {
  state: () => ({
    products: [] as Product[],
    loading: false,
    error: undefined as string | undefined,
  }),
  getters: {
    getOrders: (state) => state.products,
    isLoading: (state) => state.loading,
    getError: (state) => state.error,
  },
  actions: {
    async fetchProducts() {
      this.loading = true;
      try {
        const res = await fetch("http://localhost:8000/api/products");
        if (!res.ok) throw new Error("Error while loading products");
        this.products = await res.json();
      } catch (e) {
        console.log((e as Error).message);
      } finally {
        this.loading = false;
      }
    },
  },
  
});
