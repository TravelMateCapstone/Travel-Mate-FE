import React from 'react';
import '../assets/css/layouts/AdminLayout.css';
import SidebarDashboard from '../components/Shared/SidebarDashboard';
import AdminNavbar from '../components/Shared/AdminNavbar';
function AdminLayout({ children }) {
  return (
    <div id="wrapper">
    <SidebarDashboard />
    <div id="content-wrapper" className="d-flex flex-column">
      <div id="content">
        <AdminNavbar />
        <div className='px-4'>{children}</div>
      </div>
    </div>
  </div>
  );
}
export default AdminLayout;
