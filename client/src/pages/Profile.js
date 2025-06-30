import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Profile = () => {
  const { isAuthenticated, user } = useContext(AuthContext);

  if (!isAuthenticated) {
    return <p className="p-4 text-red-500">You are not logged in.</p>;
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Your Profile</h1>
      {user ? (
        <div className="bg-white shadow-md rounded-lg p-6">
          <p className="text-lg mb-2"><span className="font-semibold">Username:</span> {user.name}</p>
          <p className="text-lg"><span className="font-semibold">Role:</span> {user.role}</p>
        </div>
      ) : (
        <p className="text-gray-600">Loading user data...</p>
      )}
    </div>
  );
};

export default Profile;