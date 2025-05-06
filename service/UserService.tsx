// services/UserService.ts
import axios from "axios";
import { API_BASE_URL } from "../lib/api";
import { getAuthHeaders } from "../lib/auth";

export type Admin = {
  id: number;
  user_name: string;
  email: string;
  origin: string;
  role: string;
};

interface AdminUpdateData {
  user_name: string;
  email: string;
  password?: string;
}

export const fetchUsers = async (): Promise<Admin[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/user`, {
      headers: getAuthHeaders(),
    });

    const users = response.data.users.filter(
      (user: Admin) => user.role !== "admin"
    );

    return users;
  } catch (error) {
    console.error("Failed to fetch users:", error);
    return [];
  }
};

export const updateUser = async (
  userId: number,
  updateData: AdminUpdateData
): Promise<Admin | null> => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/api/user/${userId}`,
      updateData,
      {
        headers: getAuthHeaders(),
      }
    );

    return response.data;
  } catch (error) {
    console.error("Failed to update user:", error);
    return null;
  }
};
