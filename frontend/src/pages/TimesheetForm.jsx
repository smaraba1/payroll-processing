import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { timesheetService } from '../services/timesheetService';
import { projectService } from '../services/projectService';

const TimesheetForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const [weekStartDate, setWeekStartDate] = useState('');
  const [timeEntries, setTimeEntries] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Days of the week (Monday to Sunday)
  const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  useEffect(() => {
    fetchProjects();
    if (id) {
      fetchTimesheet();
    } else {
      // Set default to current week's Sunday
      const today = new Date();
      const currentSunday = getSunday(formatDate(today));
      setWeekStartDate(currentSunday);
      initializeWeekEntries(currentSunday);
    }
  }, [id]);

  // Helper function to format date as YYYY-MM-DD
  const formatDate = (date) => {
    if (!date) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Helper function to get Sunday of a given date
  const getSunday = (dateString) => {
    if (!dateString) return '';
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const daysToSubtract = dayOfWeek;
    date.setDate(date.getDate() - daysToSubtract);
    return formatDate(date);
  };

  // Helper function to check if a date is Sunday
  const isSunday = (dateString) => {
    if (!dateString) return false;
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return date.getDay() === 0;
  };

  // Helper function to get date for a specific day of the week (0=Sunday, 1=Monday, etc.)
  const getDateForDay = (weekStart, dayIndex) => {
    if (!weekStart) return '';
    const [year, month, day] = weekStart.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    // weekStart is Sunday (day 0), so Monday is day+1, Tuesday is day+2, etc.
    // dayIndex: 0=Monday, 1=Tuesday, ..., 6=Sunday
    date.setDate(date.getDate() + (dayIndex === 6 ? 0 : dayIndex + 1));
    return formatDate(date);
  };

  // Initialize empty entries for the week
  const initializeWeekEntries = (sunday) => {
    const entries = [];
    DAYS_OF_WEEK.forEach((day, index) => {
      entries.push({
        dayOfWeek: day,
        dayIndex: index,
        date: getDateForDay(sunday, index),
        projectId: '',
        hours: '',
        taskType: 'BILLABLE',
        notes: '',
      });
    });
    setTimeEntries(entries);
  };

  const fetchProjects = async () => {
    try {
      if (!user?.id) {
        console.error('User ID is not available');
        return;
      }
      const data = await projectService.getActiveProjectsByUserId(user.id);
      setProjects(data || []);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
      setProjects([]);
    }
  };

  const fetchTimesheet = async () => {
    try {
      const data = await timesheetService.getTimesheetById(id);
      setWeekStartDate(data.weekStartDate);

      // Transform fetched entries into week-based structure
      const weekEntries = [];
      const sunday = data.weekStartDate;

      DAYS_OF_WEEK.forEach((day, dayIndex) => {
        const date = getDateForDay(sunday, dayIndex);
        // Find all entries for this day
        const dayEntries = (data.timeEntries || []).filter(entry => entry.entryDate === date);

        if (dayEntries.length > 0) {
          // Add each entry for this day
          dayEntries.forEach(entry => {
            weekEntries.push({
              dayOfWeek: day,
              dayIndex: dayIndex,
              date: date,
              id: entry.id,
              projectId: entry.projectId || '',
              hours: entry.hours.toString(),
              taskType: entry.taskType || 'BILLABLE',
              notes: entry.notes || '',
            });
          });
        } else {
          // Add empty entry for this day
          weekEntries.push({
            dayOfWeek: day,
            dayIndex: dayIndex,
            date: date,
            projectId: '',
            hours: '',
            taskType: 'BILLABLE',
            notes: '',
          });
        }
      });

      setTimeEntries(weekEntries);
    } catch (error) {
      console.error('Failed to fetch timesheet:', error);
    }
  };

  const handleWeekStartDateChange = (dateString) => {
    if (!dateString) {
      setWeekStartDate('');
      return;
    }

    // Ensure it's a Sunday
    const sunday = getSunday(dateString);
    setWeekStartDate(sunday);
    initializeWeekEntries(sunday);
  };

  const updateEntry = (index, field, value) => {
    const updated = [...timeEntries];
    updated[index] = { ...updated[index], [field]: value };

    // Clear project if switching to PTO or SICK_LEAVE
    if (field === 'taskType' && (value === 'PTO' || value === 'SICK_LEAVE')) {
      updated[index].projectId = '';
    }

    setTimeEntries(updated);
  };

  // Add a new entry for a specific day
  const addEntryForDay = (dayIndex) => {
    const day = DAYS_OF_WEEK[dayIndex];
    const date = getDateForDay(weekStartDate, dayIndex);

    const newEntry = {
      dayOfWeek: day,
      dayIndex: dayIndex,
      date: date,
      projectId: '',
      hours: '',
      taskType: 'BILLABLE',
      notes: '',
    };

    // Find the last entry for this day and insert after it
    let insertIndex = timeEntries.length;
    for (let i = timeEntries.length - 1; i >= 0; i--) {
      if (timeEntries[i].dayIndex === dayIndex) {
        insertIndex = i + 1;
        break;
      }
    }

    const updated = [...timeEntries];
    updated.splice(insertIndex, 0, newEntry);
    setTimeEntries(updated);
  };

  // Remove an entry
  const removeEntry = (index) => {
    // Don't allow removing if it's the only entry for that day
    const entry = timeEntries[index];
    const dayEntries = timeEntries.filter(e => e.dayIndex === entry.dayIndex);
    if (dayEntries.length === 1 && !entry.id) {
      // It's the only entry and it's new, just clear it
      const updated = [...timeEntries];
      updated[index] = {
        ...updated[index],
        projectId: '',
        hours: '',
        taskType: 'BILLABLE',
        notes: '',
      };
      setTimeEntries(updated);
    } else {
      // Remove the entry
      setTimeEntries(timeEntries.filter((_, i) => i !== index));
    }
  };

  // Get all entries for a specific day
  const getEntriesForDay = (dayIndex) => {
    return timeEntries.filter(entry => entry.dayIndex === dayIndex);
  };

  const validateTimesheet = () => {
    const newErrors = {};

    if (!weekStartDate || !isSunday(weekStartDate)) {
      newErrors.weekStartDate = 'Week start date must be a Sunday';
      return newErrors;
    }

    timeEntries.forEach((entry, index) => {
      // Only validate entries that have hours
      if (!entry.hours || parseFloat(entry.hours) <= 0) {
        return; // Skip empty entries
      }

      // Validate project for billable entries
      if (entry.taskType === 'BILLABLE' && !entry.projectId) {
        newErrors[`entry-${index}-project`] = 'Project is required for billable entries';
      }
    });

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateTimesheet();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      alert('Please fix the validation errors before submitting.');
      return;
    }

    // Filter out empty entries and prepare for submission
    const validEntries = timeEntries
      .filter(entry => entry.hours && parseFloat(entry.hours) > 0)
      .map(entry => ({
        id: entry.id,
        projectId: entry.projectId && entry.projectId !== '' ? parseInt(entry.projectId) : null,
        entryDate: entry.date,
        hours: parseFloat(entry.hours),
        taskType: entry.taskType,
        notes: entry.notes || '',
      }));

    if (validEntries.length === 0) {
      alert('Please add at least one time entry.');
      return;
    }

    setLoading(true);

    try {
      await timesheetService.createOrUpdateTimesheet(user.id, {
        weekStartDate,
        timeEntries: validEntries,
      });
      navigate('/timesheets');
    } catch (error) {
      alert('Failed to save timesheet: ' + (error.response?.data?.detail || error.message));
    } finally {
      setLoading(false);
    }
  };

  // Calculate total hours for the week
  const getTotalHours = () => {
    return timeEntries.reduce((total, entry) => {
      const hours = parseFloat(entry.hours) || 0;
      return total + hours;
    }, 0);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">
          {id ? 'Edit Timesheet' : 'New Timesheet'}
        </h1>
        {weekStartDate && (
          <div className="text-sm text-gray-600">
            Total Hours: <span className="font-semibold">{getTotalHours().toFixed(2)}</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="card">
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Week Starting Date (Sunday) *
          </label>
          <input
            type="date"
            className={`input ${errors.weekStartDate ? 'border-red-500' : ''}`}
            value={weekStartDate}
            onChange={(e) => handleWeekStartDateChange(e.target.value)}
            required
          />
          {errors.weekStartDate && (
            <p className="text-red-500 text-sm mt-1">{errors.weekStartDate}</p>
          )}
          {weekStartDate && (
            <p className="text-sm text-gray-600 mt-1">
              Week: {weekStartDate} to {getDateForDay(weekStartDate, 5)} (Monday - Sunday)
            </p>
          )}
        </div>

        {projects.length === 0 && (
          <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-yellow-800 font-semibold mb-2">No Projects Available</p>
            <p className="text-yellow-700 text-sm">
              {user?.role === 'ROLE_ADMIN'
                ? 'Create projects in the Projects section, or assign yourself to existing projects.'
                : 'Contact an administrator to assign you to a project.'}
            </p>
          </div>
        )}

        {weekStartDate && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 border border-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-300">
                    Day
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-300">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-300">
                    Project
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-300">
                    Hours
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-300">
                    Task Type
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Notes
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {DAYS_OF_WEEK.map((day, dayIndex) => {
                  const dayEntries = getEntriesForDay(dayIndex);
                  // Find indices in timeEntries array for this day
                  const dayEntryIndices = timeEntries
                    .map((entry, idx) => entry.dayIndex === dayIndex ? idx : -1)
                    .filter(idx => idx !== -1);

                  return (
                    <React.Fragment key={dayIndex}>
                      {dayEntries.length === 0 ? (
                        <tr>
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 border-r border-gray-300">
                            {day}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 border-r border-gray-300">
                            {getDateForDay(weekStartDate, dayIndex)}
                          </td>
                          <td colSpan="5" className="px-4 py-3 text-sm text-gray-500 text-center">
                            <button
                              type="button"
                              onClick={() => addEntryForDay(dayIndex)}
                              className="text-blue-600 hover:text-blue-800 underline"
                            >
                              Add entry for {day}
                            </button>
                          </td>
                        </tr>
                      ) : (
                        dayEntries.map((entry, entryIndex) => {
                          const actualIndex = dayEntryIndices[entryIndex];
                          return (
                            <tr key={`${dayIndex}-${entryIndex}`} className={entryIndex === 0 ? 'bg-blue-50' : ''}>
                              {entryIndex === 0 && (
                                <>
                                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 border-r border-gray-300" rowSpan={dayEntries.length}>
                                    {day}
                                  </td>
                                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 border-r border-gray-300" rowSpan={dayEntries.length}>
                                    {entry.date}
                                  </td>
                                </>
                              )}
                              <td className="px-4 py-2 border-r border-gray-300">
                                {entry.taskType === 'BILLABLE' && projects.length === 0 ? (
                                  <div className="text-xs text-yellow-600">No projects available</div>
                                ) : (
                                  <select
                                    className={`w-full px-2 py-1 text-sm border rounded ${
                                      errors[`entry-${actualIndex}-project`] ? 'border-red-500' : 'border-gray-300'
                                    } ${entry.taskType === 'PTO' || entry.taskType === 'SICK_LEAVE' ? 'bg-gray-100' : ''}`}
                                    value={entry.projectId || ''}
                                    onChange={(e) => updateEntry(actualIndex, 'projectId', e.target.value)}
                                    disabled={entry.taskType === 'PTO' || entry.taskType === 'SICK_LEAVE'}
                                  >
                                    <option value="">Select Project</option>
                                    {projects.map((project) => (
                                      <option key={project.id} value={project.id}>
                                        {project.clientName} - {project.name}
                                      </option>
                                    ))}
                                  </select>
                                )}
                                {errors[`entry-${actualIndex}-project`] && (
                                  <p className="text-red-500 text-xs mt-1">{errors[`entry-${actualIndex}-project`]}</p>
                                )}
                              </td>
                              <td className="px-4 py-2 border-r border-gray-300">
                                <input
                                  type="number"
                                  step="0.25"
                                  min="0"
                                  max="24"
                                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                                  value={entry.hours}
                                  onChange={(e) => updateEntry(actualIndex, 'hours', e.target.value)}
                                  placeholder="0.00"
                                />
                              </td>
                              <td className="px-4 py-2 border-r border-gray-300">
                                <select
                                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                                  value={entry.taskType}
                                  onChange={(e) => updateEntry(actualIndex, 'taskType', e.target.value)}
                                >
                                  <option value="BILLABLE">Billable</option>
                                  <option value="NON_BILLABLE">Non-Billable</option>
                                  <option value="PTO">PTO</option>
                                  <option value="SICK_LEAVE">Sick Leave</option>
                                </select>
                              </td>
                              <td className="px-4 py-2 border-r border-gray-300">
                                <input
                                  type="text"
                                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                                  value={entry.notes}
                                  onChange={(e) => updateEntry(actualIndex, 'notes', e.target.value)}
                                  placeholder="Notes..."
                                />
                              </td>
                              <td className="px-4 py-2 text-center">
                                <div className="flex justify-center space-x-1">
                                  {entryIndex === dayEntries.length - 1 && (
                                    <button
                                      type="button"
                                      onClick={() => addEntryForDay(dayIndex)}
                                      className="text-blue-600 hover:text-blue-800 text-xs px-2 py-1"
                                      title="Add another entry for this day"
                                    >
                                      +
                                    </button>
                                  )}
                                  {dayEntries.length > 1 && (
                                    <button
                                      type="button"
                                      onClick={() => removeEntry(actualIndex)}
                                      className="text-red-600 hover:text-red-800 text-xs px-2 py-1"
                                      title="Remove this entry"
                                    >
                                      ×
                                    </button>
                                  )}
                                  {dayEntries.length === 1 && entry.hours && (
                                    <button
                                      type="button"
                                      onClick={() => removeEntry(actualIndex)}
                                      className="text-red-600 hover:text-red-800 text-xs px-2 py-1"
                                      title="Clear entry"
                                    >
                                      Clear
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-6 flex space-x-4">
          <button
            type="submit"
            disabled={loading || !weekStartDate}
            className="btn-primary"
          >
            {loading ? 'Saving...' : 'Save Timesheet'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/timesheets')}
            className="btn-secondary"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default TimesheetForm;
