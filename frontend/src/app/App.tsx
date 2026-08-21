import { AppProviders } from "./AppProviders";
import AppLayout  from "@/components/layout/AppLayout";
import { AppRoutes } from "./routes";
import { ThemeProvider } from "@/components/ui/theme-provider";

export default function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <AppProviders>
        <AppLayout>
          <AppRoutes />
        </AppLayout>
      </AppProviders>
    </ThemeProvider>
  );
}
