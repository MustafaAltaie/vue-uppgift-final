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

  <select v-model="sortOrder" @change="applyFilters">
    <option :value="null">Inga sortering</option>
    <option value="asc">Billigast</option>
    <option value="desc">Dyrast</option>
  </select>

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

  <WaitingModal
    v-if="loading"
    :waitingMessage="waitingMessage"
  />
  <div v-else-if="error">{{ error }}</div>
  <div v-if="!loading && filteredProducts.length === 0">
    Inga produkter hittades.
  </div>

  <div v-if="isGridView" class="grid">
    <ProductCard
      v-for="product in paginatedProducts"
      :key="product.id"
      :product="product"
      :bookings="bookings"
      @update="updateItem"
      @delete="deleteItem"
    />
  </div>

  <div v-else>
    <ProductCardSmall
      v-for="product in paginatedProducts"
      :key="product.id"
      :product="product"
      :bookings="bookings"
      @update="updateItem"
      @delete="deleteItem"
    />
  </div>

  <WaitingModal
    v-if="waiting"
    :waitingMessage="waitingMessage"
  />

  <!-- pagination -->
  <div class="pagination">
  <button :disabled="currentPage === 1" @click="currentPage--">Tillbaka</button>
  <p>Sidan {{ currentPage }}</p>
  <button :disabled="currentPage * itemsPerPage >= filteredProducts.length" @click="currentPage++">
    Nästa
  </button>
</div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { fetchProducts } from '../api/jsonbin';
import { fetchBookings } from '../api/jsonbin';
import ProductCard from '../components/ProductCard.vue';
import type { Product } from '../types/Product';
import '../styles/newItemForm.css';
import '../styles/productList.css';
import { saveItem } from '../api/jsonbin';
import ProductCardSmall from '../components/ProductCardSmall.vue';
import { watch } from 'vue';
import type { Booking } from '../types/Bookings';

const products = ref<Product[]>([]);
const bookings = ref<Booking[]>([]);
const filteredProducts = ref<Product[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);

const searchTerm = ref('');
const isGridView = ref(true);
const selectedCategory = ref<string | null>(null);

watch(searchTerm, () => {
  applyFilters();
});

// Sorting
const minPrice = ref<null | number>(null);
const maxPrice = ref<null | number>(null);

const sortOrder = ref<'asc' | 'desc' | null>(null);

// Form inputs
const idText = ref<number | null>(null);
const titleText = ref<string | null>(null);
const descriptionText = ref<string | null>(null);
const priceText = ref<number | null>(null);
const categoryText = ref<string | null>(null);
const imageLink = ref<null | string>(null);
const availablility = ref(true);

// Pagination
const currentPage = ref(1);
const itemsPerPage = 5;

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

// Pagination
watch(
  [searchTerm, selectedCategory, minPrice, maxPrice, filteredProducts],
  () => {
    currentPage.value = 1;
  }
)

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
  if (!confirm('Är du säker att du vill ta bort föremålet?')) return;

  waiting.value = true;
  waitingMessage.value = 'Raderar föremålet';
  error.value = null;

  try {
    const currentData = (await axiosInstance.get('')).data;
    // Remove product
    currentData.items = currentData.items.filter(
      (item: Product) => item.id !== Number(id)
    )
    // Remove product from bookings as well
    currentData.bookings = (currentData.bookings || []).filter(
      (booking: Booking) => booking.productId !== Number(id)
    )
    await axiosInstance.put('', currentData);
    // Update local array
    products.value = products.value.filter(p => p.id !== Number(id));
    applyFilters();
  } catch (err) {
    error.value = 'Kunde inte ta bort föremålet';
  } finally {
    waiting.value = false;
    waitingMessage.value = '';
    alert('Raderingen lyckades!');
    applyFilters();
    selectCategory(null);
  }
}

const categories = computed(() => {
  return [...new Set(products.value.map(p => p.category))];
});

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredProducts.value.slice(start, end);
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

  let result = products.value.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(term);
    const matchesCategory =
      selectedCategory.value === null ||
      product.category === selectedCategory.value;

    const matchesPrice =
      (minPrice.value === null || product.price >= minPrice.value) &&
      (maxPrice.value === null || product.price <= maxPrice.value);

    return matchesSearch && matchesCategory && matchesPrice;
  });

  if (sortOrder.value === 'asc') {
    result.sort((a, b) => a.price - b.price);
  } else if (sortOrder.value === 'desc') {
    result.sort((a, b) => b.price - a.price);
  }

  filteredProducts.value = result;
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
  waitingMessage.value = 'Laddar produkter...';
  error.value = null;

  try {
    products.value = await fetchProducts();
    const data = await fetchBookings();
    bookings.value = data;
    applyFilters();
    console.log(bookings.value)
  } catch (e) {
    error.value = 'Kunde inte ladda produkter.';
  } finally {
    loading.value = false;
  }
});
</script>