import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Menu State
  const [formData, setFormData] = useState({ breakfast: '', lunch: '', dinner: '' });
  const [status, setStatus] = useState('');
  const [stats, setStats] = useState(null);

  // Poll State
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOptions, setPollOptions] = useState(['', '']);
  const [pollStatus, setPollStatus] = useState('');

  // Canteen Orders State
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== 'admin') return;

    const fetchStatsAndOrders = async () => {
      try {
        const statsRes = await axios.get('https://mess-mate-2wvq.vercel.app/api/admin/stats', { withCredentials: true });
        setStats(statsRes.data);
        
        const ordersRes = await axios.get('https://mess-mate-2wvq.vercel.app/api/canteen/orders/all', { withCredentials: true });
        setOrders(ordersRes.data);
      } catch (err) {
        console.error("Could not fetch data", err);
      } finally {
        setOrdersLoading(false);
      }
    };
    fetchStatsAndOrders();
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

  // Menu Handlers
  const handleMenuChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleMenuSubmit = async (e) => {
    e.preventDefault();
    setStatus('Uploading...');
    const payload = {
      breakfast: formData.breakfast.split(',').map(i => i.trim()).filter(i => i),
      lunch: formData.lunch.split(',').map(i => i.trim()).filter(i => i),
      dinner: formData.dinner.split(',').map(i => i.trim()).filter(i => i)
    };
    try {
      await axios.post('https://mess-mate-2wvq.vercel.app/api/admin/menu', payload, { withCredentials: true });
      setStatus('Success! Menu uploaded for tomorrow.');
      setFormData({ breakfast: '', lunch: '', dinner: '' }); 
    } catch (err) {
      setStatus(err.response?.data?.message || 'Error uploading menu.');
    }
  };

  // Poll Handlers
  const handlePollOptionChange = (index, value) => {
    const newOptions = [...pollOptions];
    newOptions[index] = value;
    setPollOptions(newOptions);
  };
  const addPollOption = () => setPollOptions([...pollOptions, '']);
  const handlePollSubmit = async (e) => {
    e.preventDefault();
    setPollStatus('Publishing...');
    try {
      await axios.post('https://mess-mate-2wvq.vercel.app/api/polls/create', {
        question: pollQuestion,
        options: pollOptions.filter(o => o.trim() !== '')
      }, { withCredentials: true });
      setPollStatus('Success! Poll is live on student dashboards.');
      setPollQuestion('');
      setPollOptions(['', '']);
    } catch (err) {
      setPollStatus(err.response?.data?.message || 'Error creating poll.');
    }
  };

  // Canteen Order Handlers
  const handleOrderStatusUpdate = async (orderId, newStatus) => {
    try {
      await axios.put(`https://mess-mate-2wvq.vercel.app/api/canteen/orders/${orderId}/status`, { status: newStatus }, { withCredentials: true });
      setOrders(orders.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
    } catch (err) {
      alert('Error updating order status');
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
      
      {/* Top Row: Analytics & Menu Upload */}
      <div className="grid xl:grid-cols-2 gap-8">
        
        {/* Left: Analytics */}
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

        {/* Right: Menu Upload */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h3 className="text-2xl font-extrabold text-gray-900 mb-6">Upload Menu</h3>
          {status && <div className={`mb-6 p-4 rounded-xl font-medium border ${status.includes('Error') ? 'bg-red-50 text-red-700 border-red-100' : 'bg-green-50 text-green-800 border-green-100'}`}>{status}</div>}

          <form onSubmit={handleMenuSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Breakfast</label>
              <textarea name="breakfast" value={formData.breakfast} onChange={handleMenuChange} placeholder="e.g. Poha, Tea, Banana" className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50" rows="1" required />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Lunch</label>
              <textarea name="lunch" value={formData.lunch} onChange={handleMenuChange} placeholder="e.g. Dal, Rice, Roti, Salad" className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50" rows="1" required />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Dinner</label>
              <textarea name="dinner" value={formData.dinner} onChange={handleMenuChange} placeholder="e.g. Paneer Masala, Roti" className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50" rows="1" required />
            </div>
            <button type="submit" className="w-full bg-gray-900 text-white font-bold py-3 rounded-xl shadow-md hover:bg-black transition-colors">Publish Menu</button>
          </form>
        </div>
      </div>

      {/* Bottom Row: Polls & Canteen Orders */}
      <div className="grid xl:grid-cols-3 gap-8">
        
        {/* Create Poll */}
        <div className="xl:col-span-1 bg-gradient-to-br from-purple-600 to-indigo-700 rounded-2xl shadow-sm border border-gray-100 p-8 text-white">
          <h3 className="text-2xl font-extrabold mb-6">Create Poll</h3>
          {pollStatus && <div className="mb-4 p-3 rounded-lg font-medium bg-white/20 border border-white/30 text-sm">{pollStatus}</div>}
          
          <form onSubmit={handlePollSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-purple-100 mb-2">Poll Question</label>
              <input type="text" value={pollQuestion} onChange={(e) => setPollQuestion(e.target.value)} required className="w-full border-0 rounded-xl p-3 bg-white/10 text-white placeholder-purple-300 focus:ring-2 focus:ring-white outline-none" placeholder="e.g. Sunday Special Dessert?" />
            </div>
            <div>
              <label className="block text-sm font-bold text-purple-100 mb-2">Options</label>
              {pollOptions.map((opt, idx) => (
                <input key={idx} type="text" value={opt} onChange={(e) => handlePollOptionChange(idx, e.target.value)} required className="w-full border-0 rounded-xl p-3 bg-white/10 text-white placeholder-purple-300 focus:ring-2 focus:ring-white outline-none mb-2" placeholder={`Option ${idx + 1}`} />
              ))}
              <button type="button" onClick={addPollOption} className="text-sm font-bold text-purple-200 hover:text-white transition">+ Add another option</button>
            </div>
            <button type="submit" className="w-full bg-white text-purple-700 font-bold py-3 rounded-xl shadow-md hover:bg-gray-50 transition-colors mt-4">Publish Poll</button>
          </form>
        </div>

        {/* Canteen Orders */}
        <div className="xl:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-8 overflow-hidden flex flex-col">
          <h3 className="text-2xl font-extrabold text-gray-900 mb-6">Canteen Orders</h3>
          
          {ordersLoading ? (
            <p className="text-gray-500">Loading orders...</p>
          ) : orders.length === 0 ? (
            <p className="text-gray-500 py-8 text-center italic border-2 border-dashed border-gray-200 rounded-xl">No active canteen orders.</p>
          ) : (
            <div className="overflow-x-auto flex-1">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b-2 border-gray-100">
                    <th className="pb-3 font-bold text-gray-600">Student</th>
                    <th className="pb-3 font-bold text-gray-600">Room</th>
                    <th className="pb-3 font-bold text-gray-600">Items</th>
                    <th className="pb-3 font-bold text-gray-600">Total</th>
                    <th className="pb-3 font-bold text-gray-600">Status</th>
                    <th className="pb-3 font-bold text-gray-600">Action</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {orders.map(order => (
                    <tr key={order._id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="py-4 font-medium text-gray-900">{order.studentId?.name || 'Unknown'}</td>
                      <td className="py-4 text-gray-600">{order.studentId?.hostel}-{order.studentId?.roomNumber}</td>
                      <td className="py-4 text-gray-600">
                        {order.items.map((item, i) => <div key={i}>{item.quantity}x {item.name}</div>)}
                      </td>
                      <td className="py-4 font-bold text-gray-900">₹{order.totalAmount}</td>
                      <td className="py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          order.status === 'delivered' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {order.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-4">
                        {order.status === 'pending' && (
                          <button onClick={() => handleOrderStatusUpdate(order._id, 'delivered')} className="text-xs bg-gray-900 text-white px-3 py-2 rounded-lg font-bold hover:bg-black transition">
                            Mark Delivered
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
