import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

const chartData = [
  { month: "January", desktop: 168 },
  { month: "February", desktop: 385 },
  { month: "March", desktop: 201 },
  { month: "April", desktop: 298 },
  { month: "May", desktop: 187 },
  { month: "June", desktop: 195 },
  { month: "July", desktop: 291 },
  { month: "August", desktop: 110 },
  { month: "September", desktop: 215 },
  { month: "October", desktop: 390 },
  { month: "November", desktop: 280 },
  { month: "December", desktop: 112 },
];

const chartConfig = {
  desktop: {
    label: "Sales",
    color: "var(--chart-blue)",
  },
} satisfies ChartConfig;

export const DashboardBarChart = () => {
  return (
    <Card className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 gap-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Monthly Sales
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[200px] w-full">
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{ top: 0, right: 0, bottom: 0, left: -20 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <YAxis
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              className=""
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} barSize={30}/>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
