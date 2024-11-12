import React from 'react';
import '../assets/css/layouts/AdminLayout.css';
import SidebarDashboard from '../components/Shared/SidebarDashboard';

function AdminLayout({ children }) {
  return (
    <div id="wrapper">
      <SidebarDashboard />
      <div id="content-wrapper" className="d-flex flex-column">
        <div id="content">
          {children}
        </div>
      </div>
    </div>
  );
}

export default AdminLayout;
