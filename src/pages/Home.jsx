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
      <FormSubmit
        buttonText="Gửi Báo Cáo"
        openModalText={'Báo Cáo'}
        title={'Báo Cáo'}
        onButtonClick={handleFormSubmit}>
        <div>
          {/* Hành vi */}
          <div className="mb-4">
            <label className="fw-bold mgt-5">Bạn muốn báo cáo điều gì?</label>
            <p className="text-muted">Nếu phát hiện người dùng có hành vi bất thường, hãy báo cáo cho chúng tôi</p>

            {/* Các tùy chọn hành vi */}
            <div className="custom-checkbox-wrapper">
              <input type="checkbox" id="offensive-language" name="behavior" className="custom-checkbox" />
              <label htmlFor="offensive-language" className="custom-checkbox-label">Lời nói xúc phạm</label>
            </div>

            <div className="custom-checkbox-wrapper">
              <input type="checkbox" id="harassment" name="behavior" className="custom-checkbox" />
              <label htmlFor="harassment" className="custom-checkbox-label">Khiêu dâm</label>
            </div>

            <div className="custom-checkbox-wrapper">
              <input type="checkbox" id="abuse" name="behavior" className="custom-checkbox" />
              <label htmlFor="abuse" className="custom-checkbox-label">Đả kích</label>
            </div>

            <div className="custom-checkbox-wrapper">
              <input type="checkbox" id="fraud" name="behavior" className="custom-checkbox" />
              <label htmlFor="fraud" className="custom-checkbox-label">Gian dối</label>
            </div>
          </div>

          {/* Mô tả */}
          <div className="mb-4">
            <label className="fw-bold">Mô tả</label>
            <textarea className="w-100" style={{
              height: "150px",
              border: "1px solid black",
              borderRadius: "5px",
              padding: "10px",
              marginTop: "10px",
            }} rows="4" placeholder="Vui lòng mô tả chi tiết vấn đề bạn gặp phải."></textarea>
          </div>
        </div>
      </FormSubmit>
      <ToolBar />
    </div>
  )
}

export default Home