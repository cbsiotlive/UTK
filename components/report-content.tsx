"use client";

import axios from "axios";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
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
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FileSpreadsheet, FileText } from "lucide-react";
import { PRODUCT_NAMES, type ProductName } from "@/lib/constants";
import { startOfMonth, endOfMonth, subMonths } from "date-fns";

type ReportData = {
  id: number;
  product_name: ProductName;
  quantity: number;
  date: string;
};

type DateRangeType = "custom" | "fy" | "thisMonth" | "previousMonth";

const formatDate = (date: Date) => {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); 
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

export function ReportContent() {
  const [reportType, setReportType] = useState<"product" | "qr">("product");
  const [selectedProduct, setSelectedProduct] = useState<ProductName | "all">(
    "all"
  );
  const [dateRangeType, setDateRangeType] = useState<DateRangeType>("custom");
  const [dateRange, setDateRange] = useState<
    { from: Date; to: Date } | undefined
  >();
  const [reportData, setReportData] = useState<ReportData[]>([]);

  const handleDateRangeTypeChange = (value: DateRangeType) => {
    setDateRangeType(value);

    const today = new Date();

    switch (value) {
      case "fy":
        // Assuming fiscal year starts from April 1st
        const currentYear = today.getFullYear();
        const fiscalYearStart = new Date(currentYear, 3, 1); // April 1st
        if (today < fiscalYearStart) {
          // If current date is before April, use previous year
          fiscalYearStart.setFullYear(currentYear - 1);
        }
        const fiscalYearEnd = new Date(
          fiscalYearStart.getFullYear() + 1,
          2,
          31
        ); // March 31st next year
        setDateRange({ from: fiscalYearStart, to: fiscalYearEnd });
        break;

      case "thisMonth":
        setDateRange({
          from: startOfMonth(today),
          to: endOfMonth(today),
        });
        break;

      case "previousMonth":
        const previousMonth = subMonths(today, 1);
        setDateRange({
          from: startOfMonth(previousMonth),
          to: endOfMonth(previousMonth),
        });
        break;

      case "custom":
        setDateRange(undefined);
        break;
    }
  };

  const generateReport = async () => {
    const token = localStorage.getItem("token");
    const requestBody = {
      product_name: selectedProduct,
      start_date: dateRange?.from?.toISOString().split("T")[0] ?? "",
      end_date: dateRange?.to?.toISOString().split("T")[0] ?? "",
    };

    try {
      const response = await axios.post(
        "https://verify.utkarshsmart.in/api/product/report",
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const reportData = response.data.report;
      console.log("Report Data:", reportData);
      setReportData(reportData);

      console.log(`Report Type: ${reportType}`);
      console.log(`Product: ${selectedProduct}`);
      console.log(`Date Range Type: ${dateRangeType}`);
      console.log(
        `Date Range: ${
          dateRange
            ? `${dateRange.from.toLocaleDateString()} to ${dateRange.to.toLocaleDateString()}`
            : "Not set"
        }`
      );
    } catch (error) {
      console.error("Error fetching report data:", error);
    }
  };

  const exportToExcel = () => {
    console.log("Exporting to Excel:", reportData);
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(reportData);
    XLSX.utils.book_append_sheet(wb, ws, "Report");
    const fileName = `${selectedProduct}_report_${
      new Date().toISOString().split("T")[0]
    }.xlsx`;
    XLSX.writeFile(wb, fileName);
    alert("Export initiated: " + fileName);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Report Data", 14, 16);
    const tableColumn = ["Date", "Product Name", "Quantity"];
    const tableRows: (string | number)[][] = [];
    reportData.forEach((item) => {
      const reportRow = [item.date, item.product_name, item.quantity];
      tableRows.push(reportRow);
    });

    autoTable(doc, { head: [tableColumn], body: tableRows, startY: 30 });
    doc.save("report.pdf");
    console.log("Exporting to PDF:", reportData);
    alert("PDF has been created and downloaded.");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Report</CardTitle>
          <CardDescription>Generate custom reports</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Report Type</Label>
            <Select
              value={reportType}
              onValueChange={(value: "product" | "qr") => setReportType(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select report type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="product">Product Report</SelectItem>
                <SelectItem value="qr">QR Mapping Report</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Product</Label>
            <Select
              value={selectedProduct}
              onValueChange={(value: ProductName | "all") =>
                setSelectedProduct(value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select product" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Products</SelectItem>
                {Object.values(PRODUCT_NAMES).map((name) => (
                  <SelectItem key={name} value={name}>
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Date Range Type</Label>
            <Select
              value={dateRangeType}
              onValueChange={handleDateRangeTypeChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select date range type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="custom">Custom Range</SelectItem>
                <SelectItem value="fy">FY</SelectItem>
                <SelectItem value="thisMonth">This Month</SelectItem>
                <SelectItem value="previousMonth">Previous Month</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {dateRangeType === "custom" && (
            <div className="space-y-2">
              <Label>Custom Date Range</Label>
              <DatePickerWithRange
                date={dateRange}
                setDate={(date) =>
                  setDateRange(
                    date ? { from: date.from!, to: date.to! } : undefined
                  )
                }
              />
            </div>
          )}
          {dateRangeType !== "custom" && dateRange && (
            <div className="space-y-2">
              <Label>Selected Date Range</Label>
              <div className="text-sm text-muted-foreground">
                From: {formatDate(dateRange.from)} - To:{" "}
                {formatDate(dateRange.to)}
              </div>
            </div>
          )}
          <Button onClick={generateReport}>Generate Report</Button>
        </CardContent>
      </Card>

      {reportData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Report Results</CardTitle>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={exportToExcel}>
                <FileSpreadsheet className="mr-2 h-4 w-4" />
                Export to Excel
              </Button>
              <Button variant="outline" onClick={exportToPDF}>
                <FileText className="mr-2 h-4 w-4" />
                Export to PDF
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product Name</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reportData.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>{row.product_name}</TableCell>
                    <TableCell>{row.quantity}</TableCell>
                    <TableCell>{row.date}</TableCell>
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
function autoTable(
  doc: jsPDF,
  {
    head,
    body,
    startY,
  }: { head: string[][]; body: (string | number)[][]; startY: number }
) {
  // Set initial position for the table
  let y = startY;

  // Add table header
  head.forEach((headerRow) => {
    headerRow.forEach((header, index) => {
      doc.text(header, 14 + index * 40, y);
    });
    y += 10;
  });

  // Add table body
  body.forEach((row) => {
    row.forEach((cell, index) => {
      doc.text(String(cell), 14 + index * 40, y);
    });
    y += 10;
  });
}
