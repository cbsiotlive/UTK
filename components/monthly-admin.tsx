import { useState, useEffect } from "react";
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
import { fetchGraphDataAdmin } from "../service/dashboard"; 

const MonthlyUser = () => {
  const [timeframe, setTimeframe] = useState<"yearly" | "monthly">("yearly");
  const [chartData, setChartData] = useState<
    { name: string; [key: string]: any }[]
  >([]);
  const [origin, setOrigin] = useState("JNP");

  useEffect(() => {
    const storedOrigin = localStorage.getItem("origin") || "JNP";
    setOrigin(storedOrigin);
  }, []);

  useEffect(() => {
    if (origin) {
      fetchGraphDataAdmin(timeframe, origin).then((data) => setChartData(data));
    }
  }, [timeframe, origin]);

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between p-4">
        <CardTitle className="text-lg font-medium text-primary">
          {`${origin} Overview`}
        </CardTitle>
        <Select
          value={timeframe}
          onValueChange={(val: "yearly" | "monthly") => setTimeframe(val)}
        >
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
              dataKey={origin}
              name={origin}
              fill="#007ACC"
              radius={[4, 4, 0, 0]}
              maxBarSize={30}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default MonthlyUser;
