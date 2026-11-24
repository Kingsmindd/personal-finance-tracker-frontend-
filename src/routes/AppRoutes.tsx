import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
const Analystics = lazy(() => import("../pages/Analystics"));
const Dashboard = lazy(() => import("../pages/Dashboard"));
import Login from "../pages/Login";
import NotFound from "../pages/NotFound";
import Register from "../pages/Register";
import Settings from "../pages/Settings";
const Transactions = lazy(() => import("../pages/Transactions"));
import Profile from "../pages/Profile";
import Homepage from "../pages/Homepage";
import ProtectedRoute, { AccountPlaceholder } from "../components/Protectedroute";
import Security from "../pages/security";
import ChangePassword from "../pages/ChangePassword";
import LogoutAllDevices from "../pages/LogoutAllDevices";
import Currency from "../pages/Currency";
import Appearance from "../pages/Appearance";
import VerifyEmail from "../pages/VerifyEmail";
import ResetPassword from "../pages/ResetPassword";
import ForgotPassword from "../pages/ForgotPassword";

const AppRoutes = () => {
  return (
    <div>
      <BrowserRouter>
        <Suspense fallback={<AccountPlaceholder />}>
        <Routes>
          <Route
            path="/analytics"
            element={
              <ProtectedRoute>
                <Analystics />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route path="/login" element={<Login />} />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/settings/preferences/currency"
            element={
              <ProtectedRoute>
                <Currency />
              </ProtectedRoute>
            }
          />

          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/settings/verification" element={<ProtectedRoute><VerifyEmail /></ProtectedRoute>} />

          <Route path="/register" element={<Register />} />

          <Route path="/reset-password" element={<ResetPassword />} />

          <Route path="/forgot-password" element={<ForgotPassword />} />

          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />

          <Route
            path="/settings/security"
            element={
              <ProtectedRoute>
                <Security />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings/security/change-password"
            element={
              <ProtectedRoute>
                <ChangePassword />
              </ProtectedRoute>
            }
          />

          <Route
            path="/settings/security/logout-all"
            element={
              <ProtectedRoute>
                <LogoutAllDevices />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings/preferences/appearance"
            element={
              <ProtectedRoute>
                <Appearance />
              </ProtectedRoute>
            }
          />
          <Route
            path="/transactions"
            element={
              <ProtectedRoute>
                <Transactions />
              </ProtectedRoute>
            }
          />

          <Route path="/" element={<Homepage />} />

          {/* Keep NotFound LAST */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        </Suspense>
      </BrowserRouter>
    </div>
  );
};

export default AppRoutes;
