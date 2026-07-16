import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MoveDown, MoveUp } from "lucide-react";

interface StatsCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  change: string;
}

export const DashboardCard = ({ icon, title, value, change }: StatsCardProps) => {
  const isPositive = change.startsWith("+");
  const cleanValue = change.slice(1);
  const Icon = isPositive ? MoveUp : MoveDown;

  return (
    <Card className="rounded-2xl border border-gray-200 p-6 bg-white  dark:border-gray-800 dark:bg-white/3">
      <CardHeader>
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          {icon}
        </div>
      </CardHeader>
      <CardContent className="mt-5">
        <CardTitle className="text-sm text-gray-500 dark:text-gray-400">
          {title}
        </CardTitle>
        <CardDescription className="mt-2 flex justify-between">
          <h3 className="text-3xl font-bold text-gray-800 text-title-sm dark:text-white/90">
            {value}
          </h3>
          <div
            className={`mt-2 border rounded-lg px-2 py-1 text-xs font-medium ${
              isPositive
                ? "bg-green-100 border-green-200 text-green-600"
                : "bg-red-100 border-red-200 text-red-600"
            }`}
          >
            <div className="flex items-center gap-1">
              <Icon size={10} strokeWidth={3} />
              {cleanValue}
            </div>
          </div>
        </CardDescription>
      </CardContent>
    </Card>
  );
};
