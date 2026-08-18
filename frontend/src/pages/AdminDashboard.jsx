import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    breakfast: '',
    lunch: '',
    dinner: ''
  });
  const [status, setStatus] = useState('');
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (!user || user.role !== 'admin') return;

    const fetchStats = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/admin/stats', {
          withCredentials: true
        });
        setStats(response.data);
      } catch (err) {
        console.error("Could not fetch stats", err);
      }
    };
    fetchStats();
  }, [user]);

  if (!user || user.role !== 'admin') {
    return (
      <div className="flex flex-col items-center justify-center p-20 text-center">
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
      setFormData({ breakfast: '', lunch: '', dinner: '' }); 
    } catch (err) {
      console.error(err);
      setStatus(err.response?.data?.message || 'Error uploading menu.');
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
      
      <div className="grid lg:grid-cols-2 gap-8">
        
        {/* Left Column: Analytics */}
        <div>
          <h3 className="text-2xl font-extrabold text-gray-900 mb-6">Tomorrow's Headcount</h3>
          {stats ? (
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center items-center text-center">
                <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Total Students</p>
                <p className="text-5xl font-black text-blue-600">{stats.totalRegistered}</p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-l-4 border-l-yellow-400">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Breakfast</p>
                <p className="text-3xl font-bold text-gray-900">{stats.breakfastCount}</p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-l-4 border-l-orange-500">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Lunch</p>
                <p className="text-3xl font-bold text-gray-900">{stats.lunchCount}</p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-l-4 border-l-indigo-500">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Dinner</p>
                <p className="text-3xl font-bold text-gray-900">{stats.dinnerCount}</p>
              </div>
            </div>
          ) : (
            <div className="p-8 bg-white rounded-2xl shadow-sm border border-gray-100 flex justify-center items-center h-48">
               <p className="text-gray-500 font-medium">Loading statistics...</p>
            </div>
          )}
        </div>

        {/* Right Column: Menu Upload */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h3 className="text-2xl font-extrabold text-gray-900 mb-6">Upload Tomorrow's Menu</h3>
          {status && <div className={`mb-6 p-4 rounded-xl font-medium border ${status.includes('Error') ? 'bg-red-50 text-red-700 border-red-100' : 'bg-green-50 text-green-800 border-green-100'}`}>{status}</div>}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Breakfast</label>
              <textarea name="breakfast" value={formData.breakfast} onChange={handleChange} placeholder="e.g. Poha, Tea, Banana" className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50" rows="2" required />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Lunch</label>
              <textarea name="lunch" value={formData.lunch} onChange={handleChange} placeholder="e.g. Dal, Rice, Roti, Salad" className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50" rows="2" required />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Dinner</label>
              <textarea name="dinner" value={formData.dinner} onChange={handleChange} placeholder="e.g. Paneer Masala, Roti, Gulab Jamun" className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50" rows="2" required />
            </div>
            <button type="submit" className="w-full bg-gray-900 text-white font-bold py-4 rounded-xl shadow-md hover:bg-black transition-colors text-lg mt-2">
              Publish Menu to Students
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
