"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend } from "recharts"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const yearlyData = [
  { month: "Jan", JNP: 800, GRP: 600 },
  { month: "Feb", JNP: 500, GRP: 300 },
  { month: "Mar", JNP: 400, GRP: 600 },
  { month: "Apr", JNP: 300, GRP: 700 },
  { month: "May", JNP: 500, GRP: 800 },
  { month: "Jun", JNP: 800, GRP: 600 },
  { month: "Jul", JNP: 700, GRP: 900 },
  { month: "Aug", JNP: 600, GRP: 500 },
  { month: "Sep", JNP: 900, GRP: 400 },
  { month: "Oct", JNP: 750, GRP: 650 },
  { month: "Nov", JNP: 850, GRP: 750 },
  { month: "Dec", JNP: 950, GRP: 850 },
]

const monthlyData = [
  { week: "Week 1", JNP: 200, GRP: 150 },
  { week: "Week 2", JNP: 180, GRP: 170 },
  { week: "Week 3", JNP: 220, GRP: 190 },
  { week: "Week 4", JNP: 240, GRP: 210 },
]


export default function MonthlyComparison() {
  const [timeframe, setTimeframe] = useState("yearly")

  const getData = () => {
    switch (timeframe) {
      case "yearly":
        return yearlyData
      case "monthly":
        return monthlyData
      default:
        return yearlyData
    }
  }

  const getXAxisKey = () => {
    switch (timeframe) {
      case "yearly":
        return "month"
      case "monthly":
        return "week"
      default:
        return "month"
    }
  }

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between p-4">
        <CardTitle className="text-lg font-medium text-primary">JNP and GRP Comparison</CardTitle>
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
          <BarChart data={getData()} barGap={2} barCategoryGap={4}>
            <XAxis dataKey={getXAxisKey()} axisLine={false} tickLine={false} tick={{ fill: "#888", fontSize: 12 }} />
            <YAxis hide />
            <Tooltip />
            <Legend />
            <Bar dataKey="JNP" name="JNP" fill="#007ACC" radius={[4, 4, 0, 0]} maxBarSize={30} />
            <Bar dataKey="GRP" name="GRP" fill="#48C774" radius={[4, 4, 0, 0]} maxBarSize={30} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

