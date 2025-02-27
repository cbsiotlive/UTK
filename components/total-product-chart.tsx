import axios from "axios";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const COLORS = ["#007ACC", "#48C774"]; 

export default function TotalProductChart() {
  const [data, setData] = useState<{ name: string; value: number }[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const origin = localStorage.getItem("origin") || 'null'; 
      const token = localStorage.getItem("token");

      try {
        const response = await axios.post(
          "https://verify.utkarshsmart.in/api/product/total",
          { origin },
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        const newData = Object.keys(response.data.total).map((key, index) => ({
          name: key,
          value: response.data.total[key].quantity
        }));

        setData(newData);
      } catch (error) {
        console.error("Error fetching product total data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <Card className="h-full">
      <CardHeader className="p-4 pb-0">
        <CardTitle className="text-lg font-medium text-primary">Total Product Overview</CardTitle>
      </CardHeader>
      <CardContent className="p-4 flex items-center justify-between h-[calc(100%-60px)]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius="75%"
              outerRadius="95%"
              startAngle={90}
              endAngle={450}
              dataKey="value"
              labelLine={false}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value, name) => [
                `${value.toLocaleString()} (${((Number(value) / data.reduce((sum, entry) => sum + entry.value, 0)) * 100).toFixed(0)}%)`,
                name,
              ]}
              contentStyle={{ background: "white", border: "1px solid #ccc" }}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}