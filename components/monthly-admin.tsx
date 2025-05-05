import { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const MonthlyUser = () => {
  const [timeframe, setTimeframe] = useState("yearly");
  const [chartData, setChartData] = useState<{ name: string; [key: string]: any }[]>([]);
  const [origin, setOrigin] = useState("JNP"); // Default origin, can be dynamic

  useEffect(() => {
    // Fetch origin from local storage
    const storedOrigin = localStorage.getItem("origin") || "JNP"; // Default to "JNP" if nothing in localStorage
    setOrigin(storedOrigin);

    // Fetch data based on the timeframe
    fetchData();
  }, [timeframe]);

  const fetchData = async () => {
    const token = localStorage.getItem("token"); // Assume you have a token in localStorage
    try {
      const response = await axios.post(
        "https://verify.utkarshsmart.in/api/product/graph",
        { time_frame: timeframe === "yearly" ? "fy" : "monthly" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const newData = parseData(response.data.graph);
      setChartData(newData);
    } catch (error) {
      console.error("Error fetching chart data:", error);
    }
  };

  // Helper function to parse the API response into chart data
  const parseData = (data: { [key: string]: any }) => {
    return Object.keys(data).map((key) => ({
      name: key,
      [origin]: data[key],
    }));
  };

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between p-4">
        <CardTitle className="text-lg font-medium text-primary">{`${origin} Overview`}</CardTitle>
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
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} barGap={2} barCategoryGap={4}>
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#888", fontSize: 12 }} />
            <YAxis hide />
            <Tooltip />
            <Legend />
            <Bar dataKey={origin} name={origin} fill="#007ACC" radius={[4, 4, 0, 0]} maxBarSize={30} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default MonthlyUser;
