"use client"

import { TrendingUp } from "lucide-react"
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

import { useEffect, useState } from "react";

export const description = "A radar chart with dots"

const defaultData = [
  { month: "January", desktop: 186 },
  { month: "February", desktop: 305 },
  { month: "March", desktop: 237 },
  { month: "April", desktop: 273 },
  { month: "May", desktop: 209 },
  { month: "June", desktop: 214 },
]

/* Change this */
const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--chart-4)",
  }
}

export function ChartRadarDots({data = [] }) {

  if (!data || data.length == 0){
    data = defaultData;
  }

  return (
    <Card className="border-0 shadow-none bg-transparent">

      <CardHeader className="items-center">
      </CardHeader>
      <CardContent className="pb-0">
        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px]">
          <RadarChart data={data}>
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <PolarAngleAxis dataKey="month" />
            <PolarGrid stroke="gray"/>
            <Radar
              dataKey="desktop"
              fill="url(#fillMobile)"
              fillOpacity={0.6}
              dot={{
                r: 4,
                fillOpacity: 1,
              }} />
          </RadarChart>
        </ChartContainer>
      </CardContent>
      
    </Card>
  );
}
