import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import ProductList from "@/components/products/ProductList.vue";
import type { Product } from "@/types";
import { useProductsStore } from "@/stores/products";

const mockProducts: Product[] = [
  { id: 1, name: "Test Product 1", price: 10.99, quantity: 1 },
  { id: 2, name: "Test Product 2", price: 10.99, quantity: 1 },
  { id: 3, name: "Test Product 3", price: 10.99, quantity: 1 },
  { id: 4, name: "Test Product 4", price: 10.99, quantity: 1 },
];

describe("ProductList.vue", () => {
  let wrapper: ReturnType<typeof mount>;

  beforeEach(() => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockProducts,
    } as unknown as Response);

    const pinia = createPinia();
    setActivePinia(pinia);

    const productsStore = useProductsStore();
    productsStore.products = mockProducts;

    wrapper = mount(ProductList, {
      props: { items: mockProducts },
      global: { plugins: [pinia] },
    });
  });

  it("renders correctly", () => {
    expect(wrapper.exists()).toBe(true);
  });

  it("should display the products", () => {
    const productItems = wrapper.findAll(".list-group-item");
    expect(productItems).toHaveLength(4);
    expect(productItems[0].text()).toContain("Test Product 1");
    expect(productItems[1].text()).toContain("Test Product 2");
    expect(productItems[2].text()).toContain("Test Product 3");
    expect(productItems[3].text()).toContain("Test Product 4");
  });
});

describe("Products Store", () => {
  let store: ReturnType<typeof useProductsStore>;

  beforeEach(() => {
    setActivePinia(createPinia());
    store = useProductsStore();

  });

  it("should call GET order endpoint", async () => {
    const fetchSpy = vi.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      json: async () => mockProducts,
    } as unknown as Response);

    await store.fetchProducts();

    expect(fetchSpy).toHaveBeenCalledWith("http://localhost:8000/api/products");

    fetchSpy.mockRestore();
  });
});
