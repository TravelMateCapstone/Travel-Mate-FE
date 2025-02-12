import { useLocation } from 'react-router-dom';
import RoutePath from '../routes/RoutePath';
import TopBar from '../components/Dashboard/TopBar';
import Sidebar from '../components/Dashboard/Sidebar';
// eslint-disable-next-line react/prop-types
function AdminLayout({ children }) {
  const location = useLocation();
  const sidebarItemsAdmin = [
    { icon: 'pie-chart', title: 'Thống kê', route: RoutePath.ADMIN },
    { icon: 'mail-open', title: 'Quản lý khiếu nại', route: RoutePath.ADMIN_REPORT },
    { icon: 'accessibility', title: 'Quản lý tài khoản', route: RoutePath.ADMIN_ACCOUNT_LIST },
    { icon: 'cash', title: 'Lịch sử giao dịch', route: RoutePath.ADMIN_TRANSACTION },
    { icon: 'airplane', title: 'Quản lý tour', route: RoutePath.ADMIN_TRIP_HISTORY },
    { icon: 'location', title: 'Quản lý địa điểm', route: RoutePath.ADMIN_DESTINATION_MANAGEMENT },
  ];
  const sidebarItemsLocal = [
    { icon: 'pie-chart', title: 'Thống kê', route: RoutePath.LOCAL_STATICTIS },
    { icon: 'mail-open', title: 'Lịch sử giao dịch', route: RoutePath.LOCAL_WALLET_MANAGEMENT },
    { icon: 'accessibility', title: 'Chuyến đi', route: RoutePath.LOCAL_TRIP_HISTORY },
    { icon: 'cash', title: 'Lịch trình', route: RoutePath.LOCAL_CALENDAR_MANAGEMENT },
  ];
  const isAdmin = (location.pathname === RoutePath.ADMIN || location.pathname === RoutePath.ADMIN_ACCOUNT_LIST || location.pathname === RoutePath.ADMIN_REPORT || location.pathname === RoutePath.ADMIN_TRANSACTION || location.pathname === RoutePath.ADMIN_WALLET_MANAGEMENT || location.pathname === RoutePath.ADMIN_TRIP_HISTORY || location.pathname === RoutePath.ADMIN_DESTINATION_MANAGEMENT);
  return (
   <div>
      <div className='d-flex'>
       <div>
          {isAdmin ? (
            <Sidebar items={sidebarItemsAdmin} />
          ) : (
            <Sidebar items={sidebarItemsLocal} />
          )}
       </div>
        <div id="content-wrapper" className="d-flex flex-column flex-grow-1">
          <div id="content">
            <TopBar />
            <div className="container-fluid mt-3">
              {children}
            </div>
          </div>
        </div>
      </div>
   </div>
  
  );
}
export default AdminLayout;
