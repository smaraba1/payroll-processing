import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { timesheetService } from '../services/timesheetService';

const ApproveTimesheets = () => {
  const user = useAuthStore((state) => state.user);
  const [timesheets, setTimesheets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTimesheet, setSelectedTimesheet] = useState(null);
  const [comments, setComments] = useState('');

  useEffect(() => {
    fetchTimesheets();
  }, [user?.id]);

  const fetchTimesheets = async () => {
    if (user?.id) {
      try {
        const response = await timesheetService.getPendingTimesheetsForManager(user.id);
        setTimesheets(response.content || []);
      } catch (error) {
        console.error('Failed to fetch timesheets:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleApprove = async (id) => {
    try {
      await timesheetService.approveOrRejectTimesheet(id, true, '');
      fetchTimesheets();
      setSelectedTimesheet(null);
    } catch (error) {
      alert('Failed to approve timesheet: ' + (error.response?.data?.detail || error.message));
    }
  };

  const handleReject = async (id) => {
    if (!comments.trim()) {
      alert('Please provide rejection comments');
      return;
    }

    try {
      await timesheetService.approveOrRejectTimesheet(id, false, comments);
      fetchTimesheets();
      setSelectedTimesheet(null);
      setComments('');
    } catch (error) {
      alert('Failed to reject timesheet: ' + (error.response?.data?.detail || error.message));
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Approve Timesheets</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Pending Submissions
          </h2>
          {loading ? (
            <p className="text-gray-600">Loading...</p>
          ) : timesheets.length === 0 ? (
            <p className="text-gray-600">No pending timesheets</p>
          ) : (
            <div className="space-y-2">
              {timesheets.map((timesheet) => (
                <button
                  key={timesheet.id}
                  onClick={() => setSelectedTimesheet(timesheet)}
                  className={`w-full text-left p-4 rounded border ${
                    selectedTimesheet?.id === timesheet.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="font-semibold">{timesheet.userName}</div>
                  <div className="text-sm text-gray-600">
                    Week: {timesheet.weekStartDate} | Hours: {timesheet.totalHours}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Timesheet Details
          </h2>
          {selectedTimesheet ? (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Employee</p>
                <p className="font-semibold">{selectedTimesheet.userName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Week Starting</p>
                <p className="font-semibold">{selectedTimesheet.weekStartDate}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Hours</p>
                <p className="font-semibold">{selectedTimesheet.totalHours}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-2">Time Entries</p>
                <div className="space-y-2">
                  {selectedTimesheet.timeEntries?.map((entry, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded">
                      <div className="font-medium">{entry.projectName}</div>
                      <div className="text-sm text-gray-600">
                        {entry.entryDate} | {entry.hours} hours | {entry.taskType}
                      </div>
                      {entry.notes && (
                        <div className="text-sm text-gray-600 mt-1">
                          Notes: {entry.notes}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Comments (required for rejection)
                </label>
                <textarea
                  className="input"
                  rows="3"
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  placeholder="Add comments..."
                />
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={() => handleApprove(selectedTimesheet.id)}
                  className="btn-success"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleReject(selectedTimesheet.id)}
                  className="btn-danger"
                >
                  Reject
                </button>
              </div>
            </div>
          ) : (
            <p className="text-gray-600">Select a timesheet to review</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApproveTimesheets;

