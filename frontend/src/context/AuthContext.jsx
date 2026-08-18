// frontend/src/context/AuthContext.jsx
import { createContext, useState, useEffect, useContext } from 'react';

// Create the Context
const AuthContext = createContext();

// Create a Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // When the app first loads, we can check if we stored user data previously
  useEffect(() => {
    const storedUser = localStorage.getItem('messmate_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Function to call when logging in
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('messmate_user', JSON.stringify(userData));
  };

  // Function to call when logging out
  const logout = () => {
    setUser(null);
    localStorage.removeItem('messmate_user');
    // Note: We also need to hit the backend logout route later to clear the HTTP-only cookie!
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom Hook to easily use this context in any file
export const useAuth = () => {
  return useContext(AuthContext);
};
