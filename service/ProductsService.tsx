import axios from "axios";
import { API_BASE_URL } from "../lib/api";
import { getAuthHeaders } from "../lib/auth";

export const fetchProducts = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/product`, {
      headers: getAuthHeaders(),
    });
    console.log("Fetched products:", response.data.products);
    return response.data.products;
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return [];
  }
};
