import React from 'react';
import { FaUserPlus, FaFilter, FaEdit, FaTrashAlt, FaUserTie, FaUserCog } from 'react-icons/fa';

function StaffContent() {
  const staffMembers = [
    { id: 1, name: 'Robert Johnson', role: 'Manager', department: 'Administration', email: 'robert@bookery.com', joined: '2023-01-15' },
    { id: 2, name: 'Amanda Wilson', role: 'Senior Sales Representative', department: 'Sales', email: 'amanda@bookery.com', joined: '2023-03-22' },
    { id: 3, name: 'Chris Parker', role: 'Inventory Specialist', department: 'Inventory', email: 'chris@bookery.com', joined: '2023-05-10' },
    { id: 4, name: 'Melissa Brown', role: 'Customer Service Rep', department: 'Customer Service', email: 'melissa@bookery.com', joined: '2023-08-05' },
    { id: 5, name: 'Daniel Lee', role: 'Marketing Coordinator', department: 'Marketing', email: 'daniel@bookery.com', joined: '2024-02-12' }
  ];

  const getRoleIcon = (role) => {
    if (role.includes('Manager')) {
      return <FaUserTie className="text-blue-600" />;
    } else {
      return <FaUserCog className="text-gray-600" />;
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">Staff Management</h2>
        <div className="flex space-x-2">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center">
            <FaUserPlus size={16} className="mr-2" />
            Add Staff
          </button>
          <button className="px-4 py-2 border border-gray-300 rounded-lg flex items-center">
            <FaFilter size={16} className="mr-2" />
            Filter
          </button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left py-3 px-4 font-medium text-gray-600">Name</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">Role</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">Department</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">Email</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">Joined</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {staffMembers.map((staff) => (
              <tr key={staff.id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="py-3 px-4">{staff.name}</td>
                <td className="py-3 px-4">
                  <div className="flex items-center">
                    <span className="mr-2">{getRoleIcon(staff.role)}</span>
                    {staff.role}
                  </div>
                </td>
                <td className="py-3 px-4">{staff.department}</td>
                <td className="py-3 px-4">{staff.email}</td>
                <td className="py-3 px-4">{staff.joined}</td>
                <td className="py-3 px-4">
                  <div className="flex space-x-2">
                    <button className="p-1 text-blue-600 hover:bg-blue-100 rounded">
                      <FaEdit size={18} />
                    </button>
                    <button className="p-1 text-red-600 hover:bg-red-100 rounded">
                      <FaTrashAlt size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="flex justify-between items-center mt-6">
        <div className="text-sm text-gray-600">
          Showing 1 to 5 of 5 entries
        </div>
        <div className="flex space-x-1">
          <button className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50">Previous</button>
          <button className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm">1</button>
          <button className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50">Next</button>
        </div>
      </div>
    </div>
  );
}

export default StaffContent;