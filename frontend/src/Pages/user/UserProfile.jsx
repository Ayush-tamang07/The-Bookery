import React, { useEffect, useState } from 'react';
import apiClient from '../../api/axios';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Please log in to view your profile.');
          return;
        }

        const response = await apiClient.get('/user/getuserdetails', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(response.data);
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Failed to load user details.');
      }
    };

    fetchUserDetails();
  }, []);

  if (error) {
    return (
      <div className="pt-24 px-6 max-w-xl mx-auto">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded shadow">
          <p className="text-red-700 font-medium">{error}</p>
          <button className="mt-3 text-blue-600 hover:text-blue-800 font-medium text-sm">
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="pt-24 px-6 max-w-xl mx-auto flex justify-center">
        <div className="flex flex-col items-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-3"></div>
          <p className="text-gray-600 font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 px-6 max-w-xl mx-auto">
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6">
          <div className="flex items-center">
            <div className="ml-4">
              <h2 className="text-2xl font-bold text-white">My Profile</h2>
              <span className="inline-block bg-blue-400 bg-opacity-30 text-white text-xs px-2 py-1 rounded-full mt-1">
                Active User
              </span>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <div className="space-y-4">
            <div className="pb-4 border-b border-gray-100">
              <p className="text-sm text-gray-500 mb-1">Email</p>
              <p className="text-gray-800 font-medium">{user.email}</p>
            </div>
            
            <div className="pb-4">
              <p className="text-sm text-gray-500 mb-1">Username</p>
              <p className="text-gray-800 font-medium">{user.userName}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;