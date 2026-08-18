import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menu, setMenu] = useState(null);
  const [mealSelection, setMealSelection] = useState({
    breakfast: false,
    lunch: false,
    dinner: false
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    // Protect route: if no user is logged in, send them back to login page
    if (!user) {
      navigate('/login');
      return;
    }

    // Fetch tomorrow's menu from the backend
    const fetchMenu = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/meals/menu/tomorrow', {
          withCredentials: true
        });
        setMenu(response.data);
      } catch (err) {
        console.error(err);
        // Menu might not exist yet, so we leave it as null
        setMenu(null);
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, [user, navigate]);

  const handleCheckboxChange = (e) => {
    setMealSelection({
      ...mealSelection,
      [e.target.name]: e.target.checked
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    try {
      const response = await axios.post('http://localhost:5000/api/meals/register', mealSelection, {
        withCredentials: true
      });
      setSuccessMsg(response.data.message);
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving registration');
    }
  };

  const handleLogout = async () => {
    try {
      // Hit backend to clear the http-only cookie
      await axios.post('http://localhost:5000/api/auth/logout', {}, { withCredentials: true });
      logout(); // Clear React Context
      navigate('/login');
    } catch (err) {
      console.error(err);
    }
  };

  // Prevent UI flickering while redirecting
  if (!user) return null; 

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navbar */}
      <nav className="bg-white shadow-sm p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-600">MessMate</h1>
        <div className="flex items-center gap-6">
          <div className="bg-green-100 text-green-800 px-4 py-2 rounded-full font-bold">
            Wallet: ₹{user.walletBalance}
          </div>
          <button onClick={handleLogout} className="text-sm text-red-600 hover:underline font-semibold">
            Logout
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="max-w-4xl mx-auto p-6 mt-6">
        
        {/* Welcome Card */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8 border-l-4 border-blue-500">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome, {user.name}!</h2>
          <div className="flex gap-4 mt-4">
            <span className="text-sm bg-gray-100 px-3 py-1 rounded-md text-gray-700">
              Hostel: <span className="font-semibold">{user.hostel}</span>
            </span>
            <span className="text-sm bg-gray-100 px-3 py-1 rounded-md text-gray-700">
              Room: <span className="font-semibold">{user.roomNumber}</span>
            </span>
            <span className="text-sm bg-gray-100 px-3 py-1 rounded-md text-gray-700">
              Auto-Pilot: <span className="font-semibold">{user.autoPilotMode === 'mode1' ? 'Enabled' : 'Disabled'}</span>
            </span>
          </div>
        </div>

        {/* Meal Registration Card */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-1">Tomorrow's Menu</h3>
          <p className="text-gray-500 text-sm mb-6">Select the meals you plan to eat tomorrow.</p>
          
          {loading ? (
             <p className="text-gray-500 italic">Loading menu...</p>
          ) : !menu ? (
             <div className="text-center p-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <p className="text-gray-500 font-medium">The mess administration has not uploaded tomorrow's menu yet.</p>
             </div>
          ) : (
            <form onSubmit={handleRegister}>
              {error && <div className="mb-6 text-red-700 bg-red-100 p-3 rounded-lg border border-red-200">{error}</div>}
              {successMsg && <div className="mb-6 text-green-800 bg-green-100 p-3 rounded-lg border border-green-200">{successMsg}</div>}
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Breakfast Box */}
                <label className={`cursor-pointer border-2 rounded-xl p-4 transition-all ${mealSelection.breakfast ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-gray-50 hover:border-blue-300'}`}>
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-bold text-lg text-gray-800">Breakfast</h4>
                    <input type="checkbox" name="breakfast" className="w-5 h-5 text-blue-600 rounded" checked={mealSelection.breakfast} onChange={handleCheckboxChange} />
                  </div>
                  <ul className="text-gray-600 text-sm list-disc pl-4 space-y-1">
                    {menu.breakfast.map((item, idx) => <li key={idx}>{item}</li>)}
                    {menu.breakfast.length === 0 && <li>Not specified</li>}
                  </ul>
                </label>

                {/* Lunch Box */}
                <label className={`cursor-pointer border-2 rounded-xl p-4 transition-all ${mealSelection.lunch ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-gray-50 hover:border-blue-300'}`}>
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-bold text-lg text-gray-800">Lunch</h4>
                    <input type="checkbox" name="lunch" className="w-5 h-5 text-blue-600 rounded" checked={mealSelection.lunch} onChange={handleCheckboxChange} />
                  </div>
                  <ul className="text-gray-600 text-sm list-disc pl-4 space-y-1">
                    {menu.lunch.map((item, idx) => <li key={idx}>{item}</li>)}
                    {menu.lunch.length === 0 && <li>Not specified</li>}
                  </ul>
                </label>

                {/* Dinner Box */}
                <label className={`cursor-pointer border-2 rounded-xl p-4 transition-all ${mealSelection.dinner ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-gray-50 hover:border-blue-300'}`}>
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-bold text-lg text-gray-800">Dinner</h4>
                    <input type="checkbox" name="dinner" className="w-5 h-5 text-blue-600 rounded" checked={mealSelection.dinner} onChange={handleCheckboxChange} />
                  </div>
                  <ul className="text-gray-600 text-sm list-disc pl-4 space-y-1">
                    {menu.dinner.map((item, idx) => <li key={idx}>{item}</li>)}
                    {menu.dinner.length === 0 && <li>Not specified</li>}
                  </ul>
                </label>
              </div>

              <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl shadow-md hover:bg-blue-700 transition-colors">
                Save Meal Registration
              </button>
              <p className="text-center text-sm text-gray-500 mt-3 flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                Registrations automatically lock at 10:00 PM tonight.
              </p>
            </form>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
