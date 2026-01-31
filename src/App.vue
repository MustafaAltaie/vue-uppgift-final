<!-- src>App.vue -->
<template>
  <nav class="navHeader">
    <button @click="toggleTheme" class="darkToggle">
      {{ darkMode ? 'Light Mode' : 'Dark Mode' }}
    </button>
    <router-link :to="`/`">Hem</router-link>
    <router-link :to="`/bookings/`">Mina bokningar</router-link>
  </nav>

  <router-view />
</template>

<script setup lang="ts">
import { useDarkMode } from './composables/useDarkMode.ts';

const { darkMode, toggleTheme } = useDarkMode();
</script>

<style>
  * {
    box-sizing: border-box;
  }
  :root {
    --bg-color: white;
    --text-color: black;
  }
  .dark {
    --bg-color: #121212;
    --text-color: white;
  }
  body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 1rem;
    background-color: var(--bg-color);
    color: var(--text-color);
  }
  .navHeader {
    position: sticky;
    top: 0;
    z-index: 100;
    background-color: #fff;
  }
  .dark .navHeader {
    background-color: #121212;
  }
  .darkToggle {
    margin-right: 10px;
    border-radius: 20px;
    padding: 10px;
    cursor: pointer;
  }
  nav {
    display: flex;
    align-items: center;
    gap: 30px;
    border-bottom: solid 1px;
    padding: 10px;
  }
  nav > a {
    color: black;
    text-decoration: none;
  }
  .dark nav > a {
    color: white;
  }
  .dark button {
    background-color: rgb(7, 85, 163);
    color: white;
    border: none;
  }
  button {
    border-radius: 20px;
    border: none;
  }

  @media (max-width: 600px) {
    .grid {
      flex-direction: column;
    }
    nav {
      gap: 0;
      justify-content: space-between;
    }
  }
</style>