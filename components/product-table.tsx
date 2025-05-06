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
import { fetchQuarterlyData } from "../service/dashboard";

type FactoryData = {
  quarter: string;
  mbcb: number;
  hm: number;
  pole: number;
  qrMapped: number;
};

export default function ProductTableUser() {
  const [data, setData] = useState<FactoryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const fetchedData = await fetchQuarterlyData();
        setData(fetchedData);
      } catch (err) {
        setError("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="p-4">
        <CardTitle className="text-lg font-medium text-primary">
          Product QR Mapping
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 flex-1 overflow-auto">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted">
              <TableRow>
                <TableHead className="text-primary">Quarter</TableHead>
                <TableHead className="text-primary">MBCB</TableHead>
                <TableHead className="text-primary">HM</TableHead>
                <TableHead className="text-primary">POLE</TableHead>
                <TableHead className="text-primary">QR Mapped</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{row.quarter}</TableCell>
                  <TableCell>{row.mbcb}</TableCell>
                  <TableCell>{row.hm}</TableCell>
                  <TableCell>{row.pole}</TableCell>
                  <TableCell>{row.qrMapped}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
