// src>api>jsonbin.ts
import axios from 'axios';
import type { Product } from '../types/Product';
import type { Booking } from '../types/Bookings';

const BIN_ID = import.meta.env.VITE_BIN_ID;
const API_KEY = import.meta.env.VITE_API_KEY;
const BASE_URL = `https://api.jsonbin.io/v3/b/${BIN_ID}`;

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'X-Master-Key': API_KEY,
    'X-Bin-Meta': 'false',
    'Content-Type': 'application/json',
  },
});

export async function fetchProducts() {
  const res = await axiosInstance.get('');
  console.log('JSONBin response:', res.data);
  return res.data.items;
}

export async function fetchBookings() {
  const res = await axiosInstance.get('');
  return res.data.bookings || [];
}

export async function saveBooking(booking: Booking) {
  const currentData = (await axiosInstance.get('')).data;
  currentData.bookings = currentData.bookings || [];
  currentData.bookings.push(booking);

  const res = await axiosInstance.put('', currentData);
  return res.data;
}

export async function saveItem(item: Product) {
  const currentData = (await axiosInstance.get('')).data;
  currentData.items = currentData.items || [];
  currentData.items.push(item);

  const res = await axiosInstance.put('', currentData);
  return res.data;
}