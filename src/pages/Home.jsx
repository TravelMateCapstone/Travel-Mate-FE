import React from 'react'
import SearchBar from '../components/Shared/SearchBar'
import { Container } from 'react-bootstrap'
import ToolBar from '../components/Shared/ToolBar'
import SidebarList from '../components/Shared/SidebarList';
import FormSubmit from '../components/Shared/FormSubmit'
import { useSelector } from 'react-redux';
function Home() {
  const sidebarItems = [
    { iconName: 'home', title: 'Trang Chủ', route: '/' },
    { iconName: 'add-circle', title: 'Thêm', route: '/add' },
    { iconName: 'people', title: 'Người Dùng', route: '/people' },
    { iconName: 'calendar', title: 'Lịch', route: '/calendar' },
    { iconName: 'car', title: 'Xe Hơi', route: '/car' },
    { iconName: 'wallet', title: 'Ví', route: '/wallet' }
  ];

  const handleFormSubmit = () => {
    alert("Đã lưu event");
  };
  // Lấy thông tin người dùng từ Redux store
  const user = useSelector((state) => state.auth.user);
  
  return (
    <div>

     {/* Hiển thị thông tin người dùng nếu đã đăng nhập */}
     {user ? (
        <h2>Chào mừng {user["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"]}!</h2>
      ) : (
        <h2>Chào mừng khách!</h2>
      )}
      <ToolBar />
    </div>
  )
}

export default Home