import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { timesheetService } from '../services/timesheetService';

const Timesheets = () => {
  const user = useAuthStore((state) => state.user);
  const [timesheets, setTimesheets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTimesheets();
  }, [user?.id]);

  const fetchTimesheets = async () => {
    if (user?.id) {
      try {
        const response = await timesheetService.getTimesheetsByUserId(user.id);
        setTimesheets(response.content || []);
      } catch (error) {
        console.error('Failed to fetch timesheets:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSubmit = async (id) => {
    try {
      await timesheetService.submitTimesheet(id);
      fetchTimesheets();
    } catch (error) {
      alert('Failed to submit timesheet: ' + (error.response?.data?.detail || error.message));
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this timesheet?')) {
      try {
        await timesheetService.deleteTimesheet(id);
        fetchTimesheets();
      } catch (error) {
        alert('Failed to delete timesheet: ' + (error.response?.data?.detail || error.message));
      }
    }
  };

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
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">My Timesheets</h1>
        <Link to="/timesheets/new" className="btn-primary">
          New Timesheet
        </Link>
      </div>

      <div className="card">
        {loading ? (
          <p className="text-gray-600">Loading...</p>
        ) : timesheets.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">You haven't created any timesheets yet.</p>
            <Link to="/timesheets/new" className="btn-primary">
              Create Your First Timesheet
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Week Starting</th>
                  <th>Status</th>
                  <th>Total Hours</th>
                  <th>Submitted</th>
                  <th>Actions</th>
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
                    <td>
                      <div className="flex space-x-2">
                        {timesheet.status === 'DRAFT' || timesheet.status === 'REJECTED' ? (
                          <>
                            <Link
                              to={`/timesheets/${timesheet.id}/edit`}
                              className="text-blue-600 hover:underline text-sm"
                            >
                              Edit
                            </Link>
                            <button
                              onClick={() => handleSubmit(timesheet.id)}
                              className="text-green-600 hover:underline text-sm"
                            >
                              Submit
                            </button>
                            <button
                              onClick={() => handleDelete(timesheet.id)}
                              className="text-red-600 hover:underline text-sm"
                            >
                              Delete
                            </button>
                          </>
                        ) : (
                          <span className="text-gray-400 text-sm">View Only</span>
                        )}
                      </div>
                    </td>
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

export default Timesheets;

