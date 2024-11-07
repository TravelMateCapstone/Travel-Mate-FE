import React, { useState } from 'react';
import '../../assets/css/Groups/CommentPostGroupDetail.css';
import { Button, Dropdown } from 'react-bootstrap';
import { useSelector } from 'react-redux';

function CommentPostGroupDetail({ comment, onEditComment }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedComment, setEditedComment] = useState(comment.commentText);
  const user = useSelector((state) => state.auth.user);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleEditChange = (e) => {
    setEditedComment(e.target.value);
  };

  const handleEditSubmit = () => {
    onEditComment(comment.commentId, editedComment);
    setIsEditing(false);
  };

  const formatDate = (dateString) => {
    const commentDate = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    if (
      commentDate.getDate() === yesterday.getDate() &&
      commentDate.getMonth() === yesterday.getMonth() &&
      commentDate.getFullYear() === yesterday.getFullYear()
    ) {
      return 'Hôm qua';
    }

    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return commentDate.toLocaleDateString('vi-VN', options);
  };
  return (
    <div className='comment-post-group-detail-container' style={{
      display: 'flex',
      gap: '10px',
      width: '100%',
      borderRadius: '20px',
      marginBottom: '30px',
    }}>
      <img src={comment.avatar || 'https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg'} alt="avatar" style={{
        width: '60px',
        height: '60px',
        objectFit: 'cover',
        borderRadius: '50%'
      }} />

      <div style={{ width: '100%' }}>
        <div className='d-flex align-items-center justify-content-between' style={{ gap: '15px' }}>
          <div className='d-flex align-items-center' style={{ gap: '15px' }}>
            <strong style={{ fontSize: '16px' }}>{comment.name || 'Không xác định'}</strong>
            <p className='m-0' style={{ fontSize: '12px', color: '#E65C00', fontWeight: 'bold' }}>{formatDate(comment.commentTime)}</p>
            {comment.isEdited && (
              <span style={{ fontSize: '12px', fontWeight: 'bold' }}>• Đã chỉnh sửa</span>
            )}
          </div>
          {!isEditing && (
            <Dropdown>
              <Dropdown.Toggle variant="secondary" id="dropdown-basic" size="sm" className='bg-transparent border-0'>
                <ion-icon name="ellipsis-vertical-outline"></ion-icon>
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item onClick={handleEditToggle}>Chỉnh sửa</Dropdown.Item>
                <Dropdown.Item>Xóa</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          )}
        </div>
        {isEditing ? (
          <div>
            <textarea
              value={editedComment}
              onChange={handleEditChange}
              style={{ fontSize: '16px', width: '100%',  outline: 'none', resize: 'none', borderRadius: '10px', padding: '10px' }}
            />
            <Button onClick={handleEditSubmit}>Lưu</Button>
          </div>
        ) : (
          <p className='m-0' style={{ fontSize: '16px', wordBreak: 'break-word' }}>{comment.commentText}</p>
        )}
      </div>
    </div>
  );
}

export default CommentPostGroupDetail;
