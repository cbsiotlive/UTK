"use client";

import {Home, QrCode, Package, FileText, Menu,LogOut, User, Settings, Users,Shield, X, CheckSquare, Unlink2} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useCallback, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

const LOGO_WIDTH = 180;
const LOGO_HEIGHT = 48;

// const roles = "superadmin"; 

const navItems = [
  { name: "Dashboard", icon: Home, href: "/dashboard" },
  { name: "QR", icon: QrCode, href: "/dashboard/qr" },
  { name: "Mapped", icon: CheckSquare, href: "/dashboard/mapped" },
  { name: "Unmapped", icon: Unlink2, href: "/dashboard/unmapped" },
  { name: "Products", icon: Package, href: "/dashboard/products" },
  { name: "Report", icon: FileText, href: "/dashboard/report" },
  { name: "Admins", icon: Shield, href: "/dashboard/admins" }, 
  { name: "Users", icon: Users, href: "/dashboard/users" },
];

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [roles, setRoles] = useState('');  
  const router = useRouter();
  const pathname = usePathname();
  

  useEffect(() => {

    const userRole = localStorage.getItem('role'); 
    setRoles(userRole || '');

    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsOpen(true);
      }
    };
    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("userName");
    localStorage.removeItem("role");
    localStorage.removeItem("origin");
    localStorage.removeItem("id");

    router.push("/login");
  }, [router]);

  const toggleSidebar = () => setIsOpen(!isOpen);

  // Filter navItems based on roles
  const filteredNavItems = navItems.filter(
    (item) => !(item.name === "Admins" && !roles.includes("super_admin"))
  );

  return (
    <>
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={toggleSidebar}
        />
      )}
      <div
        className={cn(
          "fixed top-0 left-0 h-screen bg-white border-r border-gray-200 transition-all duration-300 z-40 flex flex-col",
          isOpen ? "w-64" : "w-20",
          isMobile && !isOpen && "w-0",
          isMobile && isOpen && "w-64"
        )}
      >
        <div className="flex justify-between items-center p-4">
          {(isOpen || !isMobile) && (
            <div className="transition-all duration-300 flex items-center w-[180px]">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/UTKARSH%20SMART%20LOGO-HBCItBq06IhBSDsRfuRGKTQMdVwJUp.svg"
                alt="Utkarsh Smart Logo"
                width={LOGO_WIDTH}
                height={LOGO_HEIGHT}
                className="max-w-full h-auto"
                priority
              />
            </div>
          )}
          {!isMobile && (
            <button
              onClick={toggleSidebar}
              className={cn(
                "p-2 hover:bg-muted rounded-lg transition-all duration-300",
                isOpen ? "ml-auto" : "mx-auto"
              )}
            >
              <Menu className="h-5 w-5 text-foreground" />
            </button>
          )}
          {isMobile && isOpen && (
            <button
              onClick={toggleSidebar}
              className="p-2 hover:bg-muted rounded-lg"
            >
              <X className="h-5 w-5 text-foreground" />
            </button>
          )}
        </div>
        <nav className="mt-8 flex-grow">
          {filteredNavItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center px-4 py-3 text-gray-600 hover:bg-primary hover:text-white w-full transition-colors duration-200",
                !isOpen && !isMobile && "justify-center",
                pathname === item.href && "bg-primary text-white"
              )}
              onClick={isMobile ? toggleSidebar : undefined}
            >
              <item.icon className="h-5 w-5" />
              {(isOpen || isMobile) && (
                <span className="ml-3 text-body">{item.name}</span>
              )}
            </Link>
          ))}
        </nav>
        <div className="mt-auto">
          <Link
            href="/dashboard/profile"
            className={cn(
              "flex items-center px-4 py-3 text-foreground hover:bg-muted w-full",
              !isOpen && "justify-center",
              pathname === "/dashboard/profile" && "bg-primary/10 text-primary",
            )}
          >
            <User className="h-5 w-5" />
            {isOpen && <span className="ml-3 text-body">Profile</span>}
          </Link>
          <Link
            href="/dashboard/settings"
            className={cn(
              "flex items-center px-4 py-3 text-foreground hover:bg-muted w-full",
              !isOpen && "justify-center",
              pathname === "/dashboard/settings" && "bg-primary/10 text-primary",
            )}
          >
            <Settings className="h-5 w-5" />
            {isOpen && <span className="ml-3 text-body">Settings</span>}
          </Link>
          <button
            onClick={handleLogout}
            className={cn(
              "flex items-center px-4 py-3 text-foreground hover:bg-muted w-full",
              !isOpen && "justify-center",
            )}
          >
            <LogOut className="h-5 w-5" />
            {isOpen && <span className="ml-3 text-body">Logout</span>}
          </button>
        </div>
      </div>
      {!isMobile && (
        <div
          className={cn(
            "transition-all duration-300",
            isOpen ? "ml-64" : "ml-20"
          )}
        ></div>
      )}
    </>
  );
}
