<script setup lang="ts">

const props = defineProps<{
  items?: Array<Record<string, any>>;
}>();
</script>

<template>
  <ul class="list-group text-start">
    <li v-for="item in items" :key="item.id || item.name" class="list-group-item">
      <slot :item="item">
        {{ JSON.stringify(item) }}
      </slot>
    </li>
  </ul>
</template>
