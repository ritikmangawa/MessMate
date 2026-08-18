import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Wallet = () => {
  const { user, login, logout } = useAuth();
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [rechargeAmount, setRechargeAmount] = useState(500);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchTransactions = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/wallet/transactions', {
          withCredentials: true
        });
        setTransactions(response.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, [user, navigate]);

  const handleMockRecharge = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/wallet/recharge', 
        { amount: rechargeAmount }, 
        { withCredentials: true }
      );
      
      // Update local React Context to show new balance immediately
      login({ ...user, walletBalance: response.data.balance });
      
      // Add the new transaction to the top of the list instantly
      setTransactions([response.data.transaction, ...transactions]);
      
      alert(`Successfully added ₹${rechargeAmount} to your wallet!`);
    } catch (err) {
      alert('Error recharging wallet.');
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      <main className="mt-2">
        
        {/* Wallet Balance & Recharge Card */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl shadow-lg p-8 text-white mb-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <p className="text-blue-100 mb-1 font-medium tracking-wide">Current Balance</p>
            <h2 className="text-5xl font-extrabold">₹{user.walletBalance}</h2>
          </div>
          
          <div className="bg-white rounded-xl p-5 text-center text-gray-800 shadow-md w-full md:w-auto">
            <p className="text-sm font-bold mb-3 text-gray-600 uppercase tracking-wider">Mock Recharge</p>
            <div className="flex gap-2">
              <select 
                value={rechargeAmount} 
                onChange={(e) => setRechargeAmount(Number(e.target.value))} 
                className="border border-gray-300 rounded-lg p-2 text-sm font-bold bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value={100}>₹ 100</option>
                <option value={500}>₹ 500</option>
                <option value={1000}>₹ 1,000</option>
                <option value={2000}>₹ 2,000</option>
              </select>
              <button 
                onClick={handleMockRecharge} 
                className="bg-green-500 text-white px-6 py-2 rounded-lg font-bold hover:bg-green-600 transition shadow-sm"
              >
                Add Money
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-2 italic">*Bypasses payment gateway for testing</p>
          </div>
        </div>

        {/* Transaction History */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-6 border-b pb-3">Transaction History</h3>
          
          {loading ? (
             <p className="text-gray-500 italic">Loading transactions...</p>
          ) : transactions.length === 0 ? (
             <div className="text-center p-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                <p className="text-gray-500 font-medium">No transactions found.</p>
             </div>
          ) : (
            <div className="space-y-4">
              {transactions.map((tx) => (
                <div key={tx._id} className="flex justify-between items-center p-4 border border-gray-100 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-full ${tx.type === 'credit' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                      {tx.type === 'credit' ? (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                      ) : (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4"></path></svg>
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-gray-800 text-lg">{tx.description}</p>
                      <p className="text-sm text-gray-500">{new Date(tx.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                  <div className={`font-extrabold text-xl ${tx.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                    {tx.type === 'credit' ? '+' : '-'} ₹{tx.amount}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </main>
    </div>
  );
};

export default Wallet;
