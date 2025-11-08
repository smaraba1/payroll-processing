import { useEffect, useState } from 'react';
import { projectService } from '../services/projectService';
import { clientService } from '../services/clientService';
import { userService } from '../services/userService';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [clients, setClients] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    clientId: '',
    defaultBillableRate: '',
    status: 'ACTIVE',
    employeeIds: [],
  });

  useEffect(() => {
    fetchProjects();
    fetchClients();
    fetchEmployees();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await projectService.getAllProjects();
      setProjects(response.content || []);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchClients = async () => {
    try {
      const response = await clientService.getAllClients(0, 100);
      setClients(response.content || []);
    } catch (error) {
      console.error('Failed to fetch clients:', error);
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await userService.getAllUsers();
      // Filter to get only employees and managers (exclude admins)
      const employeeList = (response.content || []).filter(
        user => user.role === 'ROLE_EMPLOYEE' || user.role === 'ROLE_MANAGER'
      );
      setEmployees(employeeList);
    } catch (error) {
      console.error('Failed to fetch employees:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        clientId: parseInt(formData.clientId),
        defaultBillableRate: parseFloat(formData.defaultBillableRate),
        employeeIds: formData.employeeIds.map(id => parseInt(id)),
      };

      if (editingProject) {
        await projectService.updateProject(editingProject.id, data);
      } else {
        await projectService.createProject(data);
      }
      fetchProjects();
      resetForm();
    } catch (error) {
      alert('Failed to save project: ' + (error.response?.data?.detail || error.message));
    }
  };

  const handleEdit = async (project) => {
    setEditingProject(project);
    setFormData({
      name: project.name,
      clientId: project.clientId,
      defaultBillableRate: project.defaultBillableRate,
      status: project.status,
      employeeIds: [], // Will be loaded if we add an endpoint for it
    });
    setShowForm(true);
  };

  const handleEmployeeToggle = (employeeId) => {
    const employeeIdStr = employeeId.toString();
    setFormData(prev => {
      const currentIds = prev.employeeIds || [];
      if (currentIds.includes(employeeIdStr)) {
        return {
          ...prev,
          employeeIds: currentIds.filter(id => id !== employeeIdStr)
        };
      } else {
        return {
          ...prev,
          employeeIds: [...currentIds, employeeIdStr]
        };
      }
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await projectService.deleteProject(id);
        fetchProjects();
      } catch (error) {
        alert('Failed to delete project: ' + (error.response?.data?.detail || error.message));
      }
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingProject(null);
    setFormData({
      name: '',
      clientId: '',
      defaultBillableRate: '',
      status: 'ACTIVE',
      employeeIds: [],
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          {showForm ? 'Cancel' : 'Add Project'}
        </button>
      </div>

      {showForm && (
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">
            {editingProject ? 'Edit Project' : 'New Project'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Project Name *
              </label>
              <input
                type="text"
                className="input"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Client *
              </label>
              <select
                className="input"
                value={formData.clientId}
                onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                required
              >
                <option value="">Select Client</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Default Billable Rate *
              </label>
              <input
                type="number"
                step="0.01"
                className="input"
                value={formData.defaultBillableRate}
                onChange={(e) => setFormData({ ...formData, defaultBillableRate: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                className="input"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Assign Employees
              </label>
              <div className="border border-gray-300 rounded-lg p-4 max-h-60 overflow-y-auto">
                {employees.length === 0 ? (
                  <p className="text-gray-500 text-sm">No employees available</p>
                ) : (
                  <div className="space-y-2">
                    {employees.map((employee) => (
                      <label key={employee.id} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                        <input
                          type="checkbox"
                          checked={formData.employeeIds?.includes(employee.id.toString()) || false}
                          onChange={() => handleEmployeeToggle(employee.id)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">
                          {employee.fullName} ({employee.role.replace('ROLE_', '')})
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Select employees to assign to this project
              </p>
            </div>
            <div className="flex space-x-4">
              <button type="submit" className="btn-primary">
                {editingProject ? 'Update' : 'Create'}
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
        ) : projects.length === 0 ? (
          <p className="text-gray-600">No projects found. Add your first project!</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Client</th>
                  <th>Billable Rate</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {projects.map((project) => (
                  <tr key={project.id}>
                    <td className="font-medium">{project.name}</td>
                    <td>{project.clientName}</td>
                    <td>${project.defaultBillableRate}</td>
                    <td>
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded ${
                          project.status === 'ACTIVE'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {project.status}
                      </span>
                    </td>
                    <td>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(project)}
                          className="text-blue-600 hover:underline text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(project.id)}
                          className="text-red-600 hover:underline text-sm"
                        >
                          Delete
                        </button>
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

export default Projects;

