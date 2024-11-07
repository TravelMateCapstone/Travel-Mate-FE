import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import Modal from 'react-modal';
import { useDispatch, useSelector } from 'react-redux';
import { openLoginModal } from '../../redux/actions/modalActions';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Đặt vị trí modal vào root của ứng dụng để đảm bảo nó hiển thị chính xác
Modal.setAppElement('#root');

function FormSubmit({ children, buttonText, onButtonClick, title, openModalText, needAuthorize, autoOpen,  }) {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token); // Get token from Redux store
  const isGroupEditModalOpen = useSelector((state) => state.modal.isGroupEditModalOpen);

  
  
  const openModal = () => {
    // Check if authorization is needed
    if (needAuthorize && !token) {
      dispatch(openLoginModal()); // Open login modal if not authenticated
      toast.warning('Vui lòng đăng nhập để tiếp tục sử dụng tính năng này.');
      return;
    }
    setIsOpen(true);
  };
  useEffect(() => {
    // Nếu autoOpen là true, mở modal ngay lập tức
    if (autoOpen) {
      openModal();
    }
  }, [autoOpen]);
  const closeModal = () => setIsOpen(false);

  return (
    <div>
      {/* Nút mở modal */}
      <Button onClick={openModal} variant='outline-dark' className='w-100 rounded-5 mybutton'>{openModalText}</Button>

      {/* React Modal */}
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
            width: '897px',
            maxHeight: '80vh',
            position: 'relative',
          },
        }}
      >
        {/* Tiêu đề của form, được truyền qua prop title */}
        <h2 className='text-center mb-4 fw-bolder'>{title}</h2>

        {/* Phần nội dung con được truyền vào component */}
        <div>{children}</div>

        {/* Container chứa các nút hành động, đặt ở dưới cùng bên phải */}
        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          marginTop: '20px',
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
}

export default FormSubmit;
