import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import OrderDetail from "@/components/orders/OrderDetail.vue";
import { useOrdersStore } from "@/stores/orders";
import type { Order } from "@/types";

vi.mock("@/components/products/ProductList.vue", () => ({
  default: { template: "<div>ProductList</div>" },
}));

vi.mock("@/components/orders/OrderForm.vue", () => ({
  default: { template: "<div>OrderForm</div>" },
}));

const mockRoute = { params: { id: "1" } };
vi.mock("vue-router", () => ({
  useRoute: () => mockRoute,
}));

describe("OrderDetail Component - Unit Tests", () => {
  let wrapper: any;

  beforeEach(() => {
    const pinia = createPinia();
    setActivePinia(pinia);

    wrapper = mount(OrderDetail, {
      global: {
        plugins: [pinia],
        mocks: {
          $route: mockRoute,
        },
      },
    });
  });

  describe("triggerEdit function", () => {
    it("should toggle edit mode", () => {
      const vm = wrapper.vm;

      expect(vm.edit).toBe(false);

      vm.triggerEdit();
      expect(vm.edit).toBe(true);

      vm.triggerEdit();
      expect(vm.edit).toBe(false);
    });

    it("should create a copy of order when entering edit mode", () => {
      const vm = wrapper.vm;
      const originalOrder: Order = {
        id: 1,
        name: "Test Order 1",
        description: "Test Description 1",
        date: "2025-08-10",
        products: [],
      };

      vm.order = originalOrder;
      vm.edit = false;

      vm.triggerEdit();

      expect(vm.edit).toBe(true);
      expect(vm.order).not.toBe(originalOrder);
      expect(vm.order).toEqual(originalOrder);
    });

    it("should not create copy of order", () => {
      const vm = wrapper.vm;
      const originalOrder: Order = {
        id: 1,
        name: "Test Order 1",
        description: "Test Description 1",
        date: "2025-08-10",
        products: [],
      };

      vm.order = originalOrder;
      vm.edit = true;

      const orderBeforeToggle = vm.order;
      vm.triggerEdit();

      expect(vm.edit).toBe(false);
      expect(vm.order).toBe(orderBeforeToggle);
    });
  });

  describe("onSubmit function", () => {
    it("should update order and exit edit mode", () => {
      const vm = wrapper.vm;
      const updatedOrder: Order = {
        id: 1,
        name: "Updated TEST Order",
        description: "Updated TEST Description",
        date: "2025-08-14",
        products: [],
      };

      const store = useOrdersStore();
      const updateSpy = vi
        .spyOn(store, "updateOrder")
        .mockImplementation(() => Promise.resolve());

      vm.edit = true;
      vm.onSubmit(updatedOrder);

      expect(updateSpy).toHaveBeenCalledWith(updatedOrder);
      expect(vm.order).toEqual(updatedOrder);
      expect(vm.edit).toBe(false);

      updateSpy.mockRestore();
    });
  });

  describe("Conditional rendering logic", () => {
    it("should show order details when not in edit mode and order exists", async () => {
      const vm = wrapper.vm;
      vm.edit = false;
      vm.order = {
        id: 1,
        name: "Test Order",
        description: "Test Description",
        date: "2025-08-12",
        products: [],
      };

      await wrapper.vm.$nextTick();

      expect(wrapper.find(".container.mt-4.text-center.w-75").exists()).toBe(
        true
      );
      expect(
        wrapper.find(".container.mt-4.text-center.custom-width").exists()
      ).toBe(false);
    });

    it("should show order form when in edit mode", async () => {
      const vm = wrapper.vm;
      vm.edit = true;

      await wrapper.vm.$nextTick();

      expect(wrapper.find(".container.mt-4.text-center.w-75").exists()).toBe(
        false
      );
      expect(
        wrapper.find(".container.mt-4.text-center.custom-width").exists()
      ).toBe(true);
    });
  });
});

describe("Orders Store - Unit Tests", () => {
  let store: any;

  beforeEach(() => {
    const pinia = createPinia();
    setActivePinia(pinia);
    store = useOrdersStore();

    global.fetch = vi.fn();
  });

  describe("State initialization", () => {
    it("should have correct initial state", () => {
      expect(store.orders).toEqual([]);
      expect(store.selectedOrder).toBe(null);
      expect(store.loading).toBe(false);
      expect(store.error).toBe(null);
    });
  });

  describe("Getters", () => {
    it("should return correct values from getters", () => {
      const mockOrder: Order = {
        id: 1,
        name: "Test Order",
        description: "Test Description",
        date: "2025-08-12",
        products: [],
      };

      store.orders = [mockOrder];
      store.selectedOrder = mockOrder;
      store.loading = true;
      store.error = "Test error";

      expect(store.getOrders).toEqual([mockOrder]);
      expect(store.getSelectedOrder).toEqual(mockOrder);
      expect(store.isLoading).toBe(true);
      expect(store.getError).toBe("Test error");
    });
  });

  describe("fetchOrderById action", () => {
    it("should set loading to true initially", () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({}),
      } as Response);

      store.fetchOrderById(1);
      expect(store.loading).toBe(true);
    });

    it("should call correct API endpoint", async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({}),
      } as Response);

      await store.fetchOrderById(1);

      expect(fetch).toHaveBeenCalledWith(
        "http://localhost:8000/api/orders/1"
      );
    });
  });

  describe("updateOrder action", () => {
    it("should call API with correct parameters", async () => {
      const mockOrder: Order = {
        id: 1,
        name: "Test Order",
        description: "Test Description",
        date: "2025-08-12",
        products: [],
      };

      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockOrder),
      } as Response);

      await store.updateOrder(mockOrder);

      expect(fetch).toHaveBeenCalledWith("http://localhost:8000/api/orders/1", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-Requested-With": "XMLHttpRequest",
        },
        body: JSON.stringify(mockOrder),
      });
    });

    it("should update orders array when order exists", async () => {
      const originalOrder: Order = {
        id: 1,
        name: "Test Order",
        description: "Test Description",
        date: "2025-08-12",
        products: [],
      };

      const updatedOrder: Order = {
        ...originalOrder,
        name: "Updated",
      };

      store.orders = [originalOrder];

      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(updatedOrder),
      } as Response);

      await store.updateOrder(updatedOrder);

      expect(store.orders[0]).toEqual(updatedOrder);
      expect(store.selectedOrder).toEqual(updatedOrder);
    });
  });
});
