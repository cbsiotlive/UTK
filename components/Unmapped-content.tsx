"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { fetchUnmappedData } from "../service/UnmappedService";
import { toast } from "react-toastify";

interface ReportData {
  id: string;
  product: string;
  unmapped_at: string;
}

export function UnmappedContent() {
  const [reportData, setReportData] = useState<ReportData[]>([]);
  const [qrId, setQrId] = useState("");
  const [product, setProduct] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchReportData = async () => {
    if (!qrId && !product) {
      toast.error("Please enter QR ID or select a product");
      setError("Please enter QR ID or select a product");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const data = await fetchUnmappedData(qrId, product);
      setReportData(data);
      if (data.length > 0) {
        toast.success(`Found ${data.length} unmapped QR codes`);
      } else {
        toast.info("No unmapped QR codes found");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "An error occurred while fetching data";
      toast.error(errorMessage);
      setError(errorMessage);
      setReportData([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Unmapped QR</CardTitle>
          <CardDescription>Report for custom unmapped QR codes</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && <div className="text-red-500">{error}</div>}

          <div className="space-y-2">
            <Label>QR ID</Label>
            <input
              type="text"
              placeholder="Enter QR ID"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={qrId}
              onChange={(e) => setQrId(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Product</Label>
            <Select value={product} onValueChange={setProduct}>
              <SelectTrigger>
                <SelectValue placeholder="Select product" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Products</SelectItem>
                <SelectItem value="MBCB">MBCB</SelectItem>
                <SelectItem value="HM">HM</SelectItem>
                <SelectItem value="POLE">POLE</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button onClick={fetchReportData} disabled={isLoading}>
            {isLoading ? "Loading..." : "Generate Report"}
          </Button>
        </CardContent>
      </Card>

      {reportData.length > 0 && (
        <Card>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>QR ID</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Unmapped Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reportData.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>{row.id}</TableCell>
                    <TableCell>{row.product}</TableCell>
                    <TableCell>{row.unmapped_at}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
