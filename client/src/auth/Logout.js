import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { clearToken } from './authUtils';

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    clearToken();
    navigate('/login');
  }, [navigate]);

  return null;
};

export default Logout;
