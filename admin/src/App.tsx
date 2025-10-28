import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/AdminSidebar";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import { AuthForm } from "./components/AuthForm";
import { AuthProvider } from "@/context/AuthContext.jsx";
import { AuthDebug } from "./components/AuthDebug";
import { ErrorBoundary } from "./components/ErrorBoundary";
// import ContentManagement from "./pages/ContentManagement";

import VendorManagement from "./pages/VendorManagement";
import TrendingNews from "./pages/TrendingNewsNew";
import StudentManagement from "./pages/StudentManagement";
import StudentProfile from "./pages/StudentProfile";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import FieldManagement from "./pages/FieldManagement";
import Directory from "./pages/Directory";
import FormEditor from "./pages/FormEditor";
import EventPackages from "./pages/EventPackages";
import Events from "./pages/Events";
import Venues from "./pages/Venues";
import Services from "./pages/Services";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const AppContent = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SidebarProvider>
          <div className="min-h-screen flex w-full bg-background">
            <AuthDebug />
            <AdminSidebar />
            <main className="flex-1 p-6 md:p-8 lg:p-10 overflow-auto">
              <ErrorBoundary>
                <Routes>
                  <Route path="/login" element={<AuthForm />} />
                  <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
                {/* <Route path="/content" element={<ProtectedRoute><ContentManagement /></ProtectedRoute>} /> */}
                <Route path="/directory" element={<ProtectedRoute><Directory /></ProtectedRoute>} />
                <Route path="/event-packages" element={<ProtectedRoute><EventPackages /></ProtectedRoute>} />
                <Route path="/events" element={<ProtectedRoute><Events /></ProtectedRoute>} />
                <Route path="/venues" element={<ProtectedRoute><Venues /></ProtectedRoute>} />
                <Route path="/services" element={<ProtectedRoute><Services /></ProtectedRoute>} />
                <Route path="/fields" element={<ProtectedRoute><FieldManagement /></ProtectedRoute>} />

                <Route path="/vendors" element={<ProtectedRoute><VendorManagement /></ProtectedRoute>} />
                <Route path="/students" element={<ProtectedRoute><StudentManagement /></ProtectedRoute>} />
                <Route path="/students/:id" element={<ProtectedRoute><StudentProfile /></ProtectedRoute>} />
                <Route path="/trending-news" element={<ProtectedRoute><TrendingNews /></ProtectedRoute>} />
                <Route path="/form-editor" element={<ProtectedRoute><FormEditor /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
                <Route path="*" element={<NotFound />} />
                </Routes>
              </ErrorBoundary>
            </main>
          </div>
        </SidebarProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AppContent />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
