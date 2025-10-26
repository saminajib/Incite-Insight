import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, ReferenceLine } from "recharts"

import {
  Card,
  CardContent,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartConfig = {
  visitors: { label: "Visitors" },
  mobile: { label: "Mobile", color: "var(--chart-2)" }
}

const ChartAreaInteractive = ({
  data,
  strokeColor = 'Purple',
  fillColor = 'url(#fillPurple)',
  threshold = null // optional horizontal line value
}) => {
  data = Array.isArray(data) ? data : []

  return (
    <Card className="pt-0 border-0 bg-grey-600 shadow-none">
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer config={chartConfig} className="bg-grey-600 dark:bg-slate-900 h-[250px] w-full">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="fillPurple" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#a21caf" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#a21caf" stopOpacity={0.1} />
              </linearGradient>
              {/* add other gradients if needed */}
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
                  year: "numeric",
                  month: "short",
                })
              }}
            />

            <YAxis tickLine={false} axisLine={false} tickMargin={8} />

            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) =>
                    new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  }
                  indicator="dot"
                />
              }
            />

            <Area
              dataKey="y"
              name="Total"
              type="natural"
              fill={fillColor}
              stroke={strokeColor}
              stackId="a"
            />

            {/* Optional horizontal line */}
            {threshold !== null && (
              <ReferenceLine
                y={threshold}
                stroke="red"
                strokeDasharray="4 4"
                ifOverflow="extendDomain"
              />
            )}
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export { ChartAreaInteractive }
