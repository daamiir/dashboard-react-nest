import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";

import { Toaster } from "@/components/ui/sonner";
import { AuthInitializer } from "@/modules/auth/components/AuthInitializer";

const queryClient = new QueryClient();

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthInitializer>
        <BrowserRouter>{children}</BrowserRouter>
      </AuthInitializer>
      <Toaster position="top-right" />
    </QueryClientProvider>
  );
}
