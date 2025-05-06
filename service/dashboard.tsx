import axios from "axios";
import { API_BASE_URL } from "../lib/api";
import { getAuthHeaders } from "../lib/auth";

const origin = localStorage.getItem("origin") || "null";
const isOrigin = localStorage.getItem("origin") || "JNP";

export interface GraphResponse {
  [key: string]: number;
}

// fetch data into graph
export async function fetchGraphData(timeFrame: string) {
  const response = await fetch(`${API_BASE_URL}/api/product/graph`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ time_frame: timeFrame }),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch graph data");
  }

  const data = await response.json();
  return data.graph;
}

//fetch Total Product Data
export async function fetchTotalProductData() {
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
    console.error("Error fetching product total data:", error);
    throw error;
  }
}

//fetch Quarterly Data
export async function fetchQuarterlyData() {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/product/quarter`,
      { isOrigin },
      {
        headers: getAuthHeaders(),
      }
    );

    const fetchedData = Object.keys(response.data.quarter).map((quarter) => ({
      quarter,
      mbcb: response.data.quarter[quarter].MBCB,
      hm: response.data.quarter[quarter].HM,
      pole: response.data.quarter[quarter].POLE,
      qrMapped: response.data.quarter[quarter].total,
    }));

    return fetchedData;
  } catch (error) {
    console.error("Error fetching quarterly data:", error);
    throw new Error("Failed to fetch quarterly data");
  }
}

//fetch QR Spending Data
export async function fetchQRSpendingData() {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/product/mapped`,
      {},
      {
        headers: getAuthHeaders(),
      }
    );

    const { mapped_percentage, unmapped_percentage } = response.data.mapped;

    return [
      { name: "Mapped QR", value: mapped_percentage },
      { name: "Unmapped QR", value: unmapped_percentage },
    ];
  } catch (error) {
    console.error("Failed to fetch QR spending data:", error);
    throw new Error("Failed to fetch QR spending data");
  }
}

//fetch Graph Data for Admin
export const fetchGraphDataAdmin = async (
  timeframe: "yearly" | "monthly",
  origin: string
) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/product/graph`,
      { time_frame: timeframe === "yearly" ? "fy" : "monthly" },
      {
        headers: getAuthHeaders(),
      }
    );
    return parseChartData(response.data.graph, origin);
  } catch (error) {
    console.error("Error fetching chart data:", error);
    return [];
  }
};

// Helper function for parsing
const parseChartData = (data: { [key: string]: any }, origin: string) => {
  return Object.keys(data).map((key) => ({
    name: key,
    [origin]: data[key],
  }));
};
