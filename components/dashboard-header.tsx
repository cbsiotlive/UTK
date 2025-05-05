"use client"

import { useState, useEffect } from "react"
import { Bell, Menu, X } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

const dummyNotifications = [
  { id: 1, message: "100 new products mapped with QR codes", time: "2 minutes ago" },
  { id: 2, message: "50 JNP products successfully QR mapped", time: "1 hour ago" },
  { id: 3, message: "75 GRP products awaiting QR mapping", time: "3 hours ago" },
  { id: 4, message: "QR mapping completed for Q2 inventory", time: "1 day ago" },
]

export default function DashboardHeader({ currentPage = "Dashboard" }) {
  const [notifications, setNotifications] = useState(dummyNotifications)
  const [isRinging, setIsRinging] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkIsMobile = () => setIsMobile(window.innerWidth < 768)
    checkIsMobile()
    window.addEventListener("resize", checkIsMobile)
    return () => window.removeEventListener("resize", checkIsMobile)
  }, [])

  useEffect(() => {
    if (notifications.length > 0) {
      setIsRinging(true)
      const timer = setTimeout(() => setIsRinging(false), 2000)
      return () => clearTimeout(timer)
    }
  }, [notifications])

  const clearNotification = (id: number) => {
    setNotifications(notifications.filter((n) => n.id !== id))
  }

  return (
    <div
      className={cn(
        "flex justify-between items-center p-4 bg-white border-b border-gray-200",
        isMobile && "fixed top-0 left-0 right-0 z-20",
      )}
    >
      {isMobile && (
        <button
          onClick={() => document.dispatchEvent(new Event("toggleSidebar"))}
          className="p-2 hover:bg-muted rounded-lg"
        >
          <Menu className="h-5 w-5 text-foreground" />
        </button>
      )}
      <h1 className={cn("text-header font-bold text-primary", isMobile && "text-center flex-grow")}>{currentPage}</h1>
      <div className="flex items-center gap-4">
        <Popover>
          <PopoverTrigger asChild>
            <button
              className={cn(
                "p-3 bg-muted rounded-full relative transition-all duration-300 ease-in-out cursor-not-allowed opacity-50",
                isRinging && "animate-wiggle",
              )}
              disabled
            >
              <Bell
                className={cn(
                  "w-5 h-5 transition-colors duration-300",
                  notifications.length > 0 ? "text-primary" : "text-gray-400",
                )}
              />
              {notifications.length > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-error rounded-full">
                  {notifications.length}
                </span>
              )}
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0 bg-white rounded-lg shadow-custom border border-gray-200">
            <div className="p-4 bg-muted border-b border-border">
              <h3 className="font-semibold text-lg text-foreground">Notifications</h3>
            </div>
            <div className="max-h-[300px] overflow-y-auto">
              {notifications.length === 0 ? (
                <p className="text-sm text-muted-foreground p-4">No new notifications</p>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="p-4 border-b border-border hover:bg-muted transition-colors duration-200"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium text-foreground">{notification.message}</p>
                        <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                      </div>
                      <button
                        onClick={() => clearNotification(notification.id)}
                        className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}

