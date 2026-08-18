import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center max-w-3xl">
        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight leading-tight mb-6">
          The Smartest Way to Manage Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Hostel Mess</span>
        </h1>
        <p className="text-xl text-gray-600 mb-10 leading-relaxed">
          Say goodbye to food waste and rigid schedules. MessMate gives you the freedom to register for daily meals, manage your digital wallet, and vote on special menus directly from your phone.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          {user ? (
            <Link to={user.role === 'admin' ? '/admin' : '/dashboard'} className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg transition transform hover:-translate-y-1 text-lg">
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link to="/register" className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg transition transform hover:-translate-y-1 text-lg">
                Join as Student
              </Link>
              <Link to="/login" className="w-full sm:w-auto px-8 py-4 bg-white border-2 border-gray-200 hover:border-gray-300 text-gray-800 font-bold rounded-xl shadow-sm transition text-lg">
                Mess Staff Login
              </Link>
            </>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mt-24">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center hover:shadow-md transition">
          <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">Daily Flexibility</h3>
          <p className="text-gray-600">Going home for the weekend? Uncheck your meals and save money instantly.</p>
        </div>
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center hover:shadow-md transition">
          <div className="w-14 h-14 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">Digital Wallet</h3>
          <p className="text-gray-600">Recharge your wallet and easily buy special add-ons without carrying cash.</p>
        </div>
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center hover:shadow-md transition">
          <div className="w-14 h-14 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">Zero Food Waste</h3>
          <p className="text-gray-600">Admins see exact meal counts for tomorrow, ensuring nothing gets thrown away.</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
