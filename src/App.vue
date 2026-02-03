<!-- src>App.vue -->
<template>
  <nav class="navHeader">
    <button @click="toggleTheme" class="darkToggle">
      {{ darkMode ? 'Light Mode' : 'Dark Mode' }}
    </button>
    <div>
      <router-link :to="`/`">Hem</router-link>
      <router-link :to="`/bookings/`">Mina bokningar</router-link>
    </div>
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
    font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
  }
  nav {
    display: flex;
    align-items: center;
    gap: 10px;
    border-bottom: solid 1px;
    padding: 10px;
  }
  nav > div {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  nav > div > a {
    color: black;
    text-decoration: none;
    background: #00000011;
    padding: 5px 10px;
    border-radius: 5px;
    font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
  }
  .dark nav > div > a {
    color: white;
    background: #ffffff22;
  }
  .dark button {
    background-color: rgb(7, 85, 163);
    color: white;
    border: none;
  }
  button {
    border-radius: 20px;
    border: none;
    cursor: pointer;
  }

  @media (max-width: 600px) {
    .grid {
      flex-direction: column;
    }
    .navHeader {
      flex-direction: column;
    }
    nav > div > a {
      padding: 10px;
    }
  }
</style>