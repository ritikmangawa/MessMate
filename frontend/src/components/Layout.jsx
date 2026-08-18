import { Link, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Layout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      logout();
      navigate('/login');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-sans text-gray-900">
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="text-2xl font-black text-blue-600 tracking-tight">MessMate</Link>
          
          <nav className="flex items-center gap-6">
            <Link to="/about" className="text-sm font-semibold text-gray-600 hover:text-blue-600 transition">About</Link>
            
            {user ? (
              <>
                {user.role === 'admin' ? (
                  <Link to="/admin" className="text-sm font-semibold text-gray-600 hover:text-blue-600 transition">Admin Panel</Link>
                ) : (
                  <>
                    <Link to="/dashboard" className="text-sm font-semibold text-gray-600 hover:text-blue-600 transition">Dashboard</Link>
                    <Link to="/canteen" className="text-sm font-semibold text-gray-600 hover:text-blue-600 transition">Canteen</Link>
                    <Link to="/wallet" className="text-sm font-semibold text-gray-600 hover:text-blue-600 transition">Wallet (₹{user.walletBalance})</Link>
                    <Link to="/profile" className="text-sm font-semibold text-gray-600 hover:text-blue-600 transition">Profile</Link>
                  </>
                )}
                <button onClick={handleLogout} className="text-sm font-bold text-red-600 hover:text-red-700 bg-red-50 px-4 py-2 rounded-full transition">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm font-semibold text-gray-600 hover:text-blue-600 transition">Log In</Link>
                <Link to="/register" className="text-sm font-bold bg-blue-600 text-white px-5 py-2 rounded-full hover:bg-blue-700 shadow-sm transition transform hover:-translate-y-0.5">Sign Up</Link>
              </>
            )}
          </nav>
        </div>
      </header>
      
      <main className="flex-grow">
        <Outlet />
      </main>

      <footer className="bg-white border-t py-8 text-center text-gray-500 text-sm mt-12">
        <p>&copy; {new Date().getFullYear()} MessMate. Built for smart hostels.</p>
      </footer>
    </div>
  );
};

export default Layout;
