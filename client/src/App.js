import React, { useContext, useEffect } from 'react';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import AppContent from './AppContent';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

const AppWrapper = () => {
  const { checkAuth } = useContext(AuthContext);

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <CartProvider>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <AppContent />
    </CartProvider>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppWrapper />
    </AuthProvider>
  );
}

export default App;