import axios from "axios";
import { API_BASE_URL } from "../lib/api";
import { getAuthHeaders } from "../lib/auth";

export type FactoryData = {
  quarter: string;
  mbcb: number;
  hm: number;
  pole: number;
  qrMapped: number;
};

export const fetchTotalProductData = async (origin: string) => {
  const token = localStorage.getItem("token");

  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/product/total`,
      { origin },
      {
        headers: getAuthHeaders(),
      }
    );

    return Object.keys(response.data.total).map((key) => ({
      name: key,
      value: response.data.total[key].quantity,
    }));
  } catch (error) {
    console.error("Failed to fetch chart data:", error);
    throw error;
  }
};

export const fetchQRSpendingData = async (origin: string) => {
  const token = localStorage.getItem("token");

  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/product/mapped`,
      { origin },
      {
        headers: getAuthHeaders(),
      }
    );

    const { mapped_quantity, total, mapped_percentage } = response.data.mapped;
    const unmapped_percentage = 100 - mapped_percentage;

    // You can return more detailed data if needed
    return [
      { name: "Mapped QR", value: mapped_percentage },
      { name: "Unmapped QR", value: unmapped_percentage },
    ];
  } catch (error) {
    console.error("Error fetching mapped data:", error);
    throw error;
  }
};

//fetch Quarterly Product Data
export const fetchQuarterlyProductData = async (
  origin: string
): Promise<FactoryData[]> => {
  const token = localStorage.getItem("token");

  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/product/quarter`,
      { origin },
      {
        headers: getAuthHeaders(),
      }
    );

    const data: FactoryData[] = Object.keys(response.data.quarter).map(
      (quarter) => ({
        quarter,
        mbcb: response.data.quarter[quarter].MBCB,
        hm: response.data.quarter[quarter].HM,
        pole: response.data.quarter[quarter].POLE,
        qrMapped: response.data.quarter[quarter].total,
      })
    );

    return data;
  } catch (err) {
    console.error("Failed to fetch quarterly product data:", err);
    throw err;
  }
};
