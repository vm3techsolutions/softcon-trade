'use client';

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import api from '@/app/api/axiosInstance';
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
      if (!user?.id) {
        console.warn('No user ID available.');
        return;
      }

      try {
        const res = await api.get(`/user/${user.id}`);
        console.log('User data:', res.data);

        if (res.data) {
          const updated = {
            name: res.data.name || '',
            username: res.data.username || '',
            email: res.data.email || '',
            mobile: res.data.mobile || '',
            address: res.data.address || '',
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
      await api.put(`/user/${user.id}`, userData);
      alert('Profile updated successfully!');
      setEditing(false);
      setOriginalData(userData);
    } catch (err) {
      console.error('Update error:', err.response?.data || err.message);
      alert('Error updating profile');
    }
  };

  const handleCancel = () => {
    if (originalData) {
      setUserData(originalData);
    }
    setEditing(false);
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
    <div className="max-w-2xl mx-auto space-y-6 p-4 bg-gray-50 rounded shadow">
      <h2 className="text-2xl font-semibold text-gray-800">Profile Information</h2>

      {Object.entries(userData).map(([key, value]) => (
        <div key={key}>
          <label className="block font-medium capitalize mb-1 text-gray-700">
            {key}
          </label>
          {!editing ? (
            <p className="p-2 bg-white border rounded text-gray-700">
              {value || '-'}
            </p>
          ) : key === 'address' ? (
            <textarea
              name={key}
              value={value}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          ) : (
            <input
              type="text"
              name={key}
              value={value}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          )}
        </div>
      ))}

      {!editing ? (
        <button
          onClick={() => setEditing(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Edit
        </button>
      ) : (
        <div className="flex gap-4">
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Save
          </button>
          <button
            onClick={handleCancel}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      )}

      <hr className="my-6 border-gray-300" />

      {user?.id && <AccountSetting userId={user.id} />}
    </div>
  );
};

export default Profile;
