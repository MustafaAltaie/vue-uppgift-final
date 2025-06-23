import { createRouter, createWebHistory } from 'vue-router';
import ProductList from '../views/ProductList.vue';
import ProductDetail from '../views/ProductDetail.vue';
import Bookings from '../views/Bookings.vue';

const routes = [
  { path: '/', name: 'Home', component: ProductList },
  { path: '/product/:id', name: 'ProductDetail', component: ProductDetail, props: true },
  { path: '/bookings', name: 'Bookings', component: Bookings },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;