<!-- src>views>ProductList.vue -->
<template>
  <div class="tools">
    <div>
      <input v-model="searchTerm" placeholder="Sök produkter..." @input="filterProducts" class="searchInput" />
      <button @click="toggleView" class="searchButton">{{ isGridView ? 'Visa som lista' : 'Visa som rutnät' }}</button>
    </div>
    <h6>👈Klicka på knappen för att visa produkter som {{ isGridView ? 'lista' : 'rutnät' }} istället</h6>
  </div>
  <div v-if="loading">Laddar produkter...</div>
  <div v-else-if="error">{{ error }}</div>
  <div v-if="!loading && filteredProducts.length === 0">Inga produkter hittades.</div>

  <div v-if="isGridView" class="grid">
    <ProductCard v-for="product in filteredProducts" :key="product.id" :product="product" />
  </div>
  <div v-else>
    <div class="smallCard" v-for="product in filteredProducts" :key="product.id">
      <img :src="product.imageUrl" alt="">
      <h4>{{ product.title }}</h4>
      <p>{{ product.description }}</p>
      <p>{{ product.price }}:-</p>
      <router-link :to="`/product/${product.id}`">
        <button class="cardButton" v-if="product.available">
          Boka nu
        </button>
      </router-link>
      <h5 v-if="!product.available">
        Ej tillgänglig
      </h5>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { fetchProducts } from '../api/jsonbin';
import ProductCard from '../components/ProductCard.vue';

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  category: number;
  imageUrl: string;
  available: boolean;
}

const products = ref<Product[]>([]);
const filteredProducts = ref<Product[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);
const searchTerm = ref('');
const isGridView = ref(false);

function filterProducts() {
  const term = searchTerm.value.toLowerCase();
  filteredProducts.value = products.value.filter(p => p.title.toLowerCase().includes(term));
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
    padding-top: 20px;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 20px;
  }
  .wrapper {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    padding-top: 10px;
  }
  .tools {
    display: flex;
    align-items: center;
    width: fit-content;
    gap: 10px;
    margin-top: 10px;
  }
  .searchInput, .searchButton {
    border: 1px solid;
    outline: none;
    padding: 10px;
    border-radius: 20px 0 0 20px;
  }
  .searchButton {
    margin-left: -1px;
    border-radius: 0 20px 20px 0;
    cursor: pointer;
  }
  h4 {
    color: rgb(28, 105, 182);
  }
  .smallCard {
    display: flex;
    align-items: center;
    gap: 30px;
    height: 100px;
    margin-top: 10px;
    background-color: #eee;
    text-decoration: none;
    width: fit-content;
    padding-right: 50px;
    border-left: solid 10px rgb(104, 157, 210);
    color: #000;
    transition: 0.3s;
    clip-path: polygon(0 0, 100% 0, 95% 50%, 100% 100%, 0 100%);
  }
  .dark .smallCard {
    background-color: #222;
    color: #fff;
    border-left: solid 10px rgb(4, 57, 109);
  }
  .smallCard:hover {
    transform: translateX(10px);
  }
  .smallCard  > img {
    height: 100%;
    width: 150px;
  }
  h5 {
    color: red;
    font-size: 10px;
  }
  .cardButton {
    padding: 5px;
    cursor: pointer;
    padding: 5px 30px;
    background-color: rgb(104, 157, 210);
    color: #fff;
    border: none;
    border-radius: 5px;
  }
  .dark .cardButton {
    background-color: rgb(7, 85, 163);
  }
</style>