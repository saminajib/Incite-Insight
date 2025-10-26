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
  { month: "January", desktop: 276 },
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
    color: "var(--chart-2)",
  } 
}

export function ChartRadarDots({data=[], dataKeyAxis="", dataKeyRadar=""}) {

  console.log(data);

  if (!data || data.length == 0){
    data = defaultData;
    //console.log("Radar dots chart: Data empty. Using default data...\n");
  }

  if(dataKeyAxis == ""){
    dataKeyAxis = "month";
    //console.log("Radar dots chart: No key inputted for PolarAngleAxis. Using default... \n");
  }

  if(dataKeyRadar == ""){
    dataKeyRadar = "desktop"
    //console.log("Radar dots chart: No key inputted for Radar. Using default...\n");
  }

  return (
    <Card className="border-0 shadow-none bg-transparent">

      
      <CardContent className="pb-0">
        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px]">
          <RadarChart data={data}>
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <PolarAngleAxis dataKey={dataKeyAxis} />
            <PolarGrid stroke="gray"/>
            <Radar
              dataKey={dataKeyRadar}
              fill="oklch(63.7% 0.237 25.331)"
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
