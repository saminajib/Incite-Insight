"use client"

import { TrendingUp } from "lucide-react"
import { Pie, PieChart } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

export const description = "A pie chart with a label"

const chartData = [
  { source: "Salary", amount: 5500, fill: "var(--color-salary)" },
  { source: "Freelance", amount: 1200, fill: "var(--color-freelance)" },
  { source: "Investments", amount: 800, fill: "var(--color-investments)" },
  { source: "Rental Income", amount: 1500, fill: "var(--color-rental)" },
  { source: "Side Business", amount: 600, fill: "var(--color-sidebusiness)" },
]

const chartConfig = {
  amount: {
    label: "Income",
  },
  salary: {
    label: "Salary",
    color: "var(--chart-1)",
  },
  freelance: {
    label: "Freelance Work",
    color: "var(--chart-2)",
  },
  investments: {
    label: "Investments",
    color: "var(--chart-3)",
  },
  rental: {
    label: "Rental Income",
    color: "var(--chart-4)",
  },
  sidebusiness: {
    label: "Side Business",
    color: "var(--chart-5)",
  }
}

export function ChartPieLabel() {
  return (
    <Card className="flex flex-col bg-transparent border-0">
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="[&_.recharts-pie-label-text]:fill-white mx-auto aspect-square max-h-[250px] pb-0">
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Pie data={chartData} dataKey="amount" label nameKey="source" />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
