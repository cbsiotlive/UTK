import axios from "axios";


interface LoginResponse {
  isLogin: boolean;
  token: string;
  email: string;
  userName: string;
  role: string;
  origin: string;
  id: string;
}

export async function loginUser(username: string, password: string): Promise<LoginResponse> {
  const response = await axios.post("https://verify.utkarshsmart.in/api/login", {
    user_name: username,
    password: password,
  });

  return response.data;
}
