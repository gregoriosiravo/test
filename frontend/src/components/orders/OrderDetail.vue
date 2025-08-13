<script setup lang="ts">
import ProductList from '@/components/products/ProductList.vue';
import OrderForm from '@/components/orders/OrderForm.vue';
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import { useOrdersStore } from '@/stores/orders';

import { onMounted } from 'vue';
import type { Order, Product } from '@/types';

const ordersStore = useOrdersStore();
const products = ref<Product[] | null>(null);
const route = useRoute();
const edit = ref(false);
const order = ref<Order | null>(null);

const triggerEdit = () => {
    if (!edit.value && order.value) {
        order.value = { ...order.value };
    }
    edit.value = !edit.value;
};

onMounted(async () => {
    const orderId = Number(route.params.id);
    await ordersStore.fetchOrderById(orderId);
    if (ordersStore.selectedOrder) {
        order.value = ordersStore.selectedOrder;
    }
    console.log('Fetched Order:', order.value);
});
const convertToDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('it-IT', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
};
const onSubmit = (updatedOrder: Order) => {
    console.log('Updated Order:', updatedOrder);
    ordersStore.updateOrder(updatedOrder);
    order.value = { ...updatedOrder };
    edit.value = false;
};
</script>

<template>
    <div v-if="!edit" class="container mt-4 text-center w-75">
        <h2>Dettaglio Ordine {{ $route.params.id }}</h2>
        <div v-if="order" class="text-start">
            <p><strong>Name:</strong> {{ order.name }}</p>
            <p><strong>Description:</strong> {{ order.description }}</p>
            <p><strong>Date(dd/mm/yyyy):</strong> {{ convertToDate(order.date) }}</p>
            <p><strong>Products:</strong>
                <ProductList :items="order.products">
                    <template #default="{ item }">
                        <div class="d-flex justify-content-between align-items-center">
                            <span>{{ item.name }}</span>
                            <span class="badge bg-primary rounded-pill">{{ item.price }}€</span>
                        </div>
                    </template>
                </ProductList>
            </p>
            <button class="btn btn-primary" @click="triggerEdit">Edit Order</button>
        </div>
    </div>
    <div v-else class="container mt-4 text-center custom-width">
        <OrderForm :modelValue="order" :products="products" @submit="onSubmit">
            <button class="btn btn-secondary mb-2 mx-4" @click="triggerEdit">Cancel</button>
        </OrderForm>
    </div>
</template>

<style scoped>
.custom-width {
    width: 600px;
}

@media (max-width: 768px) {
    .custom-width {
        width: 80%;
    }
}
</style>