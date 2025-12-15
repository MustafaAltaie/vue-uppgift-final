<!-- src>views>ProductList.vue -->
<template>
  <div class="tools">
    <div>
      <input
        v-model="searchTerm"
        placeholder="Sök produkter..."
        @input="applyFilters"
        class="searchInput"
      />
      <button @click="toggleView" class="searchButton">
        {{ isGridView ? 'Visa som lista' : 'Visa som rutnät' }}
      </button>
    </div>
    <h6>👈Klicka på knappen för att visa produkter som {{ isGridView ? 'lista' : 'rutnät' }} istället</h6>
  </div>

  <nav class="categoryNav" v-if="categories.length">
    <button
      :class="{ active: selectedCategory === null }"
      @click="selectCategory(null)"
    >
      Alla
    </button>
    <button
      v-for="category in categories"
      :key="category"
      :class="{ active: selectedCategory === category }"
      @click="selectCategory(category)"
    >
      {{ category }}
    </button>
  </nav>

  <div v-if="loading">Laddar produkter...</div>
  <div v-else-if="error">{{ error }}</div>
  <div v-if="!loading && filteredProducts.length === 0">
    Inga produkter hittades.
  </div>

  <div v-if="isGridView" class="grid">
    <ProductCard
      v-for="product in filteredProducts"
      :key="product.id"
      :product="product"
    />
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
import { ref, onMounted, computed } from 'vue';
import { fetchProducts } from '../api/jsonbin';
import ProductCard from '../components/ProductCard.vue';

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  available: boolean;
}

const products = ref<Product[]>([]);
const filteredProducts = ref<Product[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);

const searchTerm = ref('');
const isGridView = ref(false);
const selectedCategory = ref<string | null>(null);

const categories = computed(() => {
  return [...new Set(products.value.map(p => p.category))];
});

function toggleView() {
  isGridView.value = !isGridView.value;
}

function selectCategory(category: string | null) {
  selectedCategory.value = category;
  applyFilters();
}

function applyFilters() {
  const term = searchTerm.value.toLowerCase();

  filteredProducts.value = products.value.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(term);
    const matchesCategory =
      selectedCategory.value === null ||
      product.category === selectedCategory.value;

    return matchesSearch && matchesCategory;
  });
}

onMounted(async () => {
  loading.value = true;
  error.value = null;

  try {
    products.value = await fetchProducts();
    applyFilters();
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

.tools {
  display: flex;
  align-items: center;
  width: fit-content;
  gap: 10px;
  margin-top: 10px;
}

.searchInput,
.searchButton {
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

.categoryNav {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.categoryNav button {
  padding: 6px 14px;
  border-radius: 20px;
  border: 1px solid rgb(104, 157, 210);
  background: transparent;
  cursor: pointer;
  transition: 0.2s;
}

.categoryNav button.active,
.categoryNav button:hover {
  background: rgb(104, 157, 210);
  color: white;
}

.dark .categoryNav button {
  border-color: rgb(4, 57, 109);
}

.dark .categoryNav button.active {
  background: rgb(4, 57, 109);
}

.smallCard {
  display: flex;
  align-items: center;
  gap: 30px;
  height: 100px;
  margin-top: 10px;
  background-color: #eee;
  width: fit-content;
  padding-right: 65px;
  border-left: solid 10px rgb(104, 157, 210);
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

.smallCard img {
  height: 100%;
  width: 150px;
}

h4 {
  color: rgb(28, 105, 182);
}

h5 {
  color: red;
  font-size: 10px;
}

.cardButton {
  padding: 5px 30px;
  background-color: rgb(104, 157, 210);
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.dark .cardButton {
  background-color: rgb(7, 85, 163);
}
</style>
