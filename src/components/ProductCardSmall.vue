<template>
    <div class="smallCard">
        <div class="cardTools">
            <p class="deleteItem" @click="$emit('delete', product.id)">❌</p>
            <p class="updateItem" @click="$emit('update', product)">✏️</p>
        </div>
        <img :src="product.imageUrl" alt="">
        <h4>{{ product.title }}</h4>
        <h6>{{ product.description }}</h6>
        <p>{{ product.price }}:-</p>
        <p class="bookedText" v-if="bookingsArray.some(b => Number(b.productId) === Number(product.id))">
            Bokad
        </p>
        <router-link :to="`/product/${product.id}`" v-else>
        <button class="cardButton" v-if="product.available">
            Boka nu
        </button>
        </router-link>
        <h5 v-if="!product.available">
        Ej tillgänglig
        </h5>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import '../styles/productList.css';
import type { Product } from '../types/Product';
import type { Booking } from '../types/Bookings';
const props = defineProps<{
    product: Product
    bookings?: Booking[]
}>();
const bookingsArray = computed(() => props.bookings ?? []);
</script>

<style scoped>
.cardTools {
  display: none;
  height: 100%;
  width: 150px;
  background: #444;
}
.smallCard:hover > .cardTools {
    display: flex;
}
.bookedText {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translate(-50%, -50%);
  font-weight: bold;
  font-size: 50px;
  opacity: 0.5;
}
</style>