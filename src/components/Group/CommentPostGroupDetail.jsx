import React from 'react';
import '../../assets/css/Groups/CommentPostGroupDetail.css'
function CommentPostGroupDetail({ comment }) {
  // Format the commentTime
  const formatDate = (dateString) => {
    const commentDate = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    // Check if the comment was posted yesterday
    if (
      commentDate.getDate() === yesterday.getDate() &&
      commentDate.getMonth() === yesterday.getMonth() &&
      commentDate.getFullYear() === yesterday.getFullYear()
    ) {
      return 'Hôm qua';
    }

    // Otherwise, display in "4 November 2024, 07:45" format
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
        <div className='d-flex align-items-center' style={{
          gap: '15px'
        }}>
          <strong style={{ fontSize: '16px' }}>{comment.name}</strong>
          <p className='m-0' style={{ fontSize: '12px' }}>{formatDate(comment.commentTime)}</p>
        </div>
        <p className='m-0' style={{ fontSize: '16px' }}>{comment.commentText}</p>
      </div>
    </div>
  );
}

export default CommentPostGroupDetail;
