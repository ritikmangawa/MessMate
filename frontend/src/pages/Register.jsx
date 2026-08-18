import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const [role, setRole] = useState('student'); // 'student' or 'admin'
  const [formData, setFormData] = useState({ 
    name: '', email: '', password: '', 
    hostel: '', roomNumber: '', messId: '',
    newMessName: '', newMessLocation: ''
  });
  const [messes, setMesses] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMesses = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/messes');
        setMesses(response.data);
      } catch (err) {
        console.error('Error fetching messes:', err);
      }
    };
    fetchMesses();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const payload = { ...formData, role };
      await axios.post('http://localhost:5000/api/auth/register', payload);
      alert('Registration successful! Please login.');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Error registering account.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
          <p className="text-gray-500 mt-2">Join MessMate to manage your meals.</p>
        </div>

        {/* Role Toggle */}
        <div className="flex bg-gray-100 p-1 rounded-xl mb-6">
          <button 
            type="button"
            onClick={() => setRole('student')}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition ${role === 'student' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            I am a Student
          </button>
          <button 
            type="button"
            onClick={() => setRole('admin')}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition ${role === 'admin' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            I am a Mess Admin
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input type="text" name="name" required className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" onChange={handleChange} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email Address</label>
            <input type="email" name="email" required className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" onChange={handleChange} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input type="password" name="password" required className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" onChange={handleChange} />
          </div>

          {role === 'student' ? (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Hostel Block</label>
                  <input type="text" name="hostel" required className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" onChange={handleChange} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Room Number</label>
                  <input type="text" name="roomNumber" required className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" onChange={handleChange} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Select Your Mess</label>
                <select name="messId" required className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white" onChange={handleChange}>
                  <option value="">-- Choose a Mess --</option>
                  {messes.map(mess => (
                    <option key={mess._id} value={mess._id}>{mess.name} ({mess.location})</option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">This determines which menu you see.</p>
              </div>
            </>
          ) : (
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 space-y-4">
              <h3 className="text-sm font-bold text-blue-800">Create Your New Mess</h3>
              <div>
                <label className="block text-sm font-medium text-blue-900">Mess Name</label>
                <input type="text" name="newMessName" required placeholder="e.g. Block C Mess" className="mt-1 w-full px-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white" onChange={handleChange} />
              </div>
              <div>
                <label className="block text-sm font-medium text-blue-900">Mess Location</label>
                <input type="text" name="newMessLocation" required placeholder="e.g. West Wing" className="mt-1 w-full px-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white" onChange={handleChange} />
              </div>
            </div>
          )}

          <button type="submit" disabled={isLoading} className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition duration-300 mt-6 disabled:bg-blue-400">
            {isLoading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account? <Link to="/login" className="text-blue-600 hover:underline font-semibold">Log in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
