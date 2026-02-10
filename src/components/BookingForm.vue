<!-- src>components>BookingForm.vue -->
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

  <WaitingModal
    v-if="loading"
    :waitingMessage="waitingMessage"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { saveBooking } from '../api/jsonbin';
import WaitingModal from '../composables/WaitingModal.vue';
import { useRouter } from 'vue-router';

const props = defineProps({
  productId: String,
});

const emit = defineEmits<{
  (e: 'bookingSuccess'): void
}>();

const startDate = ref('');
const endDate = ref('');
const loading = ref(false);
const error = ref<string | null>(null);
const waitingMessage = ref<string>('');
const router = useRouter();

async function submitBooking() {
  if (startDate.value > endDate.value) {
    error.value = 'Startdatum måste vara före slutdatum.';
    return;
  }
  const confirmDeletion = confirm('Bekräftar bokning?');
  if (!confirmDeletion) return;
  loading.value = true;
  error.value = null;
  waitingMessage.value = 'Bokning pågår...';
  try {
    await saveBooking({
      productId: Number(props.productId),
      startDate: startDate.value,
      endDate: endDate.value,
      bookingDate: new Date().toISOString(),
    });
    startDate.value = '';
    endDate.value = '';
    error.value = null;
    emit('bookingSuccess');
    router.push('/bookings');
  } catch {
    error.value = 'Fel vid bokning, försök igen.';
  } finally {
    loading.value = false;
    waitingMessage.value = '';
  }
}
</script>

<style scoped>
form {
  display: flex;
  flex-direction: column;
  gap: 20px;
  border-top: 0.5px solid;
  padding-top: 20px;
  margin-top: 10px;
}
button {
  background-color: #ccc;
  padding: 10px 0;
  cursor: pointer;
}
.dark button {
  background-color: rgb(7, 85, 163);
}
.error {
  color: red;
}
</style>