'use client';
import { useState } from 'react';

const AccountSettings = () => {
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });

  const handleChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handlePasswordUpdate = async () => {
    if (passwords.newPassword !== passwords.confirmNewPassword) {
      alert("New passwords don't match!");
      return;
    }

    const res = await fetch('/update-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(passwords),
    });

    if (res.ok) {
      alert('Password updated!');
      setPasswords({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
    } else {
      alert('Failed to update password.');
    }
  };

  return (
    <div>
      <h3 className="text-xl font-semibold mt-6">Account Settings</h3>
      <div className="space-y-4 mt-2">
        <input
          type="password"
          name="currentPassword"
          placeholder="Current Password"
          value={passwords.currentPassword}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          type="password"
          name="newPassword"
          placeholder="New Password"
          value={passwords.newPassword}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          type="password"
          name="confirmNewPassword"
          placeholder="Confirm New Password"
          value={passwords.confirmNewPassword}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <button onClick={handlePasswordUpdate} className="px-4 py-2 bg-blue-700 text-white rounded">
          Update Password
        </button>
      </div>
    </div>
  );
};

export default AccountSettings;
