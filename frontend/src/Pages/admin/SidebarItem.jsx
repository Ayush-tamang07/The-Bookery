import React from 'react';

function SidebarItem({ icon, text, active, onClick }) {
  return (
    <div 
      className={`flex items-center px-4 py-3 cursor-pointer ${active ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
      onClick={onClick}
    >
      <div className="mr-4">{icon}</div>
      <span className="font-medium">{text}</span>
    </div>
  );
}

export default SidebarItem;