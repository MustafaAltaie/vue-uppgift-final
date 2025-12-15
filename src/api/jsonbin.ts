// src>api>jsonbin.ts
import axios from 'axios';

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

export async function fetchProducts() {
  const res = await axiosInstance.get('');
  console.log('JSONBin response:', res.data);
  return res.data.items;
}

export async function fetchBookings() {
  const res = await axiosInstance.get('');
  return res.data.bookings || [];
}

export async function saveBooking(booking: any) {
  const currentData = (await axiosInstance.get('')).data;
  currentData.bookings = currentData.bookings || [];
  currentData.bookings.push(booking);

  const res = await axiosInstance.put('', currentData);
  return res.data;
}
