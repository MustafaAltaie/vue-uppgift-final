import axios from 'axios';

const BIN_ID = 'your_JSONbin_bin_id_put_here';
const API_KEY = 'your_JSONbin_api_key_put_here';
const BASE_URL = `https://api.jsonbin.io/v3/b/${BIN_ID}`;

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'X-Master-Key': API_KEY,
    'Content-Type': 'application/json',
  },
});

export async function fetchProducts() {
  const res = await axiosInstance.get('');
  return res.data.record.products;
}

export async function fetchBookings() {
  const res = await axiosInstance.get('');
  return res.data.record.bookings || [];
}

export async function saveBooking(booking: any) {
  const currentData = (await axiosInstance.get('')).data.record;
  currentData.bookings = currentData.bookings || [];
  currentData.bookings.push(booking);

  const res = await axiosInstance.put('', currentData);
  return res.data;
}
