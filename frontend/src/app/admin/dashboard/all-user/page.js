'use client';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllUsers } from '@/app/store/usersSlice';

export default function AllUserList() {
  const dispatch = useDispatch();
  const { users, loading, error } = useSelector((state) => state.allUsers);

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  // Optional loading/error state
  // if (loading) return <p>Loading...</p>;
  // if (error) return <p className="text-red-600">Error: {error}</p>;
  // if (!users) return <p>No users data.</p>;

  console.log('Fetched users:', users);
  
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">All Users</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border">#</th>
              <th className="px-4 py-2 border">User ID</th>
              <th className="px-4 py-2 border">Name</th>
              <th className="px-4 py-2 border">Email</th>
              <th className="px-4 py-2 border">Mobile</th>
              <th className="px-4 py-2 border">Address</th>
              {/* <th className="px-4 py-2 border">Role</th> */}
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-4">
                  No users found.
                </td>
              </tr>
            ) : (
              users.map((user, index) => (
                <tr key={user.id} className="text-center border-t">
                  <td className="px-4 py-2 border">{index + 1}</td>
                  <td className="px-4 py-2 border">{user.id}</td>
                  <td className="px-4 py-2 border">{user.name}</td>
                  <td className="px-4 py-2 border">{user.email}</td>
                  <td className="px-4 py-2 border">{user.mobile}</td>
                  <td className="px-4 py-2 border">{user.address}</td>
                  {/* <td className="px-4 py-2 border">{user.role}</td> */}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
