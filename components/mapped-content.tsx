"use client";

import { useState, useEffect } from "react";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CheckCircle2, Info } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  fetchQrSheets,
  submitBulkMappedQRCodes,
} from "../service/MappedQrService";
import { toast} from "react-toastify";


const originList = [
  { id: "67c5e370-0084-8000-bcc8-d04db4cf0ff2", label: "GRP" },
  { id: "67c556c9-b228-8000-9865-160b98dacce8", label: "JNP" },
];

export function MappedContent() {
  const [roles, setRoles] = useState("");
  const [batchNumber, setBatchNumber] = useState("");
  const [totalScan, setTotalScan] = useState("");
  const [grade, setGrade] = useState("");
  const [asp, setAsp] = useState("");
  const [selectedQRSheet, setSelectedQRSheet] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedOrigin, setSelectedOrigin] = useState("");
  const [qrSheets, setQrSheets] = useState<
    { id: number; headerText: string; remainingRows: number }[]
  >([]);
  const [error, setError] = useState("");
  const [mappedQRs, setMappedQRs] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredQrSheets, setFilteredQrSheets] = useState(qrSheets);

  useEffect(() => {
    setFilteredQrSheets(
      qrSheets.filter((sheet) =>
        sheet.headerText.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, qrSheets]);

  useEffect(() => {
    const userRole = localStorage.getItem("role");
    setRoles(userRole ?? "");

    const fetchData = async () => {
      try {
        const data = await fetchQrSheets();
        setQrSheets(data);
        // toast.success("QR codes successfully mapped for batch");
      } catch (error) {
        console.error("Error fetching QR sheet data:", error);
        toast.error("Error fetching QR sheet data");
      }
    };

    fetchData();
  }, []);

  const handleSelection = (value: string) => {
    setSelectedQRSheet(value);
    const selectedItem = qrSheets.find((item) => String(item.id) === value);
    console.log("Selected ID:", selectedItem?.id);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate inputs
    if (!batchNumber.trim()) {
      setError("Please enter a batch number");
      return;
    }

    if (!selectedQRSheet) {
      setError("Please select a Printed QR Sheet Unique Number");
      return;
    }

    if (roles.includes("super_admin") && !selectedOrigin) {
      setError("Please select an origin");
      return;
    }

    // Clear any previous errors
    setError("");

    try {
      const data = {
        batch_no: batchNumber,
        header_id: selectedQRSheet,
        origin: selectedOrigin || null,
        total_scan: totalScan,
        grade: grade,
        asp: asp,
      };

      const response = await submitBulkMappedQRCodes(data);

      // Check if response is an empty array
      if (!response || !response.length) {
        setError("No data found");
        setMappedQRs([]);
        setIsSubmitted(false);
        return;
      }

      setMappedQRs(response);
      setIsSubmitted(true);
      toast.success(`QR codes successfully mapped for batch ${batchNumber}`);
    } catch (error) {
      console.error("Error submitting QR mapping:", error);
      toast.error("Failed to map QR codes. Please try again.");
      setError("Failed to map QR codes. Please try again.");
    }
  };

  const resetForm = () => {
    setBatchNumber("");
    setSelectedQRSheet("");
    setIsSubmitted(false);
    setMappedQRs([]);
    setError("");
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="p-4">
        <CardTitle className="text-2xl font-bold">QR Mapping</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow overflow-auto">
        <form onSubmit={handleSubmit} className="space-y-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="batchNumber">Batch Number</Label>
              <Input
                id="batchNumber"
                placeholder="Enter batch number"
                value={batchNumber}
                onChange={(e) => setBatchNumber(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="qrSheetNumber">
                Printed QR Sheet Unique Number
              </Label>
              <Select value={selectedQRSheet} onValueChange={handleSelection}>
                <SelectTrigger id="qrSheetNumber">
                  <SelectValue placeholder="Select QR Sheet number" />
                </SelectTrigger>
                <SelectContent>
                  <div className="relative">
                    <Input
                      placeholder="Search QR sheets..."
                      className="mb-2 sticky top-0"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  {filteredQrSheets.map((sheet) => (
                    <SelectItem key={sheet.id} value={String(sheet.id)}>
                      <span className="flex gap-[20px]">
                        <span>{sheet.headerText}</span>
                        <span className="text-red-400 hover:text-grey-400">
                          (Left-{sheet.remainingRows})
                        </span>
                      </span>
                      
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {roles.includes("super_admin") && (
              <div className="space-y-2">
                <Label htmlFor="origin">Select Origin</Label>
                <Select
                  value={selectedOrigin}
                  onValueChange={setSelectedOrigin}
                >
                  <SelectTrigger id="origin">
                    <SelectValue placeholder="Select Origin" />
                  </SelectTrigger>
                  <SelectContent>
                    {originList.map((origin) => (
                      <SelectItem key={origin.id} value={origin.label}>
                        {origin.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="totalScan">Total Scan</Label>
              <Input
                id="totalScan"
                placeholder="Enter total scan"
                value={totalScan}
                onChange={(e) => setTotalScan(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="grade">Grade</Label>
              <Input
                id="grade"
                placeholder="Enter grade"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="asp">Asp</Label>
              <Input
                id="asp"
                placeholder="Enter asp"
                value={asp}
                onChange={(e) => setAsp(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription className="text-red-500">
              Exercise extreme caution during QR mapping—errors can lead to
              serious issues.
            </AlertDescription>
          </Alert>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={resetForm}>
              Reset
            </Button>
            <Button type="submit">Submit</Button>
          </div>
        </form>

        {isSubmitted && mappedQRs.length > 0 && (
          <div className="space-y-4">
            <Alert className="bg-success/10 border-success text-success">
              <CheckCircle2 className="h-4 w-4 mr-2" />
              <AlertDescription className="font-medium">
                QR codes successfully mapped for batch {batchNumber} with QR
                Sheet {selectedQRSheet}
              </AlertDescription>
            </Alert>

            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Serial No</TableHead>
                    <TableHead>Product Name</TableHead>
                    <TableHead>Mapped Date</TableHead>
                    <TableHead>Mapped Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mappedQRs.map((qr) => (
                    <TableRow key={qr.id}>
                      <TableCell>{qr.id}</TableCell>
                      <TableCell>{qr.product}</TableCell>
                      <TableCell>{qr.mapped_date.split(" ")[0]}</TableCell>
                      <TableCell>
                        {new Date(qr.mapped_date).toLocaleTimeString("en-US", {
                          hour12: false,
                        })}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
