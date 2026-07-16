import { AppProviders } from "./AppProviders";
import AppLayout  from "@/components/layout/AppLayout";
import { AppRoutes } from "./routes";

export default function App() {
  return (
    <AppProviders>
      <AppLayout>
        <AppRoutes />
      </AppLayout>
    </AppProviders>
  );
}
