import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { fetchTotalProductData } from "../service/UserDashboardService";

const COLORS = [
  "#007ACC",
  "#48C774",
  "#00C000",
  "rgb(3, 141, 3)",
  "rgb(11, 81, 129)",
];

export default function TotalProductUser() {
  const [chartData, setChartData] = useState<{ name: string; value: number }[]>(
    []
  );
  const [origin] = useState(
    localStorage.getItem("origin") || "Default"
  );

  useEffect(() => {
    const getData = async () => {
      try {
        const data = await fetchTotalProductData(origin);
        setChartData(data);
      } catch (error) {
        console.log(error);
      }
    };

    getData();
  }, [origin]);

  return (
    <Card className="h-full">
      <CardHeader className="p-4 pb-0">
        <CardTitle className="text-lg font-medium text-primary">
          Total Users {origin}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 flex items-center justify-center h-[calc(100%-60px)]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius="75%"
              outerRadius="95%"
              startAngle={90}
              endAngle={450}
              dataKey="value"
              labelLine={false}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value, name) => [
                `${value} (${(
                  (Number(value) /
                    chartData.reduce((sum, entry) => sum + entry.value, 0)) *
                  100
                ).toFixed(0)}%)`,
                name,
              ]}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
