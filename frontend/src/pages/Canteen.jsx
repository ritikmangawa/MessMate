import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Canteen = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [cart, setCart] = useState({});
  const [loading, setLoading] = useState(true);
  const [ordering, setOrdering] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchItems = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/canteen/items', {
          withCredentials: true
        });
        setItems(response.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, [user, navigate]);

  const updateQuantity = (itemId, delta) => {
    setCart(prev => {
      const newQty = (prev[itemId] || 0) + delta;
      if (newQty <= 0) {
        const newCart = { ...prev };
        delete newCart[itemId];
        return newCart;
      }
      return { ...prev, [itemId]: newQty };
    });
  };

  const calculateTotal = () => {
    return Object.entries(cart).reduce((total, [itemId, qty]) => {
      const item = items.find(i => i._id === itemId);
      return total + (item ? item.price * qty : 0);
    }, 0);
  };

  const handleCheckout = async () => {
    const totalAmount = calculateTotal();
    if (totalAmount === 0) return;

    if (user.walletBalance < totalAmount) {
      alert(`Insufficient balance. You need ₹${totalAmount} but only have ₹${user.walletBalance}.`);
      return;
    }

    setOrdering(true);
    try {
      const orderItems = Object.entries(cart).map(([itemId, qty]) => {
        const item = items.find(i => i._id === itemId);
        return { itemId, name: item.name, price: item.price, quantity: qty };
      });

      const response = await axios.post('http://localhost:5000/api/canteen/order', {
        items: orderItems,
        totalAmount
      }, { withCredentials: true });

      login({ ...user, walletBalance: response.data.balance });
      setCart({});
      alert('Order placed successfully! Please collect it from the canteen counter.');
    } catch (err) {
      alert(err.response?.data?.message || 'Error placing order');
    } finally {
      setOrdering(false);
    }
  };

  if (!user) return null;

  const totalAmount = calculateTotal();

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900">Night Canteen</h2>
          <p className="text-gray-500 mt-2">Order late-night snacks directly from your wallet.</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Wallet Balance</p>
          <p className="text-3xl font-black text-blue-600">₹{user.walletBalance}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Menu Items */}
        <div className="lg:col-span-2 grid sm:grid-cols-2 gap-4">
          {loading ? (
             <p className="text-gray-500">Loading menu...</p>
          ) : items.length === 0 ? (
             <p className="text-gray-500">No items available tonight.</p>
          ) : items.map(item => (
            <div key={item._id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center hover:border-blue-200 transition">
              <div>
                <h3 className="text-lg font-bold text-gray-900">{item.name}</h3>
                <p className="text-blue-600 font-bold mt-1">₹{item.price}</p>
              </div>
              <div className="flex items-center gap-3 bg-gray-50 rounded-full px-2 py-1 border border-gray-200">
                <button onClick={() => updateQuantity(item._id, -1)} className="w-8 h-8 rounded-full bg-white shadow-sm text-gray-600 font-bold hover:bg-gray-100">-</button>
                <span className="font-bold w-4 text-center">{cart[item._id] || 0}</span>
                <button onClick={() => updateQuantity(item._id, 1)} className="w-8 h-8 rounded-full bg-blue-600 shadow-sm text-white font-bold hover:bg-blue-700">+</button>
              </div>
            </div>
          ))}
        </div>

        {/* Cart */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-fit sticky top-24">
          <h3 className="text-xl font-bold text-gray-900 mb-6 border-b pb-4">Your Order</h3>
          
          {Object.keys(cart).length === 0 ? (
            <p className="text-gray-400 italic text-center py-8">Your cart is empty</p>
          ) : (
            <div className="space-y-4 mb-6">
              {Object.entries(cart).map(([itemId, qty]) => {
                const item = items.find(i => i._id === itemId);
                if (!item) return null;
                return (
                  <div key={itemId} className="flex justify-between items-center text-sm">
                    <span className="font-medium text-gray-800">{qty}x {item.name}</span>
                    <span className="font-bold text-gray-900">₹{item.price * qty}</span>
                  </div>
                );
              })}
              <div className="border-t pt-4 mt-4 flex justify-between items-center">
                <span className="font-bold text-gray-900">Total</span>
                <span className="text-2xl font-black text-blue-600">₹{totalAmount}</span>
              </div>
            </div>
          )}

          <button 
            onClick={handleCheckout} 
            disabled={totalAmount === 0 || ordering}
            className="w-full bg-gray-900 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-black transition-colors disabled:bg-gray-300 disabled:shadow-none"
          >
            {ordering ? 'Processing...' : 'Pay with Wallet'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Canteen;
