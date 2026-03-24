import { Navigate, Route, Routes } from "react-router-dom";
import { AuthLayout } from "@/layouts/AuthLayout";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { ProtectedRoute } from "@/routes/ProtectedRoute";
import { GuestRoute } from "@/routes/GuestRoute";
import { Login } from "@/pages/Login";
import { Register } from "@/pages/Register";
import { Dashboard1 } from "@/pages/Dashboard1";
import { Dashboard2 } from "@/pages/Dashboard2";
import { DashboardAdmin } from "@/pages/DashboardAdmin";
import { Orders } from "@/pages/system/Orders";
import { Products } from "@/pages/system/Products";
import { Categories } from "@/pages/system/Categories";
import { Inventory } from "@/pages/system/Inventory";
import { Users } from "@/pages/system/Users";
import { Settings } from "@/pages/system/Settings";
import { PlaceholderPage } from "@/components/PlaceholderPage";
import { Mail } from "@/pages/Mail";
import { Chat } from "@/pages/Chat";
import { Calendar } from "@/pages/Calendar";
import { TasksPage } from "@/pages/tasks/TasksPage";
import { UserSettingsPage } from "@/pages/settings/UserSettingsPage";
import { AccountSettingsPage } from "@/pages/settings/AccountSettingsPage";
import { PlansBillingPage } from "@/pages/settings/PlansBillingPage";
import { AppearancePage } from "@/pages/settings/AppearancePage";
import { NotificationsSettingsPage } from "@/pages/settings/NotificationsSettingsPage";
import { ConnectionsPage } from "@/pages/settings/ConnectionsPage";
import { useAuth } from "@/hooks/useAuth";

function UnauthorizedPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-bold">Unauthorized</h1>
      <p className="text-muted-foreground">You do not have permission to access this page.</p>
    </div>
  );
}

function RootRedirect() {
  const { token, user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role === "admin") {
    return <Navigate to="/system/dashboard" replace />;
  }

  if (user?.role === "staff") {
    return <Navigate to="/system/orders" replace />;
  }

  return <Navigate to="/system/dashboard" replace />;
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
        <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
      </Route>
      <Route
        element={
          <ProtectedRoute allowedRoles={["admin", "staff"]}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/system/dashboard" element={<Dashboard1 />} />
        <Route path="/system/dashboard-2" element={<Dashboard2 />} />
        <Route path="/system/dashboard-admin" element={<DashboardAdmin />} />
        <Route path="/system/orders" element={<Orders />} />
        <Route path="/system/products" element={<Products />} />
        <Route path="/system/categories" element={<Categories />} />
        <Route path="/system/inventory" element={<Inventory />} />
        <Route path="/system/users" element={<Users />} />
        <Route path="/system/settings" element={<Settings />} />
        <Route path="/mail" element={<Mail />} />
        <Route path="/tasks" element={<TasksPage />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/blocks" element={<PlaceholderPage title="Blocks" />} />
        <Route path="/landing" element={<PlaceholderPage title="Landing" />} />
        <Route path="/settings/user" element={<UserSettingsPage />} />
        <Route path="/settings/account" element={<AccountSettingsPage />} />
        <Route path="/settings/billing" element={<PlansBillingPage />} />
        <Route path="/settings/appearance" element={<AppearancePage />} />
        <Route path="/settings/notifications" element={<NotificationsSettingsPage />} />
        <Route path="/settings/connections" element={<ConnectionsPage />} />
        <Route path="/faqs" element={<PlaceholderPage title="FAQs" />} />
        <Route path="/pricing" element={<PlaceholderPage title="Pricing" />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
