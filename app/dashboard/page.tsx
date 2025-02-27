"use client";

import React, { useState, useEffect } from "react";
import Dashboard from "@/components/dashboard";
import TotalProductChart from "@/components/total-product-chart";
import TotalProductUser from "@/components/total-product-user";
import MonthlyComparison from "@/components/monthly-comparison";
import MonthlyComparisonUser from "@/components/monthly-admin";
import ProductTable from "@/components/product-table";
import ProductTableUser from "@/components/product-table-user";
import QRSpending from "@/components/qr-spending";
import QRSpendingUser from "@/components/qr-spending-user";

export default function DashboardPage() {
  const [role, setRole] = useState("");

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    setRole(storedRole || "");
  }, []);

  const isAdmin = role === "admin";

  return (
    <Dashboard>
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-4 h-[calc(50vh-80px)]">
          {isAdmin ? <TotalProductUser /> : <TotalProductChart />}
        </div>
        <div className="col-span-8 h-[calc(50vh-80px)]">
          {isAdmin ? <MonthlyComparisonUser /> : <MonthlyComparison />}
        </div>
        <div className="col-span-8 h-[calc(50vh-80px)]">
          {isAdmin ? <ProductTableUser /> : <ProductTable />}
        </div>
        <div className="col-span-4 h-[calc(50vh-80px)]">
          {isAdmin ? <QRSpendingUser /> : <QRSpending />}
        </div>
      </div>
    </Dashboard>
  );
}
