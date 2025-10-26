"use client"

import { TrendingUp } from "lucide-react"
import { LabelList, RadialBar, RadialBarChart } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

export const description = "A radial chart with a label"

const chartData = [
  { browser: "chrome", visitors: 275, fill: "var(--color-chrome)" },
  { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
  { browser: "firefox", visitors: 187, fill: "var(--color-firefox)" },
  { browser: "edge", visitors: 173, fill: "var(--color-edge)" },
  { browser: "other", visitors: 90, fill: "var(--color-other)" },
]

const chartConfig = {
  visitors: {
    label: "Visitors",
  },

  chrome: {
    label: "Chrome",
    color: "var(--chart-1)",
  },

  safari: {
    label: "Safari",
    color: "var(--chart-2)",
  },

  firefox: {
    label: "Firefox",
    color: "var(--chart-3)",
  },

  edge: {
    label: "Edge",
    color: "var(--chart-4)",
  },

  other: {
    label: "Other",
    color: "var(--chart-5)",
  }
}

export function ChartRadialLabel({data=[], dataKeyRadial="", dataKeyLabel=""}) {

  if(!data || data.length == 0){
    data = chartData;
    console.log("Radial label chart: Data is empty. Using default data...\n");
  }

  if(dataKeyRadial == ""){
    dataKeyRadial = "visitors";
    console.log("Radial label chart: dataKeyRadial empty. Using default values...\n");
  }

  if(dataKeyLabel == ""){
    dataKeyLabel = "browser";
    console.log("Radial label chart: dataKeyLabel is empty. Using default values...\n");
  }

  return (
    <Card className="flex flex-col border-0 shadow-none bg-transparent">
      <CardContent className="flex-1 pb-0">
        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px]">
          <RadialBarChart
            data={data}
            startAngle={-90}
            endAngle={380}
            innerRadius={30}
            outerRadius={110}>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel nameKey="browser" />} />
            <RadialBar dataKey={dataKeyRadial} background>
              <LabelList
                position="insideStart"
                dataKey={dataKeyLabel}
                className="fill-white capitalize mix-blend-luminosity"
                fontSize={11} />
            </RadialBar>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
