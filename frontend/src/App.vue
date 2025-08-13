<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
</script>

<template>
  <header class="text-center">
    <img alt="Vue logo" class="logo" src="https://img.icons8.com/?size=100&id=42844&format=png&color=000000" width="125" height="125" />

    <div>
      <HelloWorld  />

      <nav> 
        <RouterLink class="btn btn-primary mx-2" to="/orders">Orders</RouterLink>
        <RouterLink class="btn btn-secondary" to="/products">Products</RouterLink>
      </nav>
    </div>
  </header>

  <RouterView />
</template>

<style scoped>
</style>
