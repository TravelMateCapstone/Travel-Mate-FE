import React from 'react';
import AdminSidebar from '../components/Shared/AdminSidebar';
import AdminNavbar from '../components/Shared/AdminNavbar';
import { useLocation } from 'react-router-dom';
import RoutePath from '../routes/RoutePath';
import LocalSidebar from '../components/Shared/LocalSidebar';
import LocalNavbar from '../components/Shared/LocalNavbar';
import { is } from 'date-fns/locale';

function AdminLayout({ children }) {
  const location = useLocation();

  const isAdmin = (location.pathname === RoutePath.ADMIN || location.pathname === RoutePath.ADMIN_ACCOUNT_LIST || location.pathname === RoutePath.ADMIN_REPORT || location.pathname === RoutePath.ADMIN_TRANSACTION || location.pathname === RoutePath.ADMIN_WALLET_MANAGEMENT || location.pathname === RoutePath.ADMIN_TRIP_HISTORY);

  return (
    <div id="wrapper">
      {isAdmin ? (
        <AdminSidebar />
      ) : (
        <LocalSidebar />
      )}
      <div id="content-wrapper" className="d-flex flex-column">
        <div id="content">
          {isAdmin ? (
            <AdminNavbar />
          ) : (
            <LocalNavbar />
          )}
          <div className="container-fluid">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
export default AdminLayout;
