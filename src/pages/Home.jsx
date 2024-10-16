import React from 'react'
import SearchBar from '../components/Shared/SearchBar'
import { Container } from 'react-bootstrap'
import ToolBar from '../components/Shared/ToolBar'
import SidebarList from '../components/Shared/SidebarList';

function Home() {
  const sidebarItems = [
    { iconName: 'home', title: 'Trang Chủ', route: '/' },
    { iconName: 'add-circle', title: 'Thêm', route: '/add' },
    { iconName: 'people', title: 'Người Dùng', route: '/people' },
    { iconName: 'calendar', title: 'Lịch', route: '/calendar' },
    { iconName: 'car', title: 'Xe Hơi', route: '/car' },
    { iconName: 'wallet', title: 'Ví', route: '/wallet' }
  ];
  return (
    <div>
      Home
      <ToolBar />
    </div>
  )
}

export default Home