import React, { useState } from 'react';
import Header from '../components/Header';

const SettingsPage = () => {
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  
  const [formData, setFormData] = useState({
    fullname: currentUser.fullname || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [privateMode, setPrivateMode] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
    setSuccess('');
  };
  console.log(privateMode)

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Password validation
    if (formData.newPassword) {
      if (formData.newPassword !== formData.confirmPassword) {
        setError('New passwords do not match');
        return;
      }
      if (!formData.currentPassword) {
        setError('Current password is required');
        return;
      }
      if (formData.currentPassword !== currentUser.password) {
        setError('Current password is incorrect');
        return;
      }
    }

    // Update user in localStorage
    const updatedUser = {
      ...currentUser,
      fullname: formData.fullname,
      password: formData.newPassword || currentUser.password
    };
    
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    
    // Update users array
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const updatedUsers = users.map(user => 
      user.username === currentUser.username ? updatedUser : user
    );
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    
    setSuccess('Settings updated successfully!');
    setFormData(prev => ({
      ...prev,
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }));
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header title="Settings" />
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name Section */}
            <div>
              <h3 className="text-lg font-medium mb-4">Profile Settings</h3>
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
                />
              </div>
            </div>

            {/* Password Section */}
            <div>
              <h3 className="text-lg font-medium mb-4">Change Password</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Current Password
                  </label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Privacy Settings */}
            <div>
              <h3 className="text-lg font-medium mb-4">Privacy Settings</h3>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Private Mode</span>
                {
                    privateMode ? 
                         <button
                  type="button"
                  onClick={() => setPrivateMode(false)}
                  className='relative inline-flex items-center rounded-full transition-colors text-white duration-200 ease-in-out bg-blue-600'
                 
                >
                 ON
                </button>:
                 <button
                  type="button"
                  onClick={() => setPrivateMode(true)}
                  className='relative inline-flex items-center rounded-full transition-colors text-black duration-200 ease-in-out bg-white'
                style={{backgroundColor: 'white'}}
                 
                >
                 OFF
                </button>
                }
              
              </div>
            </div>

            {/* Error and Success Messages */}
            {error && <p className="text-red-500 text-sm">{error}</p>}
            {success && <p className="text-green-500 text-sm">{success}</p>}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full px-6 py-3 bg-[#0A3D91] text-white rounded-lg hover:bg-orange-800 
                transition-colors duration-200 font-medium"
            >
              Save Changes
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;