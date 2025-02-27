import { redirect } from "next/navigation"

export default function Home() {
  // Check if the user is logged in
  const isLoggedIn = typeof window !== "undefined" && localStorage.getItem("isLoggedIn") === "true"

  // If not logged in, redirect to login page
  if (!isLoggedIn) {
    redirect("/login")
  }

  // If logged in, redirect to dashboard
  redirect("/dashboard")
}

