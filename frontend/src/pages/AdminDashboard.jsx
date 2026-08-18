import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    breakfast: '',
    lunch: '',
    dinner: ''
  });
  const [status, setStatus] = useState('');

  // Protection: only load if user is logged in AND is an admin
  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center">
        <h1 className="text-3xl font-bold text-red-600 mb-4">Access Denied</h1>
        <p className="text-gray-600">You must be an administrator to view this page.</p>
        <button onClick={() => navigate('/dashboard')} className="mt-6 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">Return to Dashboard</button>
      </div>
    );
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Uploading...');
    
    // Convert comma-separated strings into arrays for the backend
    const payload = {
      breakfast: formData.breakfast.split(',').map(i => i.trim()).filter(i => i),
      lunch: formData.lunch.split(',').map(i => i.trim()).filter(i => i),
      dinner: formData.dinner.split(',').map(i => i.trim()).filter(i => i)
    };

    try {
      await axios.post('http://localhost:5000/api/admin/menu', payload, {
        withCredentials: true
      });
      setStatus('Success! Menu uploaded for tomorrow.');
      setFormData({ breakfast: '', lunch: '', dinner: '' }); // Clear form
    } catch (err) {
      console.error(err);
      setStatus(err.response?.data?.message || 'Error uploading menu.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <h2 className="text-3xl font-bold text-gray-800">Mess Admin Panel</h2>
          <button onClick={() => { logout(); navigate('/login'); }} className="text-red-500 hover:underline font-semibold">Logout</button>
        </div>

        <h3 className="text-xl font-semibold mb-4 text-blue-600">Upload Tomorrow's Menu</h3>
        {status && <div className={`mb-6 p-3 rounded font-medium ${status.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-800'}`}>{status}</div>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Breakfast (comma separated)</label>
            <textarea name="breakfast" value={formData.breakfast} onChange={handleChange} placeholder="Poha, Tea, Banana" className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none" rows="2" required />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Lunch (comma separated)</label>
            <textarea name="lunch" value={formData.lunch} onChange={handleChange} placeholder="Dal, Rice, Roti, Salad" className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none" rows="2" required />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Dinner (comma separated)</label>
            <textarea name="dinner" value={formData.dinner} onChange={handleChange} placeholder="Paneer Masala, Roti, Gulab Jamun" className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none" rows="2" required />
          </div>
          <button type="submit" className="w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition shadow-md">
            Publish Menu to Students
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminDashboard;
