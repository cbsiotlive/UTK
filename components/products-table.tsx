"use client";

import axios from "axios";
import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProductsTable() {
  interface Product {
    id: number;
    name: string;
    code: string;
    description: string;
    category: string;
  }

  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(
          "https://verify.utkarshsmart.in/api/product",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setProducts(response.data.products);
        console.log("Fetched products:", response.data.products);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <Card className="h-full">
      <CardHeader className="p-4">
        <CardTitle className="text-2xl font-bold">Products</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Product Code</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Category</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.code}</TableCell>
                  <TableCell>{product.description}</TableCell>
                  <TableCell>{product.category}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
