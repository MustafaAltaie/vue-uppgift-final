<!-- src>views>ProductDetail.vue -->
<template>
  <div v-if="loading">Laddar produkt...</div>
  <div v-else-if="error">{{ error }}</div>
  <div v-else>
    <img :src="product.imageUrl" alt="">
    <h2>{{ product.title }}</h2>
    <p>{{ product.description }}</p>
    <p><strong>Pris:</strong> {{ product.price }}:-</p>
    <BookingForm :productId="product.id" @bookingSuccess="handleBookingSuccess" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { fetchProducts } from '../api/jsonbin';
import BookingForm from '../components/BookingForm.vue';

const route = useRoute();
const product = ref<any>(null);
const loading = ref(true);
const error = ref<string | null>(null);

async function loadProduct() {
  loading.value = true;
  try {
    const products = await fetchProducts();
    product.value = products.find((p: any) => p.id === route.params.id);
    if (!product.value) {
      error.value = 'Produkt hittades inte.';
    }
  } catch {
    error.value = 'Fel vid hämtning av produkt.';
  } finally {
    loading.value = false;
  }
}

function handleBookingSuccess() {
  alert('Bokning lyckades!');
}

onMounted(() => {
  loadProduct();
});
</script>

<style scoped>
img {
  width: 200px;
  margin-top: 10px;
}
</style>