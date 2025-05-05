"use client"

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const data = [
  { name: "JNP", value: 80 },
  { name: "GRP", value: 20 },
]

const COLORS = ["#3b82f6", "#10b981"]

export default function ProductDistribution() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium">Total Product</CardTitle>
      </CardHeader>
      <CardContent className="flex justify-between items-center">
        <ResponsiveContainer width="50%" height={100}>
          <PieChart>
            <Pie data={data} cx="50%" cy="50%" innerRadius={30} outerRadius={40} fill="#8884d8" dataKey="value">
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="space-y-2">
          {data.map((entry, index) => (
            <div key={`legend-${index}`} className="flex items-center">
              <div className="w-3 h-3 mr-2" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
              <span className="text-sm">
                {entry.name} {entry.value}%
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

