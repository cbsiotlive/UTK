import { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { fetchQRSpendingData} from "../service/dashboard";

const COLORS = ["#48C774", "#FF6B6B"];

export default function QRSpending() {
  const [chartData, setChartData] = useState<{ name: string; value: number }[]>(
    []
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const data = await fetchQRSpendingData();
        setChartData(data);
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
    <Card className="h-full">
      <CardHeader className="p-4 pb-0">
        <CardTitle className="text-lg font-medium text-primary">
          QR Spending
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 flex items-center justify-between h-[calc(100%-60px)]">
        <div className="flex flex-col justify-center space-y-6 w-1/4">
          {chartData.map((entry, index) => (
            <div key={`info-${index}`} className="flex flex-col">
              <div className="flex items-center space-x-2 mb-1">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: COLORS[index] }}
                />
                <span className="text-sm font-medium">{entry.name}</span>
              </div>
              {/* <span className="text-xl font-bold pl-5">{`${entry.value.toFixed(2)}%`}</span> */}
            </div>
          ))}
        </div>
        <div className="w-3/4 h-full flex items-center justify-center">
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
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Pie>
              {/* <Tooltip
                formatter={(value, name) => [`${(Number(value)).toFixed(2)}%`, name]}
                contentStyle={{ background: "white", border: "1px solid #ccc" }}
              /> */}
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
