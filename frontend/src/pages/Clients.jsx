import { useEffect, useState } from 'react';
import { clientService } from '../services/clientService';

const Clients = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    contactPerson: '',
    contactEmail: '',
    address: '',
  });

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const response = await clientService.getAllClients();
      setClients(response.content || []);
    } catch (error) {
      console.error('Failed to fetch clients:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingClient) {
        await clientService.updateClient(editingClient.id, formData);
      } else {
        await clientService.createClient(formData);
      }
      fetchClients();
      resetForm();
    } catch (error) {
      alert('Failed to save client: ' + (error.response?.data?.detail || error.message));
    }
  };

  const handleEdit = (client) => {
    setEditingClient(client);
    setFormData({
      name: client.name,
      contactPerson: client.contactPerson || '',
      contactEmail: client.contactEmail || '',
      address: client.address || '',
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this client?')) {
      try {
        await clientService.deleteClient(id);
        fetchClients();
      } catch (error) {
        alert('Failed to delete client: ' + (error.response?.data?.detail || error.message));
      }
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingClient(null);
    setFormData({
      name: '',
      contactPerson: '',
      contactEmail: '',
      address: '',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Clients</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          {showForm ? 'Cancel' : 'Add Client'}
        </button>
      </div>

      {showForm && (
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">
            {editingClient ? 'Edit Client' : 'New Client'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Client Name *
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
                Contact Person
              </label>
              <input
                type="text"
                className="input"
                value={formData.contactPerson}
                onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contact Email
              </label>
              <input
                type="email"
                className="input"
                value={formData.contactEmail}
                onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <textarea
                className="input"
                rows="3"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>
            <div className="flex space-x-4">
              <button type="submit" className="btn-primary">
                {editingClient ? 'Update' : 'Create'}
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
        ) : clients.length === 0 ? (
          <p className="text-gray-600">No clients found. Add your first client!</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Contact Person</th>
                  <th>Email</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {clients.map((client) => (
                  <tr key={client.id}>
                    <td className="font-medium">{client.name}</td>
                    <td>{client.contactPerson || '-'}</td>
                    <td>{client.contactEmail || '-'}</td>
                    <td>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(client)}
                          className="text-blue-600 hover:underline text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(client.id)}
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

export default Clients;

