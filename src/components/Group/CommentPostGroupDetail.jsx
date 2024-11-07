import React, { useState } from 'react';
import '../../assets/css/Groups/CommentPostGroupDetail.css';

function CommentPostGroupDetail({ comment, onEditComment }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedComment, setEditedComment] = useState(comment.commentText);

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
      width: '810px',
      borderRadius: '20px',
      marginBottom: '30px'
    }}>
      <img src={comment.avatar} alt="avatar" style={{
        width: '60px',
        height: '60px',
        objectFit: 'cover',
        borderRadius: '50%'
      }} />

      <div>
        <div className='d-flex align-items-center' style={{ gap: '15px' }}>
          <strong style={{ fontSize: '16px' }}>{comment.name}</strong>
          <p className='m-0' style={{ fontSize: '12px' }}>{formatDate(comment.commentTime)}</p>
          {comment.isEdited && (
            <span style={{ fontSize: '12px', color: '#888', marginLeft: '10px' }}>đã chỉnh sửa</span>
          )}
          {!isEditing && (
            <button onClick={handleEditToggle} style={{ fontSize: '12px' }}>Edit</button>
          )}
        </div>
        {isEditing ? (
          <div>
            <textarea
              value={editedComment}
              onChange={handleEditChange}
              style={{ fontSize: '16px', width: '100%' }}
            />
            <button onClick={handleEditSubmit}>Save</button>
          </div>
        ) : (
          <p className='m-0' style={{ fontSize: '16px' }}>{comment.commentText}</p>
        )}
      </div>
    </div>
  );
}

export default CommentPostGroupDetail;
