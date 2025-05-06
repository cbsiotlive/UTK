"use client";

import { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PRODUCT_NAMES, type ProductName } from "@/lib/constants";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format, parseISO } from "date-fns";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { searchProducts } from "../service/QrService";
import { toast } from "react-toastify";

type SearchFilters = {
  productName: ProductName | "all";
  batchNumber: string;
  serialNo: string;
  fromDate: Date | undefined;
  toDate: Date | undefined;
  mappingStatus: "all" | "mapped" | "unmapped";
  origin: "all" | "GRP" | "JNP";
};

type SearchResult = {
  id: string;
  productName: string;
  batchNumber: string;
  serialNo: string;
  mappingStatus: "mapped" | "unmapped";
  origin: "GRP" | "JNP";
  date: string;
};

export default function QRSearch() {
  const [roles, setRoles] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(true);
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    productName: "all",
    batchNumber: "",
    serialNo: "",
    fromDate: undefined,
    toDate: undefined,
    mappingStatus: "all",
    origin: "all",
  });
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);

  useEffect(() => {
    const userRole = localStorage.getItem("role");
    setRoles(userRole ?? "");
  }, []);

  const handleSearch = async () => {
    // Check if we're on the client side
    if (typeof window === "undefined") return;

    const requestBody = {
      product_name:
        searchFilters.productName === "all"
          ? undefined
          : searchFilters.productName,
      batch_no: searchFilters.batchNumber || undefined,
      serial_no: searchFilters.serialNo || undefined,
      start_date: searchFilters.fromDate
        ? format(searchFilters.fromDate, "yyyy-MM-dd")
        : undefined,
      end_date: searchFilters.toDate
        ? format(searchFilters.toDate, "yyyy-MM-dd")
        : undefined,
      mapping_status:
        searchFilters.mappingStatus === "all"
          ? undefined
          : searchFilters.mappingStatus,
      origin: searchFilters.origin === "all" ? undefined : searchFilters.origin,
    };

    try {
      const data = await searchProducts(requestBody);
      setSearchResults(data);
      toast.success("Search successful!");
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to fetch results.");
    }
  };

  const resetSearch = () => {
    setSearchFilters({
      productName: "all",
      batchNumber: "",
      serialNo: "",
      fromDate: undefined,
      toDate: undefined,
      mappingStatus: "all",
      origin: "all",
    });
    setSearchResults([]);
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex flex-col gap-4 p-4">
        <div className="flex items-center justify-between">
          <CardTitle>QR</CardTitle>
          <Button
            variant={isSearchOpen ? "secondary" : "outline"}
            onClick={() => setIsSearchOpen(!isSearchOpen)}
          >
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </div>
      </CardHeader>

      <CardContent className="flex-grow overflow-auto">
        {isSearchOpen && (
          <div className="grid gap-4 p-4 border rounded-lg bg-muted/50 mb-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="productName">Product Name</Label>
                <Select
                  value={searchFilters.productName}
                  onValueChange={(value: ProductName | "all") =>
                    setSearchFilters((prev) => ({
                      ...prev,
                      productName: value,
                    }))
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
              <div className="grid gap-2">
                <Label htmlFor="batchNumber">Batch Number</Label>
                <Input
                  id="batchNumber"
                  placeholder="Enter batch number"
                  value={searchFilters.batchNumber}
                  onChange={(e) =>
                    setSearchFilters((prev) => ({
                      ...prev,
                      batchNumber: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="serialNo">Serial Number</Label>
                <Input
                  id="serialNo"
                  placeholder="Enter serial number"
                  value={searchFilters.serialNo}
                  onChange={(e) =>
                    setSearchFilters((prev) => ({
                      ...prev,
                      serialNo: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label>Date Range</Label>
                <div className="flex gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !searchFilters.fromDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {searchFilters.fromDate
                          ? format(searchFilters.fromDate, "PP")
                          : "From"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={searchFilters.fromDate}
                        onSelect={(date) =>
                          setSearchFilters((prev) => ({
                            ...prev,
                            fromDate: date,
                          }))
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !searchFilters.toDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {searchFilters.toDate
                          ? format(searchFilters.toDate, "PP")
                          : "To"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={searchFilters.toDate}
                        onSelect={(date) =>
                          setSearchFilters((prev) => ({
                            ...prev,
                            toDate: date,
                          }))
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="mappingStatus">Mapping Status</Label>
                <Select
                  value={searchFilters.mappingStatus}
                  onValueChange={(value: "all" | "mapped" | "unmapped") =>
                    setSearchFilters((prev) => ({
                      ...prev,
                      mappingStatus: value,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select mapping status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="mapped">Mapped</SelectItem>
                    <SelectItem value="unmapped">Unmapped</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {roles.includes("super_admin") && (
                <div className="grid gap-2" id="origin">
                  <Label htmlFor="origin">Origin</Label>
                  <Select
                    value={searchFilters.origin}
                    onValueChange={(value: "all" | "GRP" | "JNP") =>
                      setSearchFilters((prev) => ({ ...prev, origin: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select origin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="GRP">GRP</SelectItem>
                      <SelectItem value="JNP">JNP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={resetSearch}>
                <X className="h-4 w-4 mr-2" />
                Clear
              </Button>
              <Button onClick={handleSearch}>
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </div>
          </div>
        )}

        {searchResults.length > 0 && (
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product Name</TableHead>
                  <TableHead>Batch Number</TableHead>
                  <TableHead>Serial Number</TableHead>
                  <TableHead>Mapping Status</TableHead>
                  <TableHead>Origin</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {searchResults.map((result) => (
                  <TableRow key={result.serialNo}>
                    <TableCell>{result.productName}</TableCell>
                    <TableCell>{result.batchNumber}</TableCell>
                    <TableCell>{result.serialNo}</TableCell>
                    <TableCell>{result.mappingStatus}</TableCell>
                    <TableCell>{result.origin}</TableCell>
                    <TableCell>
                      {result.date
                        ? format(parseISO(result.date), "MM/dd/yyyy")
                        : "N/A"}
                    </TableCell>{" "}
                    {/* Format date if necessary */}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
