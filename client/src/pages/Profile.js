import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Profile = () => {
  const { isAuthenticated } = useContext(AuthContext);

  if (!isAuthenticated) {
    return <p className="p-4 text-red-500">You are not logged in.</p>;
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Your Profile</h1>
      <p className="mt-2">Welcome back! This is your profile page.</p>
    </div>
  );
};

export default Profile;
