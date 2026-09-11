import { Outlet } from "react-router-dom";
import Header from "./Header";

const BuyerLayout = () => {
  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <Outlet />
      </main>
    </>
  );
};

export default BuyerLayout;
