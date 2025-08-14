import { describe, it, expect, vi, beforeEach } from "vitest";
import OrderList from "@/components/orders/OrderList.vue";
import { mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { useOrdersStore } from "@/stores/orders";
import type { Order, Product } from "@/types";
import { nextTick } from "vue";

const mockOrders: Order[] = [
  {
    id: 1,
    name: "Test Order 1",
    description: "First test description",
    date: "2025-08-12",
  },
  {
    id: 2,
    name: "Test Order 2",
    description: "Second test description",
    date: "2025-08-13",
  },
  {
    id: 3,
    name: "Test Order 3",
    description: "Third test description",
    date: "2025-08-14",
  },
  {
    id: 4,
    name: "Test Order 4",
    description: "Fourth test description",
    date: "2025-08-15",
  },
];
vi.mock("node-fetch", () => ({
  default: vi.fn(),
}));

describe("OrderList.vue", () => {
  let wrapper: ReturnType<typeof mount>;
  let ordersStore: ReturnType<typeof useOrdersStore>;

  beforeEach(() => {
    const pinia = createPinia();
    setActivePinia(pinia);

    ordersStore = useOrdersStore();
    ordersStore.fetchOrders = vi.fn();
    ordersStore.loading = false;
    ordersStore.error = null;
    ordersStore.orders = mockOrders;
    console.log("Test — orders before mount:", ordersStore.orders);

    wrapper = mount(OrderList, {
      global: {
        plugins: [pinia],
      },
    });
    console.log("Test — orders after mount:", ordersStore.orders);
  });

  it("renders correctly", () => {
    expect(wrapper.exists()).toBe(true);
  });

  it("should display the orders", async () => {
    await nextTick();
    const orderItems = wrapper.findAll(".order-item");
    expect(orderItems).toHaveLength(4);

    expect(orderItems[0].text()).toContain("Test Order 1");
    expect(orderItems[1].text()).toContain("Test Order 2");
    expect(orderItems[2].text()).toContain("Test Order 3");
    expect(orderItems[3].text()).toContain("Test Order 4");
  });
});

describe("Orders Store", () => {
  let store: ReturnType<typeof useOrdersStore>;

  beforeEach(() => {
    setActivePinia(createPinia());
    store = useOrdersStore();
  });

  it("should call GET order endpoint", async () => {
    const fetchSpy = vi.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      json: async () => mockOrders,
    } as unknown as Response);

    await store.fetchOrders();

    expect(fetchSpy).toHaveBeenCalledWith("http://localhost:8000/api/orders");

    fetchSpy.mockRestore(); // clean up
  });

  it("should call DELETE order endpoint", async () => {
    const fetchSpy = vi
      .spyOn(global, "fetch")
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockOrders,
      } as unknown as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ message: "Order Deleted successfully" }),
      } as unknown as Response);

    await store.fetchOrders();
    await store.deleteOrder(1);

    expect(fetchSpy).toHaveBeenCalledWith(
      "http://localhost:8000/api/orders/1",
      { method: "DELETE" }
    );
    expect(store.orders).toHaveLength(3);
    expect(store.orders.find((o) => o.id === 1)).toBeUndefined();

    fetchSpy.mockRestore();
  });
});
