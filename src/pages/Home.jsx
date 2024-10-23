import React from 'react'
import SearchBar from '../components/Shared/SearchBar'
import { Container } from 'react-bootstrap'
import ToolBar from '../components/Shared/ToolBar'
import SidebarList from '../components/Shared/SidebarList';
import FormSubmit from '../components/Shared/FormSubmit'
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
  return (
    <div>
      <FormSubmit title="Registration Form" 
        buttonText="Submit Form" 
        onButtonClick={handleFormSubmit}>
        <form>
          <label>
            Name:
            <input type="text" />
          </label>
          <br />
          <label>
            Email:
            <input type="email" />
          </label>
          <br />
        </form>
      </FormSubmit>
      <ToolBar />
    </div>
  )
}

export default Home