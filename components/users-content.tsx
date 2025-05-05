"use client";

import axios from "axios";
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Pencil, Eye, EyeOff } from "lucide-react";

type Admin = {
  id: number;
  user_name: string;
  email: string;
  origin: string;
  password?: string;
  role: string;
};

export function UsersContent() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<Admin | null>(null);
  const [showPasswords, setShowPasswords] = useState<{
    [key: number]: boolean;
  }>({});

  useEffect(() => {
    const fetchAdmins = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get("https://verify.utkarshsmart.in/api/user", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const filteredAdmins = response.data.users.filter((user: Admin) => user.role !== "admin");
        setAdmins(filteredAdmins);
        console.log("Fetched Admins:", filteredAdmins);
      } catch (error) {
        console.error("Failed to fetch admins:", error);
      }
    };

    fetchAdmins();
  }, []);

  const handleEditAdmin = (admin: Admin) => {
    setEditingAdmin({ ...admin, password: "" });
    setIsModalOpen(true);
  };

  const handleSaveAdmin = async () => {
    if (!editingAdmin) return;

    const token = localStorage.getItem("token");
    const adminId = editingAdmin.id;

    const updateData = {
      email: editingAdmin.email,
      user_name: editingAdmin.user_name,
      password: editingAdmin.password,
    };

    try {
      const response = await axios.put(
        `https://verify.utkarshsmart.in/api/user/${adminId}`,
        updateData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Update response:", response.data);

      setAdmins((prev) =>
        prev.map((admin) =>
          admin.id === adminId ? { ...admin, ...response.data } : admin
        )
      );

      setIsModalOpen(false);
      setEditingAdmin(null);
    } catch (error) {
      console.error("Failed to update admin:", error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>User</CardTitle>
        <CardDescription>Manage User for utkarsh groups</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Origin</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {admins.map((admin) => (
              <TableRow key={admin.id}>
                <TableCell>{admin.user_name}</TableCell>
                <TableCell>{admin.email}</TableCell>
                <TableCell>{admin.origin}</TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEditAdmin(admin)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Admin</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                User Name
              </Label>
              <Input
                id="name"
                value={editingAdmin?.user_name || ""}
                onChange={(e) =>
                  setEditingAdmin((admin) =>
                    admin ? { ...admin, name: e.target.value } : null
                  )
                }
                className="col-span-3"
                readOnly
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={editingAdmin?.email || ""}
                onChange={(e) =>
                  setEditingAdmin((admin) =>
                    admin ? { ...admin, email: e.target.value } : null
                  )
                }
                className="col-span-3"
                readOnly
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="password" className="text-right">
                New Password
              </Label>
              <Input
                id="password"
                type="password"
                value={editingAdmin?.password || ""}
                onChange={(e) =>
                  setEditingAdmin((admin) =>
                    admin ? { ...admin, password: e.target.value } : null
                  )
                }
                className="col-span-3"
                placeholder="Enter new password to change"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSaveAdmin}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
