import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ComplaintsPage from './pages/ComplaintsPage';
import NewComplaintPage from './pages/NewComplaintPage';
import ComplaintDetailPage from './pages/ComplaintDetailPage';
import UsersPage from './pages/UsersPage';
import CategoriesPage from './pages/CategoriesPage';
import ReportsPage from './pages/ReportsPage';
import ProfilePage from './pages/ProfilePage';
import AssistantPage from './pages/AssistantPage';

function ProtectedRoute({ children, roles }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/dashboard" replace />;
  return children;
}

function AppRoutes() {
  const { user } = useAuth();
  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <LoginPage />} />

      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Layout><DashboardPage /></Layout>
        </ProtectedRoute>
      } />

      <Route path="/complaints" element={
        <ProtectedRoute>
          <Layout><ComplaintsPage /></Layout>
        </ProtectedRoute>
      } />

      <Route path="/complaints/new" element={
        <ProtectedRoute roles={['karyawan']}>
          <Layout><NewComplaintPage /></Layout>
        </ProtectedRoute>
      } />

      <Route path="/complaints/:id" element={
        <ProtectedRoute>
          <Layout><ComplaintDetailPage /></Layout>
        </ProtectedRoute>
      } />

      <Route path="/users" element={
        <ProtectedRoute roles={['admin']}>
          <Layout><UsersPage /></Layout>
        </ProtectedRoute>
      } />

      <Route path="/categories" element={
        <ProtectedRoute roles={['admin']}>
          <Layout><CategoriesPage /></Layout>
        </ProtectedRoute>
      } />

      <Route path="/reports" element={
        <ProtectedRoute roles={['admin', 'owner']}>
          <Layout><ReportsPage /></Layout>
        </ProtectedRoute>
      } />

      <Route path="/profile" element={
        <ProtectedRoute>
          <Layout><ProfilePage /></Layout>
        </ProtectedRoute>
      } />

      <Route path="/assistant" element={
        <ProtectedRoute>
          <Layout><AssistantPage /></Layout>
        </ProtectedRoute>
      } />

      <Route path="*" element={<Navigate to={user ? '/dashboard' : '/login'} replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <AppProvider>
            <AppRoutes />
          </AppProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
