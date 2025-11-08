import { useEffect, useState } from 'react';
import { invoiceService } from '../services/invoiceService';
import { clientService } from '../services/clientService';

const Invoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showGenerateForm, setShowGenerateForm] = useState(false);
  const [formData, setFormData] = useState({
    clientId: '',
    startDate: '',
    endDate: '',
    dueDate: '',
  });

  useEffect(() => {
    fetchInvoices();
    fetchClients();
  }, []);

  const fetchInvoices = async () => {
    try {
      const response = await invoiceService.getAllInvoices();
      setInvoices(response.content || []);
    } catch (error) {
      console.error('Failed to fetch invoices:', error);
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

  const handleGenerateInvoice = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        clientId: parseInt(formData.clientId),
      };
      await invoiceService.generateInvoice(data);
      fetchInvoices();
      setShowGenerateForm(false);
      setFormData({
        clientId: '',
        startDate: '',
        endDate: '',
        dueDate: '',
      });
    } catch (error) {
      alert('Failed to generate invoice: ' + (error.response?.data?.detail || error.message));
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await invoiceService.updateInvoiceStatus(id, status);
      fetchInvoices();
    } catch (error) {
      alert('Failed to update status: ' + (error.response?.data?.detail || error.message));
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PAID':
        return 'bg-green-100 text-green-800';
      case 'SENT':
        return 'bg-blue-100 text-blue-800';
      case 'OVERDUE':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Invoices</h1>
        <button
          onClick={() => setShowGenerateForm(!showGenerateForm)}
          className="btn-primary"
        >
          {showGenerateForm ? 'Cancel' : 'Generate Invoice'}
        </button>
      </div>

      {showGenerateForm && (
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Generate New Invoice</h2>
          <form onSubmit={handleGenerateInvoice} className="space-y-4">
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date *
                </label>
                <input
                  type="date"
                  className="input"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date *
                </label>
                <input
                  type="date"
                  className="input"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Due Date *
                </label>
                <input
                  type="date"
                  className="input"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="flex space-x-4">
              <button type="submit" className="btn-primary">
                Generate
              </button>
              <button
                type="button"
                onClick={() => setShowGenerateForm(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="card">
        {loading ? (
          <p className="text-gray-600">Loading...</p>
        ) : invoices.length === 0 ? (
          <p className="text-gray-600">No invoices found. Generate your first invoice!</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Invoice #</th>
                  <th>Client</th>
                  <th>Issue Date</th>
                  <th>Due Date</th>
                  <th>Total Amount</th>
                  <th>Balance Due</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {invoices.map((invoice) => (
                  <tr key={invoice.id}>
                    <td className="font-medium">#{invoice.id}</td>
                    <td>{invoice.clientName}</td>
                    <td>{invoice.issueDate}</td>
                    <td>{invoice.dueDate}</td>
                    <td>${invoice.totalAmount}</td>
                    <td>${invoice.balanceDue}</td>
                    <td>
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded ${getStatusColor(
                          invoice.status
                        )}`}
                      >
                        {invoice.status}
                      </span>
                    </td>
                    <td>
                      <select
                        className="text-sm border border-gray-300 rounded px-2 py-1"
                        value={invoice.status}
                        onChange={(e) => handleStatusChange(invoice.id, e.target.value)}
                      >
                        <option value="DRAFT">Draft</option>
                        <option value="SENT">Sent</option>
                        <option value="PAID">Paid</option>
                        <option value="OVERDUE">Overdue</option>
                      </select>
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

export default Invoices;

