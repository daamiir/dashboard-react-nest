import { AppProviders } from "./AppProviders";
import { AppRoutes } from "./routes";
import { ThemeProvider } from "@/components/ui/theme-provider";

export default function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <AppProviders>
        <AppRoutes />
      </AppProviders>
    </ThemeProvider>
  );
}
