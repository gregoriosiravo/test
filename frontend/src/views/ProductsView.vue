<script setup lang="ts">
import ProductList from '@/components/products/ProductList.vue';
import { useProductsStore } from '@/stores/products';
import { onMounted } from 'vue';

const productsStore = useProductsStore();
const products = productsStore.products;
onMounted(() => {
    productsStore.fetchProducts();
});
</script>

<template>
    <div>
        <ProductList class="my-2" :items="products">
             <template #default="{ item }">
                        <div class="d-flex justify-content-between align-items-center">
                            <span>{{ item.name }}</span>
                            <span class="badge bg-primary rounded-pill">{{ item.price }}€</span>
                        </div>
                    </template>
        </ProductList>
    </div>
</template>

<style scoped></style>