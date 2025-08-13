<script setup lang="ts">
import type { Order } from '@/types';
import OrderList from '@/components/orders/OrderList.vue'
import router from '@/router';

const goToDetailPage = (order: Order) => {
  router.push({ name: 'detail-order', params: { id: order.id } });
};
</script>

<template>
  <div class="container">
    <OrderList @order-detail="goToDetailPage"/>
  </div>
</template>

<style scoped>

</style>