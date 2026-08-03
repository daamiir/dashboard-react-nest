import { Pie, PieChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartContainer, type ChartConfig } from "@/components/ui/chart";

const chartData = [
  { name: "Progress", value: 75.55, fill: "var(--chart-blue)" },
  { name: "Remaining", value: 24.45, fill: "var(--color-gray-200)" },
];

const chartConfig = {
  progress: {
    label: "Progress",
    color: "var(--chart-blue)",
  },
} satisfies ChartConfig;

export function DashboardPieChart() {
  return (
    <Card className="h-full flex flex-col justify-between rounded-2xl border border-gray-200 p-6 bg-white dark:border-gray-800 dark:bg-white/3">
      <CardHeader>
        <CardTitle>Monthly Target</CardTitle>
        <CardDescription>Target you’ve set for each month</CardDescription>
      </CardHeader>
      <CardContent className="p-0 flex-1 flex flex-col items-center justify-center my-4">
        <div className="relative w-full">
          <ChartContainer config={chartConfig} >
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius="90%"
                outerRadius="100%"
                startAngle={180}
                endAngle={0}
                dataKey="value"
                stroke="none"
                cornerRadius={50}
                paddingAngle={3}
              />
            </PieChart>
          </ChartContainer>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-end text-center">
            <span className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
              75.55%
            </span>
            <span className="mt-1 px-2 py-0.5 text-xs font-semibold rounded-full bg-green-100 border-green-200 text-green-600 dark:bg-green-900/30 dark:text-green-400">
              +10%
            </span>
          </div>
        </div>
        <div className="mt-2 text-sm text-muted-foreground text-center">
          You earn $3287 today, it's higher than last month. Keep up your good
          work!
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex items-center justify-between w-full p-4">
          <div className="flex items-center space-x-2">
            <div className="flex flex-col items-center gap-2">
              <span className="text-sm text-muted-foreground">Target</span>
              <span> $20,000</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex flex-col items-center gap-2">
              <span className="text-sm text-muted-foreground">Revenue</span>
              <span> $20,000</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex flex-col items-center gap-2">
              <span className="text-sm text-muted-foreground">Increase</span>
              <span> $20,000</span>
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
    