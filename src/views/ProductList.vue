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
    <div class="addItem" title="Lägg till" @click="addFormState = true">
      <h1>+</h1>
    </div>
  </div>

  <!-- Add new item form -->
  <div v-if="addFormState" class="newItemForm">
    <p @click="[addFormState = false, clearForm()]">X</p>
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
    />
  </div>

  <div v-else>
    <div class="smallCard" v-for="product in filteredProducts" :key="product.id">
      <img :src="product.imageUrl" alt="">
      <h4>{{ product.title }}</h4>
      <h6>{{ product.description }}</h6>
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
import type { Product } from '../types/Product';
import '../styles/newItemForm.css';

const products = ref<Product[]>([]);
const filteredProducts = ref<Product[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);

const searchTerm = ref('');
const isGridView = ref(true);
const selectedCategory = ref<string | null>(null);

const minPrice = ref<null | number>(null);
const maxPrice = ref<null | number>(null);

const addFormState = ref(false);
const titleText = ref<string | null>(null);
const descriptionText = ref<string | null>(null);
const priceText = ref<number | null>(null);
const categoryText = ref<string | null>(null);
const imageLink = ref<null | string>(null);

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
.dark .searchInput,
.dark .searchButton {
  border: none;
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

.priceWrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.addItem {
  cursor: pointer;
  padding: 0 30px
}
.priceWrapper > div > input,
.priceButton {
  border: solid 1px;
  margin-right: -1px;
  padding: 10px;
}
.minPriceInput {
  border-radius: 20px 0 0 20px;
}
.priceButton {
  border-radius: 0 20px 20px 0;
}
.dark .priceButton {
  border: none;
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

@media (max-width: 600px) {
  .tools {
    padding: 20px 0 10px 0;
  }
  .tools > h6 {
    display: none;
  }
  .categoryNav {
    display: flex;
    justify-content: flex-start;
    padding-bottom: 20px;
  }
  .priceWrapper {
    flex-direction: column;
    margin-top: 30px;
  }
  .priceWrapper > div > input,
  .priceButton {
    width: calc(100% / 3);
    text-align: center;
  }
  .smallCard {
    justify-content: space-between;
    gap: unset;
    width: 100%;
    padding-right: unset;
    clip-path: unset;
    padding: 0 10px;
  }
  .smallCard:hover {
    transform: unset;
  }
  .smallCard > h6,
  .smallCard > img {
    display: none;
  }
  .cardButton {
    padding: 5px;
  }
}
</style>