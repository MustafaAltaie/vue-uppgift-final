<!-- src>components>ProductCard.vue -->
<template>
    <div class="card">
      <div class="cardTools">
          <p class="deleteItem" @click="$emit('delete', product.id)">❌</p>
          <p class="updateItem" @click="$emit('update', product)">✏️</p>
      </div>
      <div>
        <h2>{{ product.title }}</h2>
        <p>{{ product.description }}</p>
        <p><strong>Pris:</strong> {{ product.price }}:-</p>
        <img :src="product.imageUrl" alt="">
      </div>
      <h6 v-if="!product.available">
        Ej tillgänglig för tillfället
      </h6>
      <p class="bookedText" v-if="bookingsArray.some(b => Number(b.productId) === Number(product.id))">
        Bokad
      </p>
      <router-link :to="`/product/${product.id}`" v-else>
        <button v-if="product.available">
          Boka nu
        </button>
      </router-link>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Product } from '../types/Product';
import type { Booking } from '../types/Bookings';
const props = defineProps<{
  product: Product
  bookings?: Booking[]
}>();
const bookingsArray = computed(() => props.bookings ?? []);
</script>

<style scoped>
.card {
  position: relative;
  padding: 1rem;
  width: 200px;
  border-radius: 20px;
  transition: 0.3s;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
}
.dark .card {
  background-color: #222;
}
.card:hover {
  transform: translateY(-10px);
}
img {
  width: 100%;
  border-radius: 20px;
}
h2 {
  color: #07a;
}
h6 {
  color: red;
}
button {
  padding: 5px;
  cursor: pointer;
  padding: 5px 30px;
}
.cardTools {
  right: 0;
}
.card:hover > .cardTools {
  display: flex;
}
.bookedText {
  position: absolute;
  top: 50px;
  left: 50%;
  transform: translateX(-50%) rotate(65deg);
  font-weight: bold;
  font-size: 80px;
  opacity: 0.5;
}

@media (max-width: 600px) {
  .card {
    width: 100%;
    gap: 15px;
  }
  .card button {
    width: 100%;
    border-radius: 20px;
    border: none;
    padding: 10px;
  }
  .card > div {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
}
</style>