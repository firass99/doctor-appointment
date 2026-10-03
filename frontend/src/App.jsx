import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { Toaster } from "./components/ui/sonner";
import { AuthProvider } from "./hooks/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import GuestRoute from "./components/GuestRoute";

const HomeLayout = lazy(() => import("./components/pages/(guest)/HomeLayout"));
const HomePage = lazy(() => import("./components/pages/(guest)/HomePage"));
const AboutPage = lazy(() => import("./components/pages/(guest)/AboutPage"));
const LoginPage = lazy(() => import("./components/pages/(guest)/LoginPage"));
const RegisterPage = lazy(() => import("./components/pages/(guest)/RegisterPage"));
const DepartmentsPage = lazy(() => import("./components/pages/(guest)/DepartmentsPage"));
const ContactPage = lazy(() => import("./components/pages/(guest)/ContactPage"));
const DoctorsPage = lazy(() => import("./components/pages/(guest)/DoctorsPage"));
const DoctorsDetails = lazy(() => import("./components/pages/(guest)/DoctorsDetails"));

const DashboardLayout = lazy(() => import("./components/pages/(admin)/DashboardLayout"));
const DashboardOverview = lazy(() => import("./components/pages/(admin)/DashboardOverview"));
const UsersPage = lazy(() => import("./components/pages/(admin)/UsersPage"));
const DoctorsAdminPage = lazy(() => import("./components/pages/(admin)/DoctorsAdminPage"));
const SpecialitiesPage = lazy(() => import("./components/pages/(admin)/SpecialitiesPage"));

const AppointmentsPage = lazy(() => import("./components/pages/(dashboard)/AppointmentsPage"));
const NotificationsPage = lazy(() => import("./components/pages/(dashboard)/NotificationsPage"));
const AccountPage = lazy(() => import("./components/pages/(dashboard)/AccountPage"));
const DoctorProfilePage = lazy(() => import("./components/pages/(dashboard)/DoctorProfilePage"));

function PageLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="" element={<HomeLayout />}>
              <Route index element={<HomePage />} />
              <Route path="about" element={<AboutPage />} />
              <Route path="departments" element={<DepartmentsPage />} />
              <Route path="contact" element={<ContactPage />} />

              <Route path="doctors">
                <Route index element={<DoctorsPage />} />
                <Route path=":id" element={<DoctorsDetails />} />
              </Route>

              {/* signed-out only */}
              <Route element={<GuestRoute />}>
                <Route path="login" element={<LoginPage />} />
                <Route path="register" element={<RegisterPage />} />
              </Route>
            </Route>

            {/* any signed-in role */}
            <Route element={<ProtectedRoute roles={["ADMIN", "DOCTOR", "USER"]} />}>
              <Route path="dashboard" element={<DashboardLayout />}>
                <Route index element={<DashboardOverview />} />
                <Route path="appointments" element={<AppointmentsPage />} />
                <Route path="notifications" element={<NotificationsPage />} />
                <Route path="account" element={<AccountPage />} />

                {/* DOCTOR only */}
                <Route element={<ProtectedRoute roles={["DOCTOR"]} />}>
                  <Route path="doctor-profile" element={<DoctorProfilePage />} />
                </Route>

                {/* ADMIN only */}
                <Route element={<ProtectedRoute roles={["ADMIN"]} />}>
                  <Route path="users" element={<UsersPage />} />
                  <Route path="doctors" element={<DoctorsAdminPage />} />
                  <Route path="specialities" element={<SpecialitiesPage />} />
                </Route>
              </Route>
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
      <Toaster />
    </AuthProvider>
  );
}
export default App;
