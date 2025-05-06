// services/productService.ts
import axios from "axios";
import { API_BASE_URL} from "../lib/api";
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

  const token = localStorage.getItem("token");

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

export async function fetchQrSheets() {
  if (typeof window === "undefined") {
    return [];
  }
  
  try {
    const response = await axios.get(
      `${API_BASE_URL}/api/header-options`,
      {
        headers: getAuthHeaders(),
      }
    );

    return response.data.data;
  } catch (error) {
    console.error("Error fetching QR sheet data:", error);
    throw error;
  }
}

export async function submitBulkMappedQRCodes(data: {
  batch_no: string;
  header_id: string;
  origin: string | null;
  total_scan: string;
  grade: string;
  asp: string;
}) {
  if (typeof window === "undefined") {
    return [];
  }
  
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/product/bulk-mapped`,
      data,
      {
        headers: getAuthHeaders(),
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error submitting QR mapping:", error);
    throw error;
  }
}