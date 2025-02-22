import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Initial from "./pages/Initial";
import NotFound from "./pages/NotFound";
import Edit from "./pages/Edit";
import { GameCodeProvider } from '@/ai/codeContext';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <GameCodeProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Initial />} />
            <Route path="/edit" element={<Edit />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </GameCodeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
