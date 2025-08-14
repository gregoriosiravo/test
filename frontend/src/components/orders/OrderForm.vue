<script setup lang="ts">
import { reactive, ref, watch, computed } from 'vue';
import type { Order, Product } from '@/types';
import { useProductsStore } from '@/stores/products';


const productsStore = useProductsStore();
productsStore.fetchProducts();

const products = computed(() => productsStore.products);

const props = defineProps<{
  modelValue?: Order | null;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: Order): void;
  (e: 'submit', value: Order): void;
}>();

const form = reactive<Order>({
  id: props.modelValue?.id ?? 0,
  name: props.modelValue?.name ?? '',
  description: props.modelValue?.description ?? '',
  date: props.modelValue?.date ?? '',
  products: props.modelValue?.products ? [...props.modelValue.products] : [],
});

const selectedProductId = ref<number | ''>('');

watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal) {
      form.id = newVal.id;
      form.name = newVal.name;
      form.description = newVal.description;
      form.date = newVal.date;
      form.products = newVal.products ? [...newVal.products] : [];
    }
  }
);

watch(
  form,
  () => {
    emit('update:modelValue', { ...form });
  },
  { deep: true }
);

const removeProduct = (productId: number) => {
  form.products = form.products?.filter((p) => p.id !== productId) ?? [];
};

const addProductToOrder = () => {
  if (!selectedProductId.value) return;

  const product = products.value.find(p => p.id === selectedProductId.value);
  if (product && !form.products?.some(p => p.id === product.id)) {
    form.products?.push({
      ...product,
      quantity: 1,
    });
  }
  selectedProductId.value = '';
};

const onSubmit = () => {
  if (!form.name.trim()) {
    alert('Il nome è obbligatorio');
    return;
  }
  if (!form.date) {
    alert('La data è obbligatoria');
    return;
  }
  emit('submit', { ...form });
};
</script>
<template>
  <form @submit.prevent="onSubmit" class="mx-auto">

    <div class="mb-3">
      <label for="name" class="form-label fw-semibold">Name</label>
      <span class="text-danger" v-if="!form.name.trim()">Name is required</span>
      <input id="name" v-model="form.name" type="text" class="form-control" placeholder="Nome ordine" required />
    </div>

    <div class="mb-3">
      <label for="description" class="form-label fw-semibold">Description</label>
      <span class="text-danger" v-if="!form.description.trim()">Description is required</span>
      <textarea id="description" v-model="form.description" class="form-control" placeholder="Descrizione ordine"
        rows="3"></textarea>
    </div>

    <div class="mb-3">
      <label for="date" class="form-label fw-semibold">Date</label>
      <input id="date" v-model="form.date" type="date" class="form-control" required />
    </div>

    <div class="mb-3">
      <label for="productSelect" class="form-label fw-semibold">Add Product</label>
      <div class="d-flex gap-2">
        <select id="productSelect" v-model="selectedProductId" class="form-select">
          <option disabled value="">Select a product to add</option>
          <option v-for="prod in productsStore.products" :key="prod.id" :value="prod.id"
            :disabled="form.products?.some(p => p.id === prod.id)">
            {{ prod.name }} - €{{ prod.price }}
          </option>
        </select>
        <button type="button" class="btn btn-outline-primary" @click="addProductToOrder">Add</button>
      </div>
    </div>

    <div v-if="form.products && form.products.length" class="mb-3">
      <span class="form-label fw-semibold">Associated Products</span>
      <ul class="list-group">
        <li v-for="(p, index) in form.products" :key="p.id"
          class="list-group-item d-flex justify-content-between align-items-center">

          <div class="d-flex align-items-center gap-2">
            <span>{{ p.name }} - €{{ p.price*p.quantity }}</span>
            <input id="quantity" type="number" v-model.number="form.products[index].quantity" min="1"
              class="form-control form-control-sm mx-2" style="width: 50px;" />
          </div>

          <button type="button" class="btn btn-sm btn-outline-danger" @click="removeProduct(p.id)">
            Remove
          </button>
        </li>
      </ul>
    </div>

    <button type="submit" class="btn btn-primary mb-2">
      Save Order
    </button>
    <slot></slot>
  </form>
</template>
