import React, { useState } from 'react';
import AdminSidebar from "../components/Shared/AdminSidebar";
import AdminNavbar from "../components/Shared/AdminNavbar";
import { Offcanvas } from 'react-bootstrap'; // Import Offcanvas from Bootstrap
import '../assets/css/layouts/AdminLayout.css';

function AdminLayout({ children }) {
  const [showSidebar, setShowSidebar] = useState(false); // State to toggle sidebar

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  return (
    <div className="admin-layout">
      <Offcanvas show={showSidebar} onHide={toggleSidebar} className="admin-sidebar-offcanvas">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Menu</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <AdminSidebar />
        </Offcanvas.Body>
      </Offcanvas>

      <button className="sidebar-toggle-btn" onClick={toggleSidebar}>
        ☰
      </button>

      <div className="admin-sidebar">
        <AdminSidebar />
      </div>

      <div className="admin-content">
        <AdminNavbar />
        <div className="admin-main-content">
          {children}
        </div>
      </div>
    </div>
  );
}

export default AdminLayout;
