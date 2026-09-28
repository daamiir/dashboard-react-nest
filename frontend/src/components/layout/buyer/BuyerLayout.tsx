import { Outlet } from "react-router-dom";
import Header from "./Header";

const BuyerLayout = () => (
  <div className="min-h-screen bg-[#f0f1f2]">
    <Header />
    <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <Outlet />
    </main>
  </div>
);

export default BuyerLayout;
