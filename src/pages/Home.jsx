import SearchBar from '../components/Shared/SearchBar'
import ToolBar from '../components/Shared/ToolBar'
import SidebarList from '../components/Shared/SidebarList';
import ImageUploadModal from '../components/Profile/ImageUploadModal'
import React, { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
function Home() {
  const sidebarItems = [
    { iconName: 'home', title: 'Trang Chủ', route: '/' },
    { iconName: 'add-circle', title: 'Thêm', route: '/add' },
    { iconName: 'people', title: 'Người Dùng', route: '/people' },
    { iconName: 'calendar', title: 'Lịch', route: '/calendar' },
    { iconName: 'car', title: 'Xe Hơi', route: '/car' },
    { iconName: 'wallet', title: 'Ví', route: '/wallet' }
  ];
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleDone = (data) => {
    if (data.file) {
      const imageUrl = URL.createObjectURL(data.file);
      setUploadedImage(imageUrl);
    } else if (data.url) {
      setUploadedImage(data.url);
    }
  };
  return (
    <div>
      Home
      <ToolBar />
      {/* Nút để mở modal ở đây */}
      <div className="text-center mb-5">
        <button className="btn btn-primary" onClick={openModal}>
          Thêm hình ảnh
        </button>
      </div>

      {/* Modal upload ảnh */}
      <ImageUploadModal isOpen={isModalOpen} onClose={closeModal} onDone={handleDone} />

      {/* Hiển thị hình ảnh đã upload */}
      {uploadedImage && (
        <div className="text-center">
          <h5>Hình ảnh đã tải lên:</h5>
          <img src={uploadedImage} alt="Uploaded" style={{ maxWidth: "100%", height: 'auto', borderRadius: '10px' }} />
        </div>
      )}
    </div>
  )
}

export default Home