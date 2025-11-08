import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { timesheetService } from '../services/timesheetService';

const Dashboard = () => {
  const user = useAuthStore((state) => state.user);
  const [timesheets, setTimesheets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (user?.id) {
        try {
          const response = await timesheetService.getTimesheetsByUserId(user.id, 0, 5);
          setTimesheets(response.content || []);
        } catch (error) {
          console.error('Failed to fetch timesheets:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [user?.id]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'APPROVED':
        return 'bg-green-100 text-green-800';
      case 'SUBMITTED':
        return 'bg-yellow-100 text-yellow-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome, {user?.firstName}!
        </h1>
        <p className="mt-2 text-gray-600">
          Here's an overview of your recent activity
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            My Timesheets
          </h3>
          <p className="text-3xl font-bold text-blue-600">{timesheets.length}</p>
          <Link to="/timesheets" className="text-sm text-blue-600 hover:underline mt-2 inline-block">
            View all →
          </Link>
        </div>

        {user?.role === 'ROLE_MANAGER' || user?.role === 'ROLE_ADMIN' ? (
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Pending Approvals
            </h3>
            <p className="text-3xl font-bold text-yellow-600">-</p>
            <Link to="/approve-timesheets" className="text-sm text-blue-600 hover:underline mt-2 inline-block">
              Review →
            </Link>
          </div>
        ) : null}

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Quick Action
          </h3>
          <Link to="/timesheets/new" className="btn-primary mt-2">
            New Timesheet
          </Link>
        </div>
      </div>

      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Recent Timesheets
        </h2>
        {loading ? (
          <p className="text-gray-600">Loading...</p>
        ) : timesheets.length === 0 ? (
          <p className="text-gray-600">No timesheets yet. Create your first one!</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Week Starting</th>
                  <th>Status</th>
                  <th>Total Hours</th>
                  <th>Submitted</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {timesheets.map((timesheet) => (
                  <tr key={timesheet.id}>
                    <td>{timesheet.weekStartDate}</td>
                    <td>
                      <span className={`px-2 py-1 text-xs font-semibold rounded ${getStatusColor(timesheet.status)}`}>
                        {timesheet.status}
                      </span>
                    </td>
                    <td>{timesheet.totalHours}</td>
                    <td>{timesheet.submittedAt ? new Date(timesheet.submittedAt).toLocaleDateString() : '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

