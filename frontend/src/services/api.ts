import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export const addToCart = async (productId: number) => {
  try {
    const token = localStorage.getItem('access_token');
    const res = await axios.post(
      `${API_BASE}/cart/add-cart/`,
      { product: productId, quantity: 1 },
      {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        withCredentials: true,
      }
    );
    return res.data;
  } catch (err: any) {
    if (err.response?.data?.error === 'Conflict') {
      // Use your UI notification system instead of alert
      console.warn('Product already in cart');
    } else {
      console.error('Failed to add to cart:', err);
    }
  }
};
