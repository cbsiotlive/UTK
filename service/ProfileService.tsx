// services/ProfileService.ts
import axios from "axios";
import { API_BASE_URL } from "../lib/api";
import { getAuthHeaders } from "../lib/auth";

interface ChangePasswordRequest {
  userId: string;
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
  token: string;
}

export const changeUserPassword = async ({
  userId,
  oldPassword,
  newPassword,
  confirmPassword,
  token,
}: ChangePasswordRequest): Promise<boolean> => {
  const requestBody = {
    old_password: oldPassword,
    new_password: newPassword,
    new_password_confirmation: confirmPassword,
  };

  try {
    const response = await axios.post(
      `${API_BASE_URL} /api/user/${userId}/change-password`,
      requestBody,
      {
        headers: getAuthHeaders(),
      }
    );

    console.log("Password changed successfully:", response.data);
    return true;
  } catch (error) {
    console.error("Failed to change password:", error);
    return false;
  }
};
