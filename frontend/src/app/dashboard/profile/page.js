'use client';

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axiosInstance from '@/app/api/axiosInstance';
import { PencilIcon, SaveIcon, XIcon, ClipboardCopyIcon } from 'lucide-react';
import AccountSetting from '@/Component/AccountSetting';

const Profile = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const [userData, setUserData] = useState({
    name: '',
    username: '',
    email: '',
    mobile: '',
    address: '',
  });

  const [originalData, setOriginalData] = useState(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (!user?.id) return;

      try {
        const res = await axiosInstance.get(`/user/getData/${user.id}`);
        console.log('User data:', res.data);

        if (res.data?.user) {
          const { name, username, email, mobile, address } = res.data.user;
          const updated = {
            name: name || '',
            username: username || '',
            email: email || '',
            mobile: mobile || '',
            address: address || '',
          };

          setUserData(updated);
          setOriginalData(updated);
        }
      } catch (err) {
        console.error('Fetch error:', err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [user?.id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!user?.id) return alert('User not authenticated');
    try {
      await axiosInstance.put(`/user/getData/${user.id}`, userData);
      alert('Profile updated successfully!');
      setEditing(false);
      setOriginalData(userData);
    } catch (err) {
      console.error('Update error:', err.response?.data || err.message);
      alert('Error updating profile');
    }
  };

  const handleCancel = () => {
    setUserData(originalData);
    setEditing(false);
  };

  const handleCopyText = () => {
    const plainText = Object.entries(userData)
      .map(([key, value]) => `${key.toUpperCase()}: ${value || '-'}`)
      .join('\n');
    navigator.clipboard.writeText(plainText);
    alert('Profile info copied as plain text!');
  };

  if (!isAuthenticated) {
    return (
      <div className="text-center py-10 text-red-600">
        Please log in to access your profile.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center py-10 text-gray-500">Loading profile...</div>
    );
  }

 return (
  <>
    <div className="flex flex-col lg:flex-row gap-6 px-4 py-6">
      {/* Profile Section - wider */}
      <div className="w-full lg:w-2/3 bg-white shadow-lg rounded-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-semibold text-gray-800">Profile</h2>
          {!editing && (
            <button
              onClick={() => setEditing(true)}
              className="text-blue-600 hover:text-blue-800"
              title="Edit Profile"
            >
              <PencilIcon className="w-6 h-6" />
            </button>
          )}
        </div>

        <div className="space-y-4">
          {Object.entries(userData).map(([key, value]) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-600 capitalize mb-1">
                {key}
              </label>
              {editing ? (
                key === 'address' ? (
                  <textarea
                    name={key}
                    value={value}
                    onChange={handleChange}
                    rows={3}
                    className="w-full p-2 border rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <input
                    type="text"
                    name={key}
                    value={value}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                )
              ) : (
                <div className="bg-gray-100 p-3 rounded text-gray-800">
                  {value || '-'}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-6 flex gap-4">
          {editing ? (
            <>
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                <SaveIcon className="w-4 h-4" />
                Save
              </button>
              <button
                onClick={handleCancel}
                className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                <XIcon className="w-4 h-4" />
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={handleCopyText}
              className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
            >
              <ClipboardCopyIcon className="w-4 h-4" />
              Copy Plain Text
            </button>
          )}
        </div>
      </div>

      {/* Account Setting Section - narrower */}
      <div className="w-full lg:w-1/3 bg-white shadow-lg rounded-2xl p-6">
        {user?.id && <AccountSetting userId={user.id} />}
      </div>
    </div>
  </>
);

};

export default Profile;
