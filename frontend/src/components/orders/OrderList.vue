<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import type { Order } from '@/types';
import { useOrdersStore } from '@/stores/orders';

const ordersStore = useOrdersStore();

const searchTerm = ref('');
const filterDate = ref('');

const filteredOrders = computed<Order[]>(() => {
  return ordersStore.orders.filter(order => {
    const matchSearch =
      order.name.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      order.description.toLowerCase().includes(searchTerm.value.toLowerCase());

    const matchDate = filterDate.value
      ? order.date === filterDate.value
      : true;
    return matchSearch && matchDate;
  });
});

onMounted(() => {
  ordersStore.fetchOrders();
  
});
</script>

<template>
  <div class="p-4 text-center">
    <h1 class="mb-4 fw-bold">Lista Ordini</h1>

    <div class="d-flex gap-3 mb-4 justify-content-center">
      <input v-model="searchTerm" type="text" placeholder="Cerca per nome o descrizione" class="form-control w-50" />
      <input v-model="filterDate" type="date" class="form-control" style="max-width: 200px;" />
    </div>

    <div v-if="ordersStore.loading" class="text-center">Caricamento ordini...</div>
    <div v-else-if="ordersStore.error" class="text-danger">
      Errore: {{ ordersStore.error }}
    </div>

    <ul v-else class="list-unstyled p-0 text-start">
      <li v-for="order in filteredOrders" :key="order.id"
        class="d-flex justify-content-between align-items-center border-bottom py-2">
        <div>
          <div class="fw-semibold">{{ order.name }}</div>
          <div class="text-muted small">{{ order.description }}</div>
          <div class="text-muted fst-italic small">
            Data: {{ order.date}}
          </div>
        </div>
        <div class="d-flex gap-2">
          <button class="btn btn-primary btn-sm" @click="$emit('orderDetail', order)">
            Vedi
          </button>
          <button class="btn btn-danger btn-sm" @click="ordersStore.deleteOrder(order.id)">
            Elimina
          </button>
        </div>
      </li>
    </ul>
  </div>
</template>
