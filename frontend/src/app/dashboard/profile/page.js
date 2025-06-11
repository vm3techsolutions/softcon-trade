'use client';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import api from '@/app/api/api'; // adjust the path based on your structure
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

  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      if (!user?.id) return;

      try {
        const res = await api.get(`/user/${user.id}`);
        setUserData(res.data);
        console.log('Fetched user:', res.data);
      } catch (err) {
        console.error('Fetch error:', err.response?.data || err.message);
      }
    };

    fetchUser();
  }, [user?.id]);

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!user?.id) {
      alert('User not authenticated');
      return;
    }

    try {
      const res = await api.put(`/user/${user.id}`, userData);
      alert('Profile updated successfully!');
      setEditing(false);
    } catch (err) {
      console.error('Update error:', err.response?.data || err.message);
      alert('Error updating profile');
    }
  };

  if (!isAuthenticated) {
    return <div>Please log in to access your profile.</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Profile Information</h2>

      {Object.entries(userData).map(([key, value]) => (
        <div key={key}>
          <label className="block capitalize">{key}</label>
          {key === 'address' ? (
            <textarea
              name={key}
              value={value || ''}
              onChange={handleChange}
              disabled={!editing}
              className="w-full p-2 border rounded"
            />
          ) : (
            <input
              type="text"
              name={key}
              value={value || ''}
              onChange={handleChange}
              disabled={!editing}
              className="w-full p-2 border rounded"
            />
          )}
        </div>
      ))}

      {!editing ? (
        <button
          onClick={() => setEditing(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Edit
        </button>
      ) : (
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          Save
        </button>
      )}

      <hr className="my-6" />
      <AccountSetting userId={user.id} />
    </div>
  );
};

export default Profile;
