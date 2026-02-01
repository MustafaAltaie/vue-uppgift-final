<!-- src>views>ProductList.vue -->
<template>
  <!-- <input
    v-model="searchTerm"
    placeholder="Sök produkter..."
    @input="applyFilters"
    class="searchInput"
  />
  <button @click="toggleView" class="searchButton">
    {{ isGridView ? 'Visa som lista' : 'Visa som rutnät' }}
  </button> -->
  <ProductTools
    v-model:searchTerm="searchTerm"
    :isGridView="isGridView"
    @toggleView="toggleView"
  />

  <!-- Category filter navbar -->
  <nav class="categoryNav" v-if="categories.length">
    <button :class="{ active: selectedCategory === null }" @click="selectCategory(null)">Alla</button>
    <button
      v-for="category in categories"
      :key="category"
      :class="{ active: selectedCategory === category }"
      @click="selectCategory(category)"
    >{{ category }}</button>
  </nav>

  <!-- price filter form -->
  <div class="priceWrapper">
    <div>
      <input type="number" placeholder="Min Price" v-model.number="minPrice" class="minPriceInput">
      <input type="number" placeholder="Max Price" v-model.number="maxPrice">
      <button @click="applyFilters" class="priceButton">Apply</button>
    </div>
    <div class="addItem" title="Lägg till" @click="openCloseForm(true)" :style="{ pointerEvents: idText ? 'none' : 'auto' }">
      <h1>+</h1>
    </div>
  </div>

  <!-- Add new item form -->
  <div v-if="productToEdit" class="newItemForm">
    <p @click="closeForm">X</p>
    <input type="hidden" v-model="idText">
    <input type="text" placeholder="Title" v-model="titleText">
    <textarea placeholder="description" v-model="descriptionText"></textarea>
    <input type="number" placeholder="price" v-model="priceText">
    <input type="text" placeholder="category" v-model="categoryText">
    <input type="text" placeholder="imageUrl" v-model="imageLink">
    <div>
      <div>
        <input type="checkbox" id="priceFormInput" v-model="availablility">
        <label for="priceFormInput">available</label>
      </div>
      <img v-if="imageLink" :src="imageLink" alt="">
    </div>
    <button
      v-if="titleText && descriptionText && priceText && categoryText && imageLink"
      @click="createUpadteItem"
    >
      {{ idText ? 'Uppdatera' : 'Skapa' }}
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
      @update="updateItem"
      @delete="deleteItem"
    />
  </div>

  <div v-else>
    <ProductCardSmall
      v-for="product in filteredProducts"
      :key="product.id"
      :product="product"
      @update="updateItem"
      @delete="deleteItem"
    />
  </div>

  <WaitingModal
    v-if="waiting"
    :waitingMessage="waitingMessage"
  />
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
import { watch } from 'vue';

const products = ref<Product[]>([]);
const filteredProducts = ref<Product[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);

const searchTerm = ref('');
const isGridView = ref(true);
const selectedCategory = ref<string | null>(null);

watch(searchTerm, () => {
  applyFilters();
});

const minPrice = ref<null | number>(null);
const maxPrice = ref<null | number>(null);

const idText = ref<number | null>(null);
const titleText = ref<string | null>(null);
const descriptionText = ref<string | null>(null);
const priceText = ref<number | null>(null);
const categoryText = ref<string | null>(null);
const imageLink = ref<null | string>(null);
const availablility = ref(true);

const productToEdit = ref(false);
const updateItem = (product:Product) => {
  productToEdit.value = true;
  idText.value = product.id;
  titleText.value = product.title;
  descriptionText.value = product.description;
  priceText.value = product.price;
  categoryText.value = product.category;
  imageLink.value = product.imageUrl;
  availablility.value = product.available;
}

const BIN_ID = import.meta.env.VITE_BIN_ID;
const API_KEY = import.meta.env.VITE_API_KEY;
const BASE_URL = `https://api.jsonbin.io/v3/b/${BIN_ID}`;

import axios from 'axios';
import WaitingModal from '../composables/WaitingModal.vue';
import ProductTools from '../components/ProductTools.vue';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'X-Master-Key': API_KEY,
    'X-Bin-Meta': 'false',
    'Content-Type': 'application/json',
  },
});

const waiting = ref(false);
const waitingMessage = ref<string>('');

const createUpadteItem = async () => {
  waiting.value = true;
  waitingMessage.value = idText ? 'Uppdaterar föremålet' : 'Skapar föremålet';

  const item: Product = {
    id: idText.value || Date.now(),
    title: titleText.value!,
    description: descriptionText.value!,
    price: priceText.value!,
    category: categoryText.value!,
    imageUrl: imageLink.value!,
    available: availablility.value,
  }

  try {
    if (idText.value) {
      const index = products.value.findIndex(p => p.id === idText.value);
      if (index !== -1) products.value[index] = item;
      const fIndex = filteredProducts.value.findIndex(p => p.id === idText.value);
      if (fIndex !== -1) filteredProducts.value[fIndex] = item;
      const currentData = (await axiosInstance.get('')).data;
      currentData.items = products.value;
      await axiosInstance.put('', currentData);
    } else {
      await saveItem(item);
      filteredProducts.value.push(item);
      products.value.push(item);
    }
  } catch (err) {
    error.value = 'Kunde inte skapa föremålet';
  } finally {
    waiting.value = false;
    waitingMessage.value = '';
    openCloseForm(false);
  }
}

const deleteItem = async (id: string) => {
  const confirmDelete = confirm('Är du säker att du vill ta bort föremålet?');
  if (!confirmDelete) return;
  waiting.value = true;
  waitingMessage.value = 'Radering föremålet';
  error.value = null;
  try {
    const currentData = (await axiosInstance.get('')).data;
    currentData.items = (currentData.items || []).filter(
      (item: Product) => item.id !== Number(id)
    );

    await axiosInstance.put('', currentData);

    filteredProducts.value = filteredProducts.value.filter(item => item.id !== Number(id));
    products.value = products.value.filter(item => item.id !== Number(id));
  } catch (err) {
    error.value = 'Kunde inte ta bort föremålet';
  } finally {
    waiting.value = false;
    waitingMessage.value = '';
  }
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

const closeForm = () => {
  productToEdit.value = false;
  clearForm();
}

const openCloseForm = (state: boolean) => {
  productToEdit.value = state;
  if (!state) clearForm();
}

const clearForm = () => {
  idText.value = null;
  titleText.value = "";
  descriptionText.value = "";
  priceText.value = null;
  categoryText.value = "";
  imageLink.value = "";
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