"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import DashboardHeader from "./dashboard-header"
import Sidebar from "./sidebar"

import { ReactNode } from "react"

export default function Dashboard({ children }: { children: ReactNode }) {
  const router = useRouter()
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true"
    if (!isLoggedIn) {
      router.push("/login")
    }
  }, [router])

  useEffect(() => {
    const checkIsMobile = () => setIsMobile(window.innerWidth < 768)
    checkIsMobile()
    window.addEventListener("resize", checkIsMobile)
    return () => window.removeEventListener("resize", checkIsMobile)
  }, [])

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <DashboardHeader />
        <div className={`flex-1 p-6 overflow-auto ${isMobile ? "mt-14" : ""}`}>{children}</div>
      </div>
    </div>
  )
}

