// services/AdminsService.ts
import axios from "axios";
import { API_BASE_URL } from "../lib/api";
import { getAuthHeaders } from "../lib/auth";

export interface Admin {
  id: number;
  name: string;
  email: string;
  origin: string;
  role: string;
}

interface AdminUpdateData {
  user_name: string;
  email: string;
  password?: string;
}

export const fetchAdmins = async (): Promise<Admin[]> => {
  const token = localStorage.getItem("token");

  try {
    const response = await axios.get(`${API_BASE_URL}/api/user`, {
      headers: getAuthHeaders(),
    });

    const filteredAdmins = response.data.users.filter(
      (user: Admin) => user.role !== "user"
    );
    return filteredAdmins;
  } catch (error) {
    console.error("Failed to fetch admins:", error);
    return [];
  }
};

export const updateAdmin = async (
  adminId: number,
  updateData: AdminUpdateData
): Promise<Admin | null> => {
  const token = localStorage.getItem("token");

  try {
    const response = await axios.put(
      `${API_BASE_URL}/api/user/${adminId}`,
      updateData,
      {
        headers: getAuthHeaders(),
      }
    );
    return response.data;
  } catch (error) {
    console.error("Failed to update admin:", error);
    return null;
  }
};
