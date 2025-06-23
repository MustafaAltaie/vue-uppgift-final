<template>
  <div>
    <h1>Bokingar</h1>
    <p>Här visars användarens bokningar och aktiva boknigar.</p>

    <div v-if="isLoading">Laddar bokingar...</div>
    <div v-else-if="err">{{ err }}</div>
    <div v-else>
      <ul v-if="bokningar.length">
        <li v-for="bokning in bokningar" :key="bokning.id" class="bokning-item">
          <b>{{ bokning.prodName }}</b> - {{ formatDatum(bokning.datum) }} - Status: <i>{{ bokning.status }}</i>
          <button @click="avboka(bokning.id)" :disabled="bokning.status !== 'Aktiv'">Avbok</button>
        </li>
      </ul>
      <p v-else>Inga boknigar hittade</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const bokningar = ref([
  { id: 1, prodName: 'Kamerra', datum: '2025-07-01', status: 'Aktiv' },
  { id: 2, prodName: 'Högtalare', datum: '2025-06-15', status: 'Slut' },
])

const isLoading = ref(false)
const err = ref('')

function formatDatum(d) {
  const date = new Date(d)
  return date.toLocaleDateString('sv-SE')
}

function avboka(id) {
  if (!window.confirm('Är du säker du vill avboka?')) return

  const i = bokningar.value.findIndex(b => b.id === id)
  if (i !== -1) {
    bokningar.value[i].status = 'Avbokad'
  }
}
</script>

<style scoped>
.bokning-item {
  margin-bottom: 1rem;
}

button {
  margin-left: 10px;
}
</style>