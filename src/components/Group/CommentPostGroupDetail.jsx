import React from 'react';
import '../../assets/css/Groups/CommentPostGroupDetail.css'
function CommentPostGroupDetail({ comment }) {
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
          <p className='m-0' style={{ fontSize: '12px' }}>{comment.location}</p>
        </div>
        <p className='m-0' style={{ fontSize: '16px' }}>{comment.content}</p>
      </div>
    </div>
  );
}

export default CommentPostGroupDetail;
