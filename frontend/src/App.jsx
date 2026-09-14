/**
 * App.jsx
 * ---
 * Route definitions for the entire WorkFlow HR application.
 */
import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import EmployeeListPage from './pages/EmployeeListPage';
import EmployeeDetailPage from './pages/EmployeeDetailPage';
import AttendancePage from './pages/AttendancePage';
import LeaveRequestPage from './pages/LeaveRequestPage';
import SalaryPage from './pages/SalaryPage';
import DepartmentPage from './pages/DepartmentPage';
import MyProfilePage from './pages/MyProfilePage';
import NotFoundPage from './pages/NotFoundPage';
import DashboardLayout from './components/DashboardLayout';
import ProtectedRoute from './components/ProtectedRoute';


export default function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />

      {/* Protected Dashboard Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />

        <Route
          path="employees"
          element={
            <ProtectedRoute roles={['HR', 'MANAGER', 'PRESIDENT']}>
              <EmployeeListPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="employees/:id"
          element={
            <ProtectedRoute roles={['HR', 'MANAGER', 'PRESIDENT']}>
              <EmployeeDetailPage />
            </ProtectedRoute>
          }
        />

        <Route path="attendance" element={<AttendancePage />} />
        <Route path="leave-requests" element={<LeaveRequestPage />} />
        <Route path="salaries" element={<SalaryPage />} />

        <Route
          path="departments"
          element={
            <ProtectedRoute roles={['HR', 'PRESIDENT']}>
              <DepartmentPage />
            </ProtectedRoute>
          }
        />

        <Route path="profile" element={<MyProfilePage />} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
