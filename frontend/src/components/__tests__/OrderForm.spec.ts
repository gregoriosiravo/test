import { describe, it, expect, beforeEach } from "vitest";
import OrderForm from "@/components/orders/OrderForm.vue";
import { mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { useOrdersStore } from "@/stores/orders";
import type { Order, Product } from "@/types";

describe("OrderForm.vue", () => {
  let wrapper: ReturnType<typeof mount>;

  beforeEach(() => {
    const pinia = createPinia();
    setActivePinia(pinia);

    const ordersStore = useOrdersStore();

    const mockOrder: Order = {
      id: 1,
      name: "Test Order",
      description: "Test Description",
      date: "2025-08-12",
      products: [
        { id: 1, name: "Test Product 1", price: 10, quantity: 1 } as Product,
        { id: 2, name: "Test Product 2", price: 20, quantity: 1 } as Product,
      ],
    };

    ordersStore.orders = [mockOrder];

    wrapper = mount(OrderForm, {
      global: {
        plugins: [pinia],
      },
    });
  });

  it("renders correctly", () => {
    expect(wrapper.exists()).toBe(true);
  });

  it("emits submit event with form data when submitted", async () => {
    await wrapper.find('input[id="name"]').setValue("Test Order 1");
    await wrapper.find('textarea[id="description"]').setValue("Description Test Order 1");
    await wrapper.find('input[id="date"]').setValue("2025-08-14");

    await wrapper.find("form").trigger("submit.prevent");

    expect(wrapper.emitted("submit")).toBeTruthy();

    type FormData = {
      name: string;
      description: string;
      date: string;
      quantity: string;
    };
    const emittedData = wrapper.emitted("submit")![0][0] as FormData;

    expect(emittedData.name).toBe("Test Order 1");
  });

  it("shows validation error if required fields are empty", async () => {
    wrapper.unmount();
    const pinia = createPinia();
    setActivePinia(pinia);
    const localWrapper = mount(OrderForm, {
      global: { plugins: [pinia] },
    });

    await localWrapper.find("form").trigger("submit.prevent");
    expect(localWrapper.text()).toContain("Name is required");
    expect(localWrapper.text()).toContain("Description is required");
  });

  
});
