<template>
  <div class="card">
    <router-link :to="`/product/${product.id}`">
      <h3>{{ product.name }}</h3>
      <p>{{ product.shortDescription }}</p>
      <p><strong>Pris:</strong> {{ product.price }} USD</p>
    </router-link>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';

interface Product {
  id: string;
  name: string;
  shortDescription: string;
  price: number;
}

const props = defineProps<{ product: Product }>();
</script>

<style scoped>
.card {
  border: 1px solid #ccc;
  padding: 1rem;
  width: 200px;
  border-radius: 4px;
  transition: box-shadow 0.3s ease;
}
.card:hover {
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
}
</style>