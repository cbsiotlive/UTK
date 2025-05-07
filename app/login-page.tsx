"use client";

import type React from "react";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { loginUser } from "../service/AuthService"; 


export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    try {
      const data = await loginUser(username, password);
    
      if (data.isLogin) {
        if (data.role === "user") {
          setError("You are not authorized to use this dashboard.");
          return;
        }
    
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("token", data.token);
        localStorage.setItem("email", data.email);
        localStorage.setItem("userName", data.userName);
        localStorage.setItem("role", data.role);
        localStorage.setItem("origin", data.origin);
        localStorage.setItem("id", data.id);
    
        router.push("/dashboard");
      } else {
        setError("Invalid username or password");
      }
    } catch (error) {
      setError("Invalid credentials");
    }
    
  };

  return (
    <div className="flex h-screen bg-muted">
      {/* Left Section */}
      <div className="w-1/2 p-8 flex items-center justify-center bg-white">
        <div className="w-full max-w-md space-y-8">
          <div>
            <h2 className="text-header font-bold text-gray-900">Welcome to</h2>
            <h2 className="text-header font-bold bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text mt-2">
              Utkarsh AuthenticProduct
            </h2>
            <p className="mt-2 text-body text-muted-foreground">
              Please sign in to your account to continue
            </p>
          </div>
          <form onSubmit={handleLogin} className="mt-8 space-y-6">
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-caption font-medium text-gray-700"
                >
                  User Name
                </label>
                <div className="mt-1">
                  <Input
                    id="email"
                    type="text"
                    placeholder="admin"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="block w-full px-3 py-2 border border-border rounded-md shadow-sm focus:ring-primary focus:border-primary"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block text-caption font-medium text-gray-700"
                >
                  Password
                </label>
                <div className="mt-1 relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="6+ strong character"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full px-3 py-2 border border-border rounded-md shadow-sm focus:ring-primary focus:border-primary"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOffIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {error && (
              <p className="text-caption text-error" role="alert">
                {error}
              </p>
            )}

            <div className="space-y-6">
              <Button
                type="submit"
                className="w-full py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Sign in
              </Button>

              <div className="text-center">
                <p className="text-caption text-muted-foreground">
                  Developed by{" "}
                  <span className="font-semibold bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">
                    Conglomerate Business Solutions
                  </span>
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Right Section */}
      <div className="w-1/2 relative overflow-hidden">
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/login-page-photo.jpg-UFFYaz3FLdTSDJs8EmgLC8EMk1Ax2E.jpeg"
          alt="Utkarsh High Mast Lighting"
          fill
          className="object-cover"
          priority
          quality={100}
        />
      </div>
    </div>
  );
}
