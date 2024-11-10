import React, { useEffect, useRef, useState } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import { useSelector } from 'react-redux';
import '../../assets/css/Groups/CommentPostGroupDetail.css'
import { Button, Modal } from 'react-bootstrap';

const CommentPostGroupDetail = ({ comment, onUpdateComment, onDeleteComment }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(comment.commentText);
  const user = useSelector((state) => state.auth.user);
  const commentContentRef = useRef(null);
  const editTextareaRef = useRef(null);
  const [isLongComment, setIsLongComment] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    // Kiểm tra chiều cao của phần tử để xác định nếu bình luận vượt quá 2 dòng
    if (commentContentRef.current) {
      setIsLongComment(commentContentRef.current.scrollHeight > commentContentRef.current.clientHeight);
    }
    if (isEditing && editTextareaRef.current) {
      autoResize({ target: editTextareaRef.current }); // Gọi autoResize khi mở chỉnh sửa
    }
  }, [editedText, isEditing]);

  const autoResize = (e) => {
    e.target.style.height = 'auto';
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  const formatCommentTime = (timeString) => {
    const commentDate = new Date(timeString);
    const now = new Date();

    // Kiểm tra xem có phải là "hôm qua" không
    const isYesterday = (now - commentDate) / (1000 * 60 * 60 * 24) >= 1 && now.getDate() - commentDate.getDate() === 1;

    if (isYesterday) {
      return 'Hôm qua';
    } else {
      const day = String(commentDate.getDate()).padStart(2, '0');
      const month = String(commentDate.getMonth() + 1).padStart(2, '0');
      const hours = String(commentDate.getHours()).padStart(2, '0');
      const minutes = String(commentDate.getMinutes()).padStart(2, '0');
      return `${day} tháng ${month} lúc ${hours}:${minutes}`;
    }
  };

  const handleSaveEdit = () => {
    onUpdateComment(comment.postCommentId, editedText);
    setIsEditing(false);
  };

  const toggleFullComment = () => {
    setIsExpanded(!isExpanded);
  };
  return (
    <div className="d-flex gap-3 w-100 comment-container">
      <img src={comment.commentorAvatar || 'https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg'} alt="avatar comment" width={60} height={60} className='rounded-circle object-fit-cover' />
      <div className='comment-text-info w-100'>
        <div className='d-flex justify-content-between align-items-center'>
          <div className=''>
            <div className='d-flex gap-3 align-items-center'>
              <strong className='commentor_name fw-medium'>{comment.commentor || comment.postCreatorName}</strong>
              <small className='m-0 isEditText'>{comment.isEdited ? 'Đã chỉnh sửa' : ''}</small>
            </div>
            <p className='comment_time fw-medium'>{formatCommentTime(comment.commentTime)}</p>
          </div>
          {(comment.commentedById == user.id) && (
            <Dropdown className="comment-dropdown">
              <Dropdown.Toggle variant="success" id="dropdown-basic_comment" className='border-0 text-black bg-transparent'>
                <ion-icon name="ellipsis-vertical-outline"></ion-icon>
              </Dropdown.Toggle>
              <Dropdown.Menu style={{
                backgroundColor: 'white',
                borderRadius: '10px',
                border: '0px',
                boxShadow: '0px 0px 8px rgba(0,0,0,0.25)',
              }}>
                <Dropdown.Item onClick={() => setIsEditing(true)}>Sửa bình luận</Dropdown.Item>
                <Dropdown.Item onClick={() => setShowDeleteModal(true)}>Xóa bình luận</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          )}
        </div>
        {isEditing ? (
          <div className='bg'>
            <textarea
              ref={editTextareaRef}
              value={editedText}
              onInput={autoResize}
              onChange={(e) => setEditedText(e.target.value)}
              className="w-100 mb-2 p-2 rounded-4"
              style={{ border: '1px solid #d9d9d9', background: '#f9f9f9', height: '100%' }}
            />
            <button className="btn btn-success btn-sm rounded-5" onClick={handleSaveEdit}>Lưu</button>
            <button className="btn btn-secondary btn-sm ms-2 rounded-5" onClick={() => setIsEditing(false)}>Hủy</button>
          </div>
        ) : (
          <div className="comment_content_wrapper">
            <p
              ref={commentContentRef}
              className={`comment_content m-0 ${isExpanded ? 'expanded' : 'm-0'}`}
            >
              {comment.commentText}
            </p>
            {isLongComment && (
              <span className="see_more" onClick={() => setIsExpanded(!isExpanded)}>
                {isExpanded ? 'Thu gọn' : 'Xem thêm'}
              </span>
            )}
          </div>
        )}
      </div>

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered className="custom-modal_deletPostGroup">
        <Modal.Body className="custom-modal-body">
          <div>
            <ion-icon name="warning-outline" style={
              {
                fontSize: '30px',
                color: '#AC0B0B',
              }
            }></ion-icon>
          </div>
          <p className='mb-0 fw-medium text-black'>Bạn có muốn xóa không ?</p>
          <p className='m-0' style={{
            fontSize: '12px',
            color: '#6E6E6E',
          }}>Sau khi xóa bạn không thể hoàn tác</p>
        </Modal.Body>
        <Modal.Footer className='d-flex gap-3 justify-content-center'>
          <Button variant="" onClick={() => setShowDeleteModal(false)}>
            Hủy
          </Button>
          <Button variant="" onClick={() => {
            onDeleteComment(comment.postCommentId);
            setShowDeleteModal(false);
          }}
            className='rounded-5'
            style={{
              background: '#AC0B0B',
              color: '#fff',
            }}>
            Xóa bình luận
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CommentPostGroupDetail;
