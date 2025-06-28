import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Dashboard = () => {
  const { isAuthenticated } = useContext(AuthContext);

  if (!isAuthenticated) {
    return <p className="p-4 text-red-500">Access denied. Please log in.</p>;
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Dashboard</h1>
      <p className="mt-2">This is your dashboard. You can see your stats here.</p>
    </div>
  );
};

export default Dashboard;
