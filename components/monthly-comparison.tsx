"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fetchGraphData } from "../service/dashboard";

interface ChartData {
  name: string;
  JNP: number;
  GRP: number;
}

export default function MonthlyComparison() {
  const [timeframe, setTimeframe] = useState("yearly");
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const apiTimeFrame = timeframe === "yearly" ? "fy" : "monthly"; // adjust as needed
        const data = await fetchGraphData(apiTimeFrame);

        // Transform API response to match chart format
        const transformed: ChartData[] = Object.keys(data.JNP).map((key) => ({
          name: key,
          JNP: data.JNP[key],
          GRP: data.GRP[key] ?? 0,
        }));

        setChartData(transformed);
      } catch (error) {
        console.error("Error loading chart data", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [timeframe]);

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between p-4">
        <CardTitle className="text-lg font-medium text-primary">
          JNP and GRP Comparison
        </CardTitle>
        <Select value={timeframe} onValueChange={setTimeframe}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Select timeframe" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="yearly">Yearly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="p-4 h-[calc(100%-76px)]">
        {loading ? (
          <div className="text-center text-sm text-muted">Loading chart...</div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} barGap={2} barCategoryGap={4}>
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#888", fontSize: 12 }}
              />
              <YAxis hide />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="JNP"
                name="JNP"
                fill="#007ACC"
                radius={[4, 4, 0, 0]}
                maxBarSize={30}
              />
              <Bar
                dataKey="GRP"
                name="GRP"
                fill="#48C774"
                radius={[4, 4, 0, 0]}
                maxBarSize={30}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
