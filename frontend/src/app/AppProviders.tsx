import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";

import { Toaster } from "@/components/ui/sonner";

const queryClient = new QueryClient();

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>{children}</BrowserRouter>
      <Toaster position="top-right" />
    </QueryClientProvider>
  );
}
