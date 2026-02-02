<!-- src>views>ProductDetail.vue -->
<template>
  <div class="wrapper">
    <div v-if="loading">Laddar produkt...</div>
    <div v-else-if="error">{{ error }}</div>
    <div v-else class="ProductDetailWrapper">
      <div>
        <img :src="product.imageUrl" alt="">
      </div>
      <div class="ProductDetailWrapper2">
        <h2>{{ product.title }}</h2>
        <p>{{ product.description }}</p>
        <p><strong>Pris:</strong> {{ product.price }}:-</p>
        <BookingForm :productId="product.id" @bookingSuccess="handleBookingSuccess" />
      </div>
    </div>
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
    product.value = products.find((p: any) => String(p.id) === route.params.id);
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
.wrapper {
  background: #eee;
  padding: 20px;
  border-right: solid 1px;
  border-left: solid 1px;
  border-bottom: solid 1px;
}
.dark .wrapper {
  background-color: #222;
}
.ProductDetailWrapper {
  display: flex;
}
.ProductDetailWrapper > div {
  width: 50%;
}
img {
  width: 100%;
  margin-top: 10px;
}
.ProductDetailWrapper2 {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 50px;
}

@media (max-width: 600px) {
  .wrapper {
    padding: 30px;
  }
  img {
    margin-top: 0;
  }
  .ProductDetailWrapper {
    flex-direction: column;
  }
  .ProductDetailWrapper > div {
    width: 100%;
    padding: 0;
  }
  .ProductDetailWrapper > div:nth-child(2) {
    padding-top: 10px;
  }
}
</style>