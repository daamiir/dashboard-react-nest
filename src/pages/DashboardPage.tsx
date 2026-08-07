import {
  CustomerDemographics,
  DashboardBarChart,
  DashboardCard,
  DashboardPieChart,
  RecentOrders
} from "@/modules/dashboard";
import { Users, Box } from "lucide-react";

const DashboardPage = () => {
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="grid grid-cols-12 gap-4 items-stretch md:gap-6">
        <div className="col-span-12 space-y-6 xl:col-span-7">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
            <DashboardCard
              icon={<Users />}
              title="Customers"
              value="3782"
              change="+11.1%"
            />
            <DashboardCard
              icon={<Box />}
              title="Orders"
              value="5359"
              change="-9.05%"
            />
          </div>
          <DashboardBarChart />
        </div>
        <div className="col-span-12 flex flex-col xl:col-span-5">
          <DashboardPieChart />
        </div>
        <div className="col-span-12 xl:col-span-5">
          <CustomerDemographics />
        </div>
        <div className="col-span-12 xl:col-span-7">
          <RecentOrders />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
