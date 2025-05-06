// services/ReportService.ts
import axios from "axios";
import { ProductName } from "@/lib/constants";
import { API_BASE_URL } from "../lib/api";
import { getAuthHeaders } from "../lib/auth";

export interface ReportRequest {
  product_name: ProductName | "all";
  start_date: string;
  end_date: string;
}

export interface ReportData {
  id: number;
  product_name: ProductName;
  quantity: number;
  date: string;
}

export const fetchReportData = async (
  request: ReportRequest
): Promise<ReportData[]> => {

  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/product/report`,
      request,
      {
        headers: getAuthHeaders(),
      }
    );
    return response.data.report;
  } catch (error) {
    console.error("Error fetching report data:", error);
    return [];
  }
};
