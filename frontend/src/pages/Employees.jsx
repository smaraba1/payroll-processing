import { useEffect, useState } from 'react';
import { userService } from '../services/userService';

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    role: 'ROLE_EMPLOYEE',
    managerId: '',
    department: '',
    jobTitle: '',
    hireDate: '',
    isActive: true,
  });

  useEffect(() => {
    fetchEmployees();
    fetchManagers();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await userService.getAllUsers();
      setEmployees(response.content || []);
    } catch (error) {
      console.error('Failed to fetch employees:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchManagers = async () => {
    try {
      const response = await userService.getAllUsers();
      // Filter to get managers and admins (who can be managers)
      const managerList = (response.content || []).filter(
        user => user.role === 'ROLE_MANAGER' || user.role === 'ROLE_ADMIN'
      );
      setManagers(managerList);
    } catch (error) {
      console.error('Failed to fetch managers:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        managerId: formData.managerId ? parseInt(formData.managerId) : null,
      };
      if (editingEmployee) {
        await userService.updateUser(editingEmployee.id, data);
      } else {
        await userService.createUser(data);
      }
      fetchEmployees();
      fetchManagers(); // Refresh managers list
      resetForm();
    } catch (error) {
      alert('Failed to save employee: ' + (error.response?.data?.detail || error.message));
    }
  };

  const handleEdit = (employee) => {
    setEditingEmployee(employee);
    setFormData({
      email: employee.email,
      password: '',
      firstName: employee.firstName,
      lastName: employee.lastName,
      role: employee.role,
      managerId: employee.managerId || '',
      department: employee.department || '',
      jobTitle: employee.jobTitle || '',
      hireDate: employee.hireDate || '',
      isActive: employee.isActive,
    });
    setShowForm(true);
  };

  const handleDeactivate = async (id) => {
    if (window.confirm('Are you sure you want to deactivate this employee?')) {
      try {
        await userService.deactivateUser(id);
        fetchEmployees();
      } catch (error) {
        alert('Failed to deactivate employee: ' + (error.response?.data?.detail || error.message));
      }
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingEmployee(null);
    setFormData({
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      role: 'ROLE_EMPLOYEE',
      managerId: '',
      department: '',
      jobTitle: '',
      hireDate: '',
      isActive: true,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Employees</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          {showForm ? 'Cancel' : 'Add Employee'}
        </button>
      </div>

      {showForm && (
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">
            {editingEmployee ? 'Edit Employee' : 'New Employee'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name *
                </label>
                <input
                  type="text"
                  className="input"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name *
                </label>
                <input
                  type="text"
                  className="input"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  className="input"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password {!editingEmployee && '*'}
                </label>
                <input
                  type="password"
                  className="input"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required={!editingEmployee}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role *
                </label>
                <select
                  className="input"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  required
                >
                  <option value="ROLE_EMPLOYEE">Employee</option>
                  <option value="ROLE_MANAGER">Manager</option>
                  <option value="ROLE_ADMIN">Admin</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Manager {formData.role === 'ROLE_EMPLOYEE' && <span className="text-red-500">*</span>}
                </label>
                <select
                  className="input"
                  value={formData.managerId}
                  onChange={(e) => setFormData({ ...formData, managerId: e.target.value })}
                  required={formData.role === 'ROLE_EMPLOYEE'}
                  disabled={formData.role === 'ROLE_ADMIN'}
                >
                  <option value="">Select Manager</option>
                  {managers.map((manager) => (
                    <option key={manager.id} value={manager.id}>
                      {manager.fullName} ({manager.role.replace('ROLE_', '')})
                    </option>
                  ))}
                </select>
                {formData.role === 'ROLE_EMPLOYEE' && !formData.managerId && (
                  <p className="text-red-500 text-xs mt-1">Manager is required for employees</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Department
                </label>
                <input
                  type="text"
                  className="input"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Job Title
                </label>
                <input
                  type="text"
                  className="input"
                  value={formData.jobTitle}
                  onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hire Date
                </label>
                <input
                  type="date"
                  className="input"
                  value={formData.hireDate}
                  onChange={(e) => setFormData({ ...formData, hireDate: e.target.value })}
                />
              </div>
            </div>
            <div className="flex space-x-4">
              <button type="submit" className="btn-primary">
                {editingEmployee ? 'Update' : 'Create'}
              </button>
              <button type="button" onClick={resetForm} className="btn-secondary">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="card">
        {loading ? (
          <p className="text-gray-600">Loading...</p>
        ) : employees.length === 0 ? (
          <p className="text-gray-600">No employees found. Add your first employee!</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Manager</th>
                  <th>Department</th>
                  <th>Job Title</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {employees.map((employee) => (
                  <tr key={employee.id}>
                    <td className="font-medium">{employee.fullName}</td>
                    <td>{employee.email}</td>
                    <td>
                      <span className="text-sm">
                        {employee.role.replace('ROLE_', '')}
                      </span>
                    </td>
                    <td>{employee.managerName || '-'}</td>
                    <td>{employee.department || '-'}</td>
                    <td>{employee.jobTitle || '-'}</td>
                    <td>
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded ${
                          employee.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {employee.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(employee)}
                          className="text-blue-600 hover:underline text-sm"
                        >
                          Edit
                        </button>
                        {employee.isActive && (
                          <button
                            onClick={() => handleDeactivate(employee.id)}
                            className="text-red-600 hover:underline text-sm"
                          >
                            Deactivate
                          </button>
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

export default Employees;

