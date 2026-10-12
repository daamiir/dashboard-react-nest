import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";

import { Toaster } from "@/components/ui/sonner";
import { AuthInitializer } from "@/modules/auth/components/AuthInitializer";
import { toast } from "sonner";

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (err) => {
      if (err instanceof TypeError) {
        toast.error("Network error, check your connection", {
          id: "network-error",
        });
      }
    },
  }),
});
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
