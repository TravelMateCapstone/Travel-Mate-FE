import React from 'react';
import AdminSidebar from '../components/Shared/AdminSidebar';
import AdminNavbar from '../components/Shared/AdminNavbar';

function AdminLayout({ children }) {
  return (
    <div id="wrapper">
      {/* Sidebar */}
      <AdminSidebar />
      
      {/* Content Wrapper */}
      <div id="content-wrapper" className="d-flex flex-column">
        {/* Main Content */}
        <div id="content">
          {/* Navbar */}
          <AdminNavbar />

          {/* Page Content */}
          <div className="container-fluid">
            {children}
          </div>
        </div>

        {/* Footer */}
        <footer className="sticky-footer bg-white">
          <div className="container my-auto">
            <div className="copyright text-center my-auto">
              <span>Copyright © Your Website 2021</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
export default AdminLayout;
