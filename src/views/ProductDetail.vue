<template>
  <div v-if="loading">Laddar produkt...</div>
  <div v-else-if="error">{{ error }}</div>
  <div v-else>
    <h2>{{ product.name }}</h2>
    <p>{{ product.shortDescription }}</p>
    <ul>
      <li v-for="(feature, i) in product.features" :key="i">• {{ feature }}</li>
    </ul>
    <p><strong>Pris:</strong> {{ product.price }} USD</p>

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