import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { QRCodeSVG } from 'qrcode.react';
import PollWidget from '../components/PollWidget';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [menu, setMenu] = useState(null);
  const [registration, setRegistration] = useState(null);
  const [mealSelection, setMealSelection] = useState({
    breakfast: false,
    lunch: false,
    dinner: false
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        const [menuRes, regRes] = await Promise.all([
          axios.get('http://localhost:5000/api/meals/menu/tomorrow', { withCredentials: true }),
          axios.get('http://localhost:5000/api/meals/registration/tomorrow', { withCredentials: true }).catch(() => ({ data: null }))
        ]);
        
        setMenu(menuRes.data);
        
        if (regRes.data) {
          setRegistration(regRes.data);
          setMealSelection({
            breakfast: regRes.data.meals.breakfast,
            lunch: regRes.data.meals.lunch,
            dinner: regRes.data.meals.dinner
          });
        }
      } catch (err) {
        console.error(err);
        setMenu(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, navigate]);

  const handleCheckboxChange = (e) => {
    setMealSelection({ ...mealSelection, [e.target.name]: e.target.checked });
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
      setRegistration(response.data.registration);
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving registration');
    }
  };

  if (!user) return null;

  const isLocked = registration && registration.status === 'registered';

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Left Column: Main Content (Welcome Banner + Menu) */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          
          {/* Welcome Banner */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 border-l-4 border-l-blue-500 flex flex-col justify-center relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Welcome, {user.name}!</h2>
              <p className="text-gray-500 mb-6">Manage your meals, wallet, and feedback seamlessly.</p>
              <div className="flex flex-wrap gap-3">
                <span className="text-sm bg-blue-50 px-4 py-2 rounded-lg text-blue-700 font-bold border border-blue-100">Hostel {user.hostel}</span>
                <span className="text-sm bg-blue-50 px-4 py-2 rounded-lg text-blue-700 font-bold border border-blue-100">Room {user.roomNumber}</span>
                <span className={`text-sm px-4 py-2 rounded-lg font-bold border ${user.autoPilotMode === 'mode1' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-gray-50 text-gray-600 border-gray-200'}`}>
                  Auto-Pilot: {user.autoPilotMode === 'mode1' ? 'ON' : 'OFF'}
                </span>
              </div>
            </div>
            {/* Decorative background element */}
            <div className="absolute right-0 top-0 h-full w-48 bg-gradient-to-l from-blue-50 to-transparent opacity-50"></div>
          </div>

          {/* Tomorrow's Menu */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Tomorrow's Menu</h3>
                <p className="text-gray-500 text-sm mt-1">Select the meals you plan to eat tomorrow.</p>
              </div>
              {registration && (
                <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide ${isLocked ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {registration.status}
                </span>
              )}
            </div>
            
            {loading ? (
               <div className="h-32 flex items-center justify-center"><p className="text-gray-500 font-medium animate-pulse">Loading menu...</p></div>
            ) : !menu ? (
               <div className="text-center p-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                  <p className="text-gray-500 font-medium text-lg">The mess administration has not uploaded tomorrow's menu yet.</p>
               </div>
            ) : (
              <form onSubmit={handleRegister}>
                {error && <div className="mb-6 text-red-700 bg-red-50 p-4 rounded-xl border border-red-100">{error}</div>}
                {successMsg && <div className="mb-6 text-green-800 bg-green-50 p-4 rounded-xl border border-green-100">{successMsg}</div>}
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <label className={`relative border-2 rounded-2xl p-6 transition-all ${isLocked ? 'cursor-not-allowed opacity-75' : 'cursor-pointer hover:border-blue-200'} ${mealSelection.breakfast ? 'border-blue-500 bg-blue-50/50 shadow-sm' : 'border-gray-100'}`}>
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-extrabold text-xl text-gray-900">Breakfast</h4>
                      <input type="checkbox" name="breakfast" disabled={isLocked} className="w-5 h-5 text-blue-600 rounded disabled:opacity-50" checked={mealSelection.breakfast} onChange={handleCheckboxChange} />
                    </div>
                    <ul className="text-gray-600 space-y-2">
                      {menu.breakfast.map((item, idx) => <li key={idx} className="flex items-center gap-2 text-sm"><div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>{item}</li>)}
                      {menu.breakfast.length === 0 && <li className="text-gray-400 italic text-sm">Not specified</li>}
                    </ul>
                  </label>

                  <label className={`relative border-2 rounded-2xl p-6 transition-all ${isLocked ? 'cursor-not-allowed opacity-75' : 'cursor-pointer hover:border-blue-200'} ${mealSelection.lunch ? 'border-blue-500 bg-blue-50/50 shadow-sm' : 'border-gray-100'}`}>
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-extrabold text-xl text-gray-900">Lunch</h4>
                      <input type="checkbox" name="lunch" disabled={isLocked} className="w-5 h-5 text-blue-600 rounded disabled:opacity-50" checked={mealSelection.lunch} onChange={handleCheckboxChange} />
                    </div>
                    <ul className="text-gray-600 space-y-2">
                      {menu.lunch.map((item, idx) => <li key={idx} className="flex items-center gap-2 text-sm"><div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>{item}</li>)}
                      {menu.lunch.length === 0 && <li className="text-gray-400 italic text-sm">Not specified</li>}
                    </ul>
                  </label>

                  <label className={`relative border-2 rounded-2xl p-6 transition-all ${isLocked ? 'cursor-not-allowed opacity-75' : 'cursor-pointer hover:border-blue-200'} ${mealSelection.dinner ? 'border-blue-500 bg-blue-50/50 shadow-sm' : 'border-gray-100'}`}>
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-extrabold text-xl text-gray-900">Dinner</h4>
                      <input type="checkbox" name="dinner" disabled={isLocked} className="w-5 h-5 text-blue-600 rounded disabled:opacity-50" checked={mealSelection.dinner} onChange={handleCheckboxChange} />
                    </div>
                    <ul className="text-gray-600 space-y-2">
                      {menu.dinner.map((item, idx) => <li key={idx} className="flex items-center gap-2 text-sm"><div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>{item}</li>)}
                      {menu.dinner.length === 0 && <li className="text-gray-400 italic text-sm">Not specified</li>}
                    </ul>
                  </label>
                </div>

                <button 
                  type="submit" 
                  disabled={isLocked}
                  className={`w-full font-bold py-4 rounded-xl shadow-md transition-colors text-lg ${isLocked ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-gray-900 text-white hover:bg-black'}`}
                >
                  {isLocked ? 'Preferences Locked' : 'Save Preferences'}
                </button>
                <p className="text-center text-sm text-gray-500 mt-4 flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  {isLocked ? 'You have successfully submitted your choices.' : 'Registrations lock at 10:00 PM tonight.'}
                </p>
              </form>
            )}
          </div>

        </div>

        {/* Right Column: Sidebar (QR Pass + Poll) */}
        <div className="lg:col-span-1 flex flex-col gap-8">
          
          {/* Tomorrow's Pass */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col items-center justify-center text-center relative overflow-hidden">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-6">Tomorrow's Pass</h3>
            {isLocked ? (
              <div className="p-4 bg-white border-2 border-blue-100 rounded-2xl shadow-sm">
                <QRCodeSVG value={registration.qrCodeData} size={140} level="M" />
              </div>
            ) : (
               <div className="w-36 h-36 bg-gray-50 rounded-2xl flex items-center justify-center border-2 border-dashed border-gray-200">
                 <span className="text-xs text-gray-400 font-bold px-4">Pass Locked<br/>(Save Preferences First)</span>
               </div>
            )}
            <p className="text-xs text-gray-500 mt-5 font-medium bg-gray-50 px-4 py-1.5 rounded-full">Scan at mess entrance</p>
          </div>

          {/* Active Poll */}
          <div>
            <PollWidget />
          </div>

        </div>

      </div>
    </div>
  );
};

export default Dashboard;
