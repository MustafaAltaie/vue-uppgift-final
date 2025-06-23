<template>
  <form @submit.prevent="submitBooking">
    <label>
      Välj startdatum:
      <input type="date" v-model="startDate" required />
    </label>
    <label>
      Välj slutdatum:
      <input type="date" v-model="endDate" required />
    </label>

    <button :disabled="loading">Boka</button>
    <div v-if="error" class="error">{{ error }}</div>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { saveBooking } from '../api/jsonbin';

const props = defineProps({
  productId: String,
});

const startDate = ref('');
const endDate = ref('');
const loading = ref(false);
const error = ref<string | null>(null);

async function submitBooking() {
  if (startDate.value > endDate.value) {
    error.value = 'Startdatum måste vara före slutdatum.';
    return;
  }
  loading.value = true;
  error.value = null;
  try {
    await saveBooking({
      productId: props.productId,
      startDate: startDate.value,
      endDate: endDate.value,
      bookingDate: new Date().toISOString(),
    });
    startDate.value = '';
    endDate.value = '';
    error.value = null;
    emit('bookingSuccess');
  } catch {
    error.value = 'Fel vid bokning, försök igen.';
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.error {
  color: red;
  margin-top: 0.5rem;
}
</style>