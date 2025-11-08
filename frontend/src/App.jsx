import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Timesheets from './pages/Timesheets';
import TimesheetForm from './pages/TimesheetForm';
import ApproveTimesheets from './pages/ApproveTimesheets';
import Clients from './pages/Clients';
import Projects from './pages/Projects';
import Invoices from './pages/Invoices';
import Employees from './pages/Employees';
import Layout from './components/Layout';

const PrivateRoute = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const AdminRoute = ({ children }) => {
  const user = useAuthStore((state) => state.user);
  return user?.role === 'ROLE_ADMIN' ? children : <Navigate to="/dashboard" />;
};

const ManagerRoute = ({ children }) => {
  const user = useAuthStore((state) => state.user);
  const hasAccess = user?.role === 'ROLE_ADMIN' || user?.role === 'ROLE_MANAGER';
  return hasAccess ? children : <Navigate to="/dashboard" />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/"
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="timesheets" element={<Timesheets />} />
          <Route path="timesheets/new" element={<TimesheetForm />} />
          <Route path="timesheets/:id/edit" element={<TimesheetForm />} />

          <Route
            path="approve-timesheets"
            element={
              <ManagerRoute>
                <ApproveTimesheets />
              </ManagerRoute>
            }
          />

          <Route
            path="clients"
            element={
              <AdminRoute>
                <Clients />
              </AdminRoute>
            }
          />

          <Route
            path="projects"
            element={
              <AdminRoute>
                <Projects />
              </AdminRoute>
            }
          />

          <Route
            path="invoices"
            element={
              <AdminRoute>
                <Invoices />
              </AdminRoute>
            }
          />

          <Route
            path="employees"
            element={
              <AdminRoute>
                <Employees />
              </AdminRoute>
            }
          />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

