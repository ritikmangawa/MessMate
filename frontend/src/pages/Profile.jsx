import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Profile = () => {
  const { user } = useAuth();
  const [messName, setMessName] = useState('Loading...');

  useEffect(() => {
    if (user?.messId) {
      const fetchMess = async () => {
        try {
          const res = await axios.get('http://localhost:5000/api/messes');
          const myMess = res.data.find(m => m._id === user.messId);
          if (myMess) setMessName(`${myMess.name} (${myMess.location})`);
          else setMessName('Unknown Mess');
        } catch (err) {
          setMessName('Error fetching mess');
        }
      };
      fetchMess();
    }
  }, [user]);

  if (!user) return null;

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-8 py-10 text-white flex items-center gap-6">
          <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center text-4xl font-bold backdrop-blur-sm border-4 border-white/30">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-3xl font-extrabold">{user.name}</h2>
            <p className="text-blue-100 font-medium mt-1">{user.role === 'admin' ? 'Administrator' : 'Student'}</p>
          </div>
        </div>

        {/* Details */}
        <div className="p-8">
          <h3 className="text-lg font-bold text-gray-900 mb-6 border-b pb-2">Account Details</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Email Address</p>
              <p className="text-gray-900 font-medium">{user.email}</p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Hostel Block</p>
              <p className="text-gray-900 font-medium">{user.hostel || 'N/A'}</p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Room Number</p>
              <p className="text-gray-900 font-medium">{user.roomNumber || 'N/A'}</p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Assigned Mess</p>
              <p className="text-gray-900 font-medium">{messName}</p>
            </div>
            
            {user.role === 'student' && (
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 md:col-span-2">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Auto-Pilot Mode</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`w-3 h-3 rounded-full ${user.autoPilotMode === 'mode1' ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                  <p className="text-gray-900 font-medium">
                    {user.autoPilotMode === 'mode1' ? 'Enabled (Automatically registered at 10 PM)' : 'Disabled (Manual registration only)'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Profile;
