import React, { useState, useEffect } from 'react';
import { FaEnvelope, FaEdit, FaUser, FaUserCog, FaSearch } from 'react-icons/fa';
import apiClient from '../../api/axios';
import { toast } from "react-toastify";

function UserContent() {
  const [users, setUsers] = useState([]);
  const [editingUserId, setEditingUserId] = useState(null);
  const [editedRoles, setEditedRoles] = useState({});
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await apiClient.get('/admin/getuserdetails', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const usersData = response?.data;
        if (Array.isArray(usersData)) {
          setUsers(usersData);
          const roles = {};
          usersData.forEach((user) => (roles[user.userId] = user.role));
          setEditedRoles(roles);
        } else {
          console.error("Expected array but got:", usersData);
        }
      } catch (error) {
        console.error("Failed to fetch user details:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleEdit = (userId) => {
    setEditingUserId(userId);
  };

  const handleRoleChange = (userId, newRole) => {
    setEditedRoles({ ...editedRoles, [userId]: newRole });
  };

  const handleSave = async (userId) => {
    const updatedUsers = users.map((u) =>
      u.userId === userId ? { ...u, role: editedRoles[userId] } : u
    );
    setUsers(updatedUsers);
    setEditingUserId(null);

    try {
      const token = localStorage.getItem("token");
      const selectedUser = users.find(u => u.userId === userId);
      const updatedRole = editedRoles[userId];

      const response = await apiClient.put(`/admin/updaterole/${selectedUser.email}`, {
        role: updatedRole,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("User role updated successfully!");
      console.log("Role update response:", response.data);

    } catch (error) {
      toast.error("Failed to update user role");
      console.error("Failed to update user role", error?.response?.data || error);
    }
  };

  const filteredUsers = users.filter(user => 
    user.userName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="px-6 py-8">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <th className="py-3 px-6">Name</th>
                <th className="py-3 px-6">Email</th>
                <th className="py-3 px-6">Role</th>
                <th className="py-3 px-6">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.userId} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                          <FaUser className="text-gray-500" size={14} />
                        </div>
                        <div className="ml-3">
                          <div className="font-medium text-gray-900">{user.userName}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center text-sm text-gray-600">
                        <FaEnvelope className="mr-2 text-gray-400" size={14} />
                        {user.email}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      {editingUserId === user.userId ? (
                        <select
                          className="border border-gray-300 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                          value={editedRoles[user.userId]}
                          onChange={(e) => handleRoleChange(user.userId, e.target.value)}
                        >
                          <option value="User">User</option>
                          <option value="Staff">Staff</option>
                        </select>
                      ) : (
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-medium rounded-full ${
                          user.role === "Staff" 
                            ? "bg-indigo-100 text-indigo-800" 
                            : "bg-green-100 text-green-800"
                        }`}>
                          {user.role}
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      {editingUserId === user.userId ? (
                        <button
                          onClick={() => handleSave(user.userId)}
                          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                          Save Changes
                        </button>
                      ) : (
                        <button
                          onClick={() => handleEdit(user.userId)}
                          className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors flex items-center focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                        >
                          <FaEdit className="mr-2" size={12} />
                          Edit Role
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="py-8 text-center text-gray-500">
                    <div className="flex flex-col items-center">
                      <FaSearch className="text-gray-300 mb-3" size={24} />
                      <p>No users found matching your search</p>
                    </div>
                  </td>
                </tr>
              )}
              {users.length === 0 && (
                <tr>
                  <td colSpan="4" className="py-8 text-center text-gray-500">
                    <div className="flex flex-col items-center">
                      <FaUserCog className="text-gray-300 mb-3" size={24} />
                      <p>No users data available</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default UserContent;