<template>
  <div class="tools">
    <div>
      <input
        v-model="localSearch"
        placeholder="Sök produkter..."
        class="searchInput"
      />
      <button @click="$emit('toggleView')" class="searchButton">
        {{ isGridView ? 'Visa som lista' : 'Visa som rutnät' }}
      </button>
    </div>

    <h6>
      👈 Klicka på knappen för att visa produkter som
      {{ isGridView ? 'lista' : 'rutnät' }} istället
    </h6>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps<{
  searchTerm: string;
  isGridView: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:searchTerm', value: string): void;
  (e: 'toggleView'): void;
}>();

const localSearch = ref(props.searchTerm);

watch(localSearch, (val) => {
  emit('update:searchTerm', val);
});
</script>

<style scoped>
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
</style>