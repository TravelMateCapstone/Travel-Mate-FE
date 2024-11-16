import React, { useEffect, useState, useCallback } from 'react';
import { Button } from 'react-bootstrap';
import Modal from 'react-modal';
import { useDispatch, useSelector } from 'react-redux';
import { openLoginModal } from '../../redux/actions/modalActions';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useLocation } from 'react-router-dom';
import RoutePath from '../../routes/RoutePath';
import '../../assets/css/Shared/FormSubmit.css';
// Đặt vị trí modal vào root của ứng dụng để đảm bảo nó hiển thị chính xác
Modal.setAppElement('#root');

const FormSubmit = React.memo(({ children, buttonText, onButtonClick, title, openModalText, needAuthorize, autoOpen }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token); // Get token from Redux store
  const isGroupEditModalOpen = useSelector((state) => state.modal.isGroupEditModalOpen);
  const location = useLocation();

  const openModal = useCallback(() => {
    // Check if authorization is needed
    if (needAuthorize && !token) {
      dispatch(openLoginModal()); // Open login modal if not authenticated
      toast.warning('Vui lòng đăng nhập để tiếp tục sử dụng tính năng này.');
      return;
    }
    setIsOpen(true);
  }, [needAuthorize, token, dispatch]);

  useEffect(() => {
    if (autoOpen) {
      openModal();
    }
  }, [autoOpen, openModal]);
  const closeModal = useCallback(() => setIsOpen(false), []);
  return (
    <div>
      {(location.pathname === RoutePath.GROUP || location.pathname === RoutePath.GROUP_CREATED || location.pathname === RoutePath.GROUP_JOINED) ? (
        <Button
          onClick={openModal}
          variant='success'
          className='rounded-5 d-flex gap-1 mybuttonCreateGroup'
          style={{
            height: '40px',
            width: 'fit-content',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            background: '#34A853',
            border: '1px solid #34A853',
          }}
        >
          <p className='m-0'>Tạo nhóm</p>
          <ion-icon name="add-circle" style={{ fontSize: '20px' }}></ion-icon>
        </Button>
      ) : (location.pathname === RoutePath.EVENT || location.pathname === RoutePath.EVENT_JOINED || location.pathname === RoutePath.EVENT_CREATED) ? (
        // Trường hợp Tạo sự kiện
        <Button
          onClick={openModal}
          variant='primary'
          className='rounded-5 d-flex gap-1 mybuttonCreateEvent'
          style={{
            height: '40px',
            width: 'fit-content',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            background: '#34A853',
            border: '1px solid #34A853',
          }}
        >
          <p className='m-0'>Tạo sự kiện</p>
          <ion-icon name="add-circle" style={{ fontSize: '20px' }}></ion-icon>
        </Button>
      ) : (
        <Button onClick={openModal} variant='outline-dark' className='w-100 rounded-5 mybutton'>
          {openModalText}
        </Button>
      )}
      <Modal
        isOpen={isOpen || isGroupEditModalOpen}
        onRequestClose={closeModal}
        contentLabel="Form Submit Modal"
        style={{
          overlay: { backgroundColor: 'rgba(0, 0, 0, 0.5)' },
          content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            padding: '30px 70px',
            borderRadius: '20px',
            width: '1000px', // Increased width
            height: '84%', // Full viewport height
            position: 'relative',
            display: 'flex',
            flexDirection: 'column', // Thêm dòng này để sắp xếp các phần của modal theo chiều dọc
          },
        }}
      >
        {/* Tiêu đề của form, được truyền qua prop title */}
        <h2 className='text-center mb-4 fw-bolder'>{title}</h2>

        {/* Phần nội dung con được truyền vào component */}
        <div style={{
          overflowY: 'auto',  // Kích hoạt cuộn dọc nếu nội dung quá dài
          flex: '1', // Chiếm toàn bộ chiều cao còn lại của modal
          paddingBottom: '20px',
        }}>
          {children}
        </div>

        {/* Container chứa các nút hành động, cố định ở dưới cùng */}
        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          marginTop: '20px',
          position: 'sticky',
          bottom: '0',
          background: '#fff',
          padding: '10px 0', // Thêm padding để tách biệt với nội dung cuộn
        }}>
          {/* Nút truyền vào */}
          <Button onClick={onButtonClick} style={{ marginRight: '10px', background: '#007931' }} className='rounded-5 border-0 fw-medium'>
            {buttonText}
          </Button>
          {/* Nút đóng modal */}
          <Button variant='outline-dark' onClick={closeModal} className='rounded-5 fw-medium'>
            Hủy
          </Button>
        </div>
      </Modal>

    </div>
  );
});

export default FormSubmit;
