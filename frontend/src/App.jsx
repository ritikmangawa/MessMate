import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import Wallet from './pages/Wallet';
import Canteen from './pages/Canteen';
import Profile from './pages/Profile';

function App(){
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        
        {/* Protected Routes (Logic handled inside components) */}
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="admin" element={<AdminDashboard />} />
        <Route path="wallet" element={<Wallet />} />
        <Route path="canteen" element={<Canteen />} />
        <Route path="profile" element={<Profile />} />
      </Route>
    </Routes>
  );
}
export default App;
  

