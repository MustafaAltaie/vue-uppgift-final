<template>
  <div>
    <input v-model="searchTerm" placeholder="Sök produkter..." @input="filterProducts" />
    <button @click="toggleView">{{ isGridView ? 'Lista' : 'Rutnät' }}</button>

    <div v-if="loading">Laddar produkter...</div>
    <div v-if="error">{{ error }}</div>

    <div v-if="!loading && filteredProducts.length === 0">Inga produkter hittades.</div>

    <div v-if="isGridView" class="grid">
      <ProductCard v-for="product in filteredProducts" :key="product.id" :product="product" />
    </div>
    <ul v-else>
      <li v-for="product in filteredProducts" :key="product.id">
        <router-link :to="`/product/${product.id}`">{{ product.name }}</router-link> - {{ product.price }} USD
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { fetchProducts } from '../api/jsonbin';
import ProductCard from '../components/ProductCard.vue';

interface Product {
  id: string;
  name: string;
  category: string;
  shortDescription: string;
  features: string[];
  price: number;
}

const products = ref<Product[]>([]);
const filteredProducts = ref<Product[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);
const searchTerm = ref('');
const isGridView = ref(true);

function filterProducts() {
  const term = searchTerm.value.toLowerCase();
  filteredProducts.value = products.value.filter(p => p.name.toLowerCase().includes(term));
}

function toggleView() {
  isGridView.value = !isGridView.value;
}

onMounted(async () => {
  loading.value = true;
  error.value = null;
  try {
    products.value = await fetchProducts();
    filteredProducts.value = products.value;
  } catch (e) {
    error.value = 'Kunde inte ladda produkter.';
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.grid {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}
</style>