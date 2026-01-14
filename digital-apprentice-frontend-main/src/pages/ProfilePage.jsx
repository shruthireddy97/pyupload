import React, { useState } from 'react';
import Header from '../components/Header';

const ProfilePage = () => {
  // Get user data from localStorage
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  
  const [formData, setFormData] = useState({
    fullname: currentUser.fullname || '',
    username: currentUser.username || ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Update user in localStorage
    const updatedUser = {
      ...currentUser,
      fullname: formData.fullname
    };
    
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    
    // Update users array
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const updatedUsers = users.map(user => 
      user.username === currentUser.username ? updatedUser : user
    );
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    
    alert('Profile updated successfully!');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header title="Profile" />
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto">
          <div className="flex items-center justify-center mb-8">
            <div className="w-32 h-32 bg-blue-500 rounded-full flex items-center justify-center text-white text-4xl font-bold">
              {formData.fullname.charAt(0).toUpperCase()}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="fullname"
                value={formData.fullname}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                disabled
                className="w-full px-4 py-2 border rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
              />
              <p className="mt-1 text-sm text-gray-500">Username cannot be changed</p>
            </div>

            <button
              type="submit"
              className="w-full px-6 py-3 bg-[#0A3D91] text-white rounded-lg hover:bg-blue-800 
                transition-colors duration-200 font-medium"
            >
              Update Profile
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;