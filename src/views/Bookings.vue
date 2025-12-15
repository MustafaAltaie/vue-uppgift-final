<!-- src>views>Bookings.vue -->
<template>
  <div class="bookings">
    <h2>📅 Bokningar</h2>

    <div v-if="loading" class="state">Laddar bokningar...</div>
    <div v-else-if="error" class="state error">{{ error }}</div>
    <div v-else-if="enrichedBookings.length === 0" class="state">
      Inga bokningar hittades.
    </div>

    <div v-else class="bookingList">
      <div
        class="bookingCard"
        v-for="(booking, index) in enrichedBookings"
        :key="index"
      >
        <img :src="booking.product.imageUrl" alt="" />

        <div class="info">
          <h3>{{ booking.product.title }}</h3>
          <p>{{ booking.product.description }}</p>

          <div class="dates">
            <span><strong>Från:</strong> {{ booking.startDate }}</span>
            <span><strong>Till:</strong> {{ booking.endDate }}</span>
          </div>

          <small class="created">
            Bokad: {{ formatDate(booking.bookingDate) }}
          </small>
        </div>

        <div class="actions">
          <div class="price">{{ booking.product.price }}:-</div>
          <button
            class="deleteBtn"
            :disabled="saving"
            @click="deleteBooking(booking)"
          >
            ❌ Avboka
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { fetchBookings, fetchProducts } from '../api/jsonbin';

const BIN_ID = '6752f136acd3cb34a8b5244f';
const API_KEY = '$2a$10$9EwtZ4YUIirUFE6jfjXJGe.4/SkkaLUosXQgDaKBaKR3UcmEH920.';
const BASE_URL = `https://api.jsonbin.io/v3/b/${BIN_ID}`;

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'X-Master-Key': API_KEY,
    'X-Bin-Meta': 'false',
    'Content-Type': 'application/json',
  },
});

interface Booking {
  productId: string;
  startDate: string;
  endDate: string;
  bookingDate: string;
}

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
}

const loading = ref(false);
const saving = ref(false);
const error = ref<string | null>(null);
const enrichedBookings = ref<(Booking & { product: Product })[]>([]);

function formatDate(date: string) {
  return new Date(date).toLocaleString('sv-SE');
}

async function loadData() {
  loading.value = true;
  error.value = null;

  try {
    const [bookings, products] = await Promise.all([
      fetchBookings(),
      fetchProducts(),
    ]);

    enrichedBookings.value = bookings
      .map((booking: Booking) => {
        const product = products.find(
          (p: Product) => p.id === booking.productId
        );
        if (!product) return null;
        return { ...booking, product };
      })
      .filter(Boolean);
  } catch (e) {
    error.value = 'Kunde inte ladda bokningar.';
  } finally {
    loading.value = false;
  }
}

async function deleteBooking(bookingToDelete: Booking) {
  const confirmed = confirm('Är du säker på att du vill avboka denna bokning?');
  if (!confirmed) return;

  saving.value = true;

  try {
    const currentData = (await axiosInstance.get('')).data;

    currentData.bookings = (currentData.bookings || []).filter(
      (b: Booking) =>
        !(
          b.productId === bookingToDelete.productId &&
          b.bookingDate === bookingToDelete.bookingDate
        )
    );

    await axiosInstance.put('', currentData);

    enrichedBookings.value = enrichedBookings.value.filter(
      b => !(
        b.productId === bookingToDelete.productId &&
        b.bookingDate === bookingToDelete.bookingDate
      )
    );
  } catch (e) {
    alert('Kunde inte ta bort bokningen.');
  } finally {
    saving.value = false;
  }
}

onMounted(loadData);
</script>

<style scoped>
.bookings {
  max-width: 900px;
  margin: 20px auto;
  padding: 10px;
}

h2 {
  margin-bottom: 20px;
  color: rgb(28, 105, 182);
}

.state {
  padding: 20px;
  text-align: center;
  background: #eee;
  border-radius: 8px;
}

.error {
  background: #ffd6d6;
  color: #900;
}

.bookingList {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.bookingCard {
  display: flex;
  gap: 15px;
  background: #f5f5f5;
  border-radius: 10px;
  overflow: hidden;
  transition: 0.3s;
}

.dark .bookingCard {
  background: #222;
  color: #fff;
}

.bookingCard:hover {
  transform: translateX(5px);
}

.bookingCard img {
  width: 250px;
  object-fit: cover;
}

.info {
  flex: 1;
  padding: 10px;
}

.info h3 {
  margin: 0;
  color: rgb(28, 105, 182);
}

.dates {
  display: flex;
  gap: 15px;
  margin-top: 5px;
}

.created {
  display: block;
  margin-top: 8px;
  opacity: 0.7;
}

.actions {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-end;
  padding: 10px;
}

.price {
  font-weight: bold;
  font-size: 18px;
}

.deleteBtn {
  background: #d9534f;
  color: #fff;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: 0.2s;
}

.deleteBtn:hover {
  background: #c9302c;
}

.deleteBtn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>