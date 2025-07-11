import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";

import Login from "./pages/Login";
import Register from "./pages/Register";

import JobSeekerRegister from "./pages/jobseeker/JobSeekerRegister";
import EmployerRegister from "./pages/employer/EmployerRegister";
import TrainerRegister from "./pages/trainer/TrainerRegister";

import AdminDashboard from "./pages/admin/AdminDashboard";
import JobSeekerDashboard from "./pages/jobseeker/JobSeekerDashboard";
import EmployerDashboard from "./pages/employer/EmployerDashboard";
import TrainerDashboard from "./pages/trainer/TrainerDashboard";

import Layout from "./components/Layout";

function PrivateRoute({ children, roles }) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/login" replace />;
  return children;
}

function ProfileCheckRoute({ children, role }) {
  const { user } = useAuth();
  const [profileExists, setProfileExists] = React.useState(null);

  React.useEffect(() => {
    if (!user) return;
    async function fetchProfile() {
      try {
        const res = await fetch(`http://localhost:8081/api/${role}s/user/${user.id}`);
        // if (res.status === 404) setProfileExists(false);
        // else if (res.ok) setProfileExists(true);
        // else setProfileExists(false);

        if (res.ok) {
  setProfileExists(true);
} else {
  // Treat 400 or 404 as "not found"
  setProfileExists(false);
}

      } catch {
        setProfileExists(false);
      }
    }
    fetchProfile();
  }, [user, role]);

  if (profileExists === null) return <div>Loading...</div>;
  if (!profileExists) return <Navigate to={`/${role}/register-profile`} replace />;

  return children;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes wrapped with Layout */}
          <Route path="/login" element={<Layout><Login /></Layout>} />
          <Route path="/register" element={<Layout><Register /></Layout>} />

          {/* JobSeeker routes */}
          <Route
            path="/jobseeker/register-profile"
            element={
              <PrivateRoute roles={["jobseeker"]}>
                <Layout>
                  <JobSeekerRegister />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/jobseeker/dashboard"
            element={
              <PrivateRoute roles={["jobseeker"]}>
                <ProfileCheckRoute role="jobseeker">
                  <Layout>
                    <JobSeekerDashboard />
                  </Layout>
                </ProfileCheckRoute>
              </PrivateRoute>
            }
          />




          {/* Employer routes */}
          <Route
            path="/employer/register-profile"
            element={
              <PrivateRoute roles={["employer"]}>
                <Layout>
                  <EmployerRegister />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/employer/dashboard"
            element={
              <PrivateRoute roles={["employer"]}>
                <ProfileCheckRoute role="employer">
                  <Layout>
                    <EmployerDashboard />
                  </Layout>
                </ProfileCheckRoute>
              </PrivateRoute>
            }
          />

          {/* Trainer routes */}
          <Route
            path="/trainer/register-profile"
            element={
              <PrivateRoute roles={["trainer"]}>
                <Layout>
                  <TrainerRegister />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/trainer/dashboard"
            element={
              <PrivateRoute roles={["trainer"]}>
                <ProfileCheckRoute role="trainer">
                  <Layout>
                    <TrainerDashboard />
                  </Layout>
                </ProfileCheckRoute>
              </PrivateRoute>
            }
          />

          {/* Admin route */}
          <Route
            path="/admin/dashboard"
            element={
              <PrivateRoute roles={["admin"]}>
                <Layout>
                  <AdminDashboard />
                </Layout>
              </PrivateRoute>
            }
          />

          {/* Redirect unknown routes */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
