import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export const description = "An interactive area chart"

const chartConfig = {
  visitors: {
    label: "Visitors",
  },

  mobile: {
    label: "Mobile",
    color: "var(--chart-2)",
  }
}

const ChartAreaInteractive = ({ data, strokeColor = 'Purple', fillColor = 'url(#fillPurple)'}) => {
  const [timeRange, setTimeRange] = React.useState("90d")
  console.log(data[0]);
  data = data && Array.isArray(data) ? data : [];

  return (
    <Card className="pt-0 border-0 bg-grey-600 shadow-none">
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer config={chartConfig} className="bg-grey-600 dark:bg-slate-900 h-[250px] w-full">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-mobile)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-mobile)" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillGreen" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8} /> {/* green-500 */}
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillBlue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} /> {/* blue-500 */}
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillPurple" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#a21caf" stopOpacity={0.8} /> {/* purple-700 */}
                <stop offset="95%" stopColor="#a21caf" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillOrange" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e42" stopOpacity={0.8} /> {/* orange-400 */}
                <stop offset="95%" stopColor="#f59e42" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillPink" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ec4899" stopOpacity={0.8} /> {/* pink-500 */}
                <stop offset="95%" stopColor="#ec4899" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeWidth={0.5} />
            <XAxis
              dataKey="x"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }} />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                  indicator="dot" />
              } />
            <Area
              dataKey="y"
              name="Total"
              type="natural"
              fill={fillColor}
              stroke={strokeColor}
              stackId="a" />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export { ChartAreaInteractive };