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

  <!-- Category filter navbar -->
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

  <!-- price filter form -->
  <div class="priceWrapper">
    <div>
      <input
        type="number"
        placeholder="Min Price"
        v-model.number="minPrice"
        class="minPriceInput"
      >
      <input
        type="number"
        placeholder="Max Price"
        v-model.number="maxPrice"
      >
      <button
        @click="applyFilters"
        class="priceButton"
      >
        Apply
      </button>
    </div>
    <div class="addItem" title="Lägg till" @click="addFormState(true)">
      <h1>+</h1>
    </div>
  </div>

  <!-- Add new item form -->
  <div v-if="productToEdit" class="newItemForm">
    <p @click="[addFormState(false), clearForm()]">X</p>
    <input
      type="text"
      placeholder="Title"
      v-model="titleText"
    >
    <textarea
      placeholder="description"
      v-model="descriptionText"
    ></textarea>
    <input
      type="number"
      placeholder="price"
      v-model="priceText"
    >
    <input
      type="text"
      placeholder="category"
      v-model="categoryText"
    >
    <input
      type="text"
      placeholder="imageUrl"
      v-model="imageLink"
    >
    <div>
      <div>
        <input type="checkbox" id="priceFormInput" checked="true">
        <label for="priceFormInput">available</label>
      </div>
      <img v-if="imageLink" src="" alt="">
    </div>
    <button
      v-if="titleText && descriptionText && priceText && categoryText && imageLink"
      @click="createItem"
    >
      Add
      </button>
  </div>

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
      @update="addFormState"
    />
  </div>

  <div v-else>
    <ProductCardSmall
      v-for="product in filteredProducts"
      :key="product.id"
      :product="product"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { fetchProducts } from '../api/jsonbin';
import ProductCard from '../components/ProductCard.vue';
import type { Product } from '../types/Product';
import '../styles/newItemForm.css';
import '../styles/productList.css';
import { saveItem } from '../api/jsonbin';
import ProductCardSmall from '../components/ProductCardSmall.vue';

const products = ref<Product[]>([]);
const filteredProducts = ref<Product[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);

const searchTerm = ref('');
const isGridView = ref(true);
const selectedCategory = ref<string | null>(null);

const minPrice = ref<null | number>(null);
const maxPrice = ref<null | number>(null);

const titleText = ref<string | null>(null);
const descriptionText = ref<string | null>(null);
const priceText = ref<number | null>(null);
const categoryText = ref<string | null>(null);
const imageLink = ref<null | string>(null);

const productToEdit = ref(false);
const addFormState = (state: boolean) => {
  productToEdit.value = state;
}

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

    const matchesPrice =
      (minPrice.value === null || product.price >= minPrice.value) &&
      (maxPrice.value === null || product.price <= maxPrice.value);
    return matchesSearch && matchesCategory && matchesPrice;
  });
}

const clearForm = () => {
  titleText.value = "";
  descriptionText.value = "";
  priceText.value = null;
  categoryText.value = "";
  imageLink.value = "";
}

const createItem = async () => {
  await saveItem({
    id: Date.now(),
    title: titleText.value,
    description: descriptionText.value,
    price: priceText.value,
    category: categoryText.value,
    imageUrl: imageLink.value,
    available: new Date().toISOString(),
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