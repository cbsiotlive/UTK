import type { Metadata } from "next"
import LoginPage from "../login-page"

export const metadata: Metadata = {
  title: "Login | Utkarsh AuthentiProduct",
  description: "Login to Utkarsh AuthentiProduct dashboard",
}

export default function LoginServerPage() {
  return <LoginPage />
}

