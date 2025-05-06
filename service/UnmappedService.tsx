import { API_BASE_URL } from "../lib/api";
import { getAuthHeaders } from "../lib/auth";

export const fetchUnmappedData = async (qrId: string, product: string) => {
  const response = await fetch(`${API_BASE_URL}/api/product/unmapped`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({
      id: qrId || undefined,
      product: product !== "all" ? product : undefined,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }

  const data = await response.json();
  return Array.isArray(data) ? data : [data];
};
