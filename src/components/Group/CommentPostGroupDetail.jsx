import React, { useState } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import { useSelector } from 'react-redux';

const CommentPostGroupDetail = ({ comment, onUpdateComment, onDeleteComment }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(comment.commentText);
  const user = useSelector((state) => state.auth.user);
  console.log(user);
  
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

  return (
    <div className="d-flex gap-2 w-100">
      <img src={comment.commentorAvatar || 'https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg'} alt="avatar comment" width={60} height={60} className='rounded-circle' />
      <div className='comment-text-info w-100'>
        <div className='d-flex justify-content-between align-items-center'>
          <div className='d-flex gap-2'>
            <strong>{comment.commentor || comment.postCreatorName}</strong>
            <p className='m-0 text-danger'>{formatCommentTime(comment.commentTime)}</p>
            <small className='m-0'>{comment.isEdited ? 'Đã chỉnh sửa': ''}</small>
          </div>
          {(comment.commentedById == user.id) && (
            <Dropdown>
            <Dropdown.Toggle variant="success" id="dropdown-basic" className='border-0 bg-transparent'>
              <ion-icon name="ellipsis-vertical-outline"></ion-icon>
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => setIsEditing(true)}>Sửa bình luận</Dropdown.Item>
              <Dropdown.Item onClick={() => onDeleteComment(comment.postCommentId)}>Xóa bình luận</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          )}
        </div>
        {isEditing ? (
          <div>
            <textarea
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
              className="form-control mb-2"
            />
            <button className="btn btn-success btn-sm" onClick={handleSaveEdit}>Lưu</button>
            <button className="btn btn-secondary btn-sm ms-2" onClick={() => setIsEditing(false)}>Hủy</button>
          </div>
        ) : (
          <p className='p-0'>{comment.commentText}</p>
        )}
      </div>
    </div>
  );
};

export default CommentPostGroupDetail;
