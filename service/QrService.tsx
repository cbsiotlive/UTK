import axios from "axios";
import { API_BASE_URL } from "../lib/api";
import { getAuthHeaders } from "../lib/auth";

export async function searchProducts(filters: {
  product_name?: string;
  batch_no?: string;
  serial_no?: string;
  start_date?: string;
  end_date?: string;
  mapping_status?: "mapped" | "unmapped";
  origin?: "GRP" | "JNP";
}) {
  // Only run this code on the client side
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/product/filter`,
      filters,
      {
        headers: getAuthHeaders(),
      }
    );

    return response.data.products.data.map((item: any) => ({
      id: item.id,
      productName: item.product_name,
      batchNumber: item.batch_no,
      serialNo: item.serial_no,
      mappingStatus: item.mapping_status,
      origin: item.origin,
      date: item.date,
    }));
  } catch (error) {
    throw error;
  }
}
