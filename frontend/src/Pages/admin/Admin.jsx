import { Outlet } from "react-router-dom";
import SideBar from "../../components/adminComponent/SideBar";
import Header from "../../components/adminComponent/Header";

const Admin = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar - fixed position with white background */}
      <div className="fixed inset-y-0 left-0 z-20 w-64  border-gray-200 shadow-sm">
        <SideBar />
      </div>
      
      {/* Main content area */}
      <div className="flex flex-col flex-1 ml-64">
        {/* Header - clean white with subtle shadow */}
        <header className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm py-3 px-6">
          <Header />
        </header>
        
        {/* Content area with proper padding */}
        <main className="flex-1 p-8 bg-white">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Admin;