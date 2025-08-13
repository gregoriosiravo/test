import { createRouter, createWebHistory } from "vue-router";
import OrdersView from "@/views/OrdersView.vue";
import OrderDetail from "@/views/OrderDetailView.vue";
import Products from "@/views/ProductsView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/orders",
      name: "orders",
      component: OrdersView,
    },
    {
      path: "/orders/detail/:id", 
      name: "detail-order",
      component: OrderDetail,
    },
    {
      path: "/products",
      name: "products",
      component: Products,
    },
  ],
});

export default router;
