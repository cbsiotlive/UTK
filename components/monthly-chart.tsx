"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const data = [
  { month: "Jan", value: 400 },
  { month: "Feb", value: 300 },
  { month: "Mar", value: 200 },
  { month: "Apr", value: 500 },
  { month: "May", value: 400 },
  { month: "Jun", value: 300 },
  { month: "Jul", value: 200 },
]

export default function MonthlyChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium">Monthly</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data}>
            <XAxis dataKey="month" axisLine={false} tickLine={false} />
            <YAxis hide={true} />
            <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

