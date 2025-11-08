import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const Layout = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isAdmin = user?.role === 'ROLE_ADMIN';
  const isManager = user?.role === 'ROLE_MANAGER' || isAdmin;

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-blue-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex space-x-8">
              <Link
                to="/dashboard"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium hover:text-blue-200"
              >
                Dashboard
              </Link>
              <Link
                to="/timesheets"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium hover:text-blue-200"
              >
                My Timesheets
              </Link>
              {isManager && (
                <Link
                  to="/approve-timesheets"
                  className="inline-flex items-center px-1 pt-1 text-sm font-medium hover:text-blue-200"
                >
                  Approve Timesheets
                </Link>
              )}
              {isAdmin && (
                <>
                  <Link
                    to="/clients"
                    className="inline-flex items-center px-1 pt-1 text-sm font-medium hover:text-blue-200"
                  >
                    Clients
                  </Link>
                  <Link
                    to="/projects"
                    className="inline-flex items-center px-1 pt-1 text-sm font-medium hover:text-blue-200"
                  >
                    Projects
                  </Link>
                  <Link
                    to="/invoices"
                    className="inline-flex items-center px-1 pt-1 text-sm font-medium hover:text-blue-200"
                  >
                    Invoices
                  </Link>
                  <Link
                    to="/employees"
                    className="inline-flex items-center px-1 pt-1 text-sm font-medium hover:text-blue-200"
                  >
                    Employees
                  </Link>
                </>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm">
                {user?.firstName} {user?.lastName}
              </span>
              <button
                onClick={handleLogout}
                className="btn btn-secondary text-sm"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;

