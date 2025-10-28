import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Layout } from "@/components/Layout";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Events from "./pages/Events";
import Portfolio from "./pages/Portfolio";
import Profile from "./pages/Profile";
import Packages from "./pages/Packages";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ErrorBoundary>
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/auth" element={<Auth />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <ErrorBoundary>
                        <Dashboard />
                      </ErrorBoundary>
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/events"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <ErrorBoundary>
                        <Events />
                      </ErrorBoundary>
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/portfolio"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <ErrorBoundary>
                        <Portfolio />
                      </ErrorBoundary>
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <ErrorBoundary>
                        <Profile />
                      </ErrorBoundary>
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/packages"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <ErrorBoundary>
                        <Packages />
                      </ErrorBoundary>
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </ErrorBoundary>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
