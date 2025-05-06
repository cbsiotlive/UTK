"use client";

import type React from "react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { changeUserPassword } from "../service/ProfileService";
import { toast } from "react-toastify";

type Profile = {
  name: string;
  email: string;
  role: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export function ProfileContent() {
  const [profile, setProfile] = useState<Profile>({
    name: "",
    email: "",
    role: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    // Ensure localStorage is accessed only on the client side
    if (typeof window !== "undefined") {
      const localEmail = localStorage.getItem("email") || "";
      const localName = localStorage.getItem("userName") || "";
      const localRole = localStorage.getItem("role") || "";

      setProfile({
        ...profile,
        name: localName,
        email: localEmail,
        role: localRole,
      });
    }
  }, []);

  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (profile.newPassword !== profile.confirmPassword) {
      toast.error("New password and confirm password do not match");
      return;
    }
  
    const userId = localStorage.getItem("id") || "";
    const token = localStorage.getItem("token") || "";
  
    const success = await changeUserPassword({
      userId,
      oldPassword: profile.currentPassword,
      newPassword: profile.newPassword,
      confirmPassword: profile.confirmPassword,
      token,
    });
  
    if (success) {
      toast.success("Password changed successfully. Please log in again.");
      setIsChangingPassword(false);
      setProfile((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));
      localStorage.clear();
      router.push("/login");
    } else {
      toast.error("Failed to change password");
    }
  };
  

  const handleChangePasswordClick = () => {
    setIsChangingPassword(true);
    setProfile((prev) => ({ ...prev, newPassword: "", confirmPassword: "" }));
  };

  const handleCancelPasswordChange = () => {
    setIsChangingPassword(false);
    setProfile((prev) => ({ ...prev, newPassword: "", confirmPassword: "" }));
    setError(null);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
        <CardDescription>Manage your profile information</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">User Name / User ID</Label>
          <Input id="name" name="name" value={profile.name} readOnly />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={profile.email}
            readOnly
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="role">Role</Label>
          <Input id="role" name="role" value={profile.role} readOnly />
        </div>
        <div className="space-y-2">
          <Label htmlFor="currentPassword">Current Password</Label>
          <Input
            id="currentPassword"
            name="currentPassword"
            type="password"
            value={profile.currentPassword}
            onChange={handleInputChange}
            placeholder="Enter current password"
          />
        </div>
        {!isChangingPassword ? (
          <Button onClick={handleChangePasswordClick}>Change Password</Button>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                name="newPassword"
                type="password"
                value={profile.newPassword}
                onChange={handleInputChange}
                placeholder="Enter new password"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={profile.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirm new password"
              />
            </div>
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="space-x-2">
              <Button type="submit">Save New Password</Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleCancelPasswordChange}
              >
                Cancel
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
