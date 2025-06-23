import { ref, watchEffect } from 'vue';

const darkMode = ref(localStorage.getItem('theme') === 'dark');

function toggleTheme() {
  darkMode.value = !darkMode.value;
  localStorage.setItem('theme', darkMode.value ? 'dark' : 'light');
}

watchEffect(() => {
  if (darkMode.value) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
});

export function useDarkMode() {
  return { darkMode, toggleTheme };
}