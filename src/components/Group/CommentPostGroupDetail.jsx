import React, { useEffect, useRef, useState } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import { useSelector } from 'react-redux';
import { useMutation, useQueryClient } from 'react-query';
import TextareaAutosize from 'react-textarea-autosize';
import '../../assets/css/Groups/CommentPostGroupDetail.css'
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

const CommentPostGroupDetail = ({ comment, onUpdateComment, onDeleteComment }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(comment.commentText);
  const user = useSelector((state) => state.auth.user);
  const commentContentRef = useRef(null);
  const editTextareaRef = useRef(null);
  const [isLongComment, setIsLongComment] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const queryClient = useQueryClient();

  useEffect(() => {
    if (commentContentRef.current) {
      setIsLongComment(commentContentRef.current.scrollHeight > commentContentRef.current.clientHeight);
    }
    if (isEditing && editTextareaRef.current) {
      autoResize({ target: editTextareaRef.current }); 
    }
  }, [editedText, isEditing]);

  const autoResize = (e) => {
    e.target.style.height = 'auto';
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  const formatCommentTime = (timeString) => {
    const commentDate = new Date(timeString);
    const now = new Date();

    const isYesterday = now.getDate() - commentDate.getDate() === 1 && now.getMonth() === commentDate.getMonth() && now.getFullYear() === commentDate.getFullYear();

    if (isYesterday) {
      return 'Hôm qua';
    } else {
      return format(commentDate, "dd 'tháng' MM 'lúc' HH:mm", { locale: vi });
    }
  };

  const handleSaveEdit = () => {
    onUpdateComment(comment.postCommentId, editedText);
    setIsEditing(false);
  };

  const handleDeleteComment = () => {
    onDeleteComment(comment.postCommentId);
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
              <Dropdown.Menu className="comment-dropdown-menu">
                <Dropdown.Item onClick={() => setIsEditing(true)}>Sửa bình luận</Dropdown.Item>
                <Dropdown.Item onClick={handleDeleteComment}>Xóa bình luận</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          )}
        </div>
        {isEditing ? (
          <div className='bg'>
            <TextareaAutosize
              ref={editTextareaRef}
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
              className="w-100 mb-2 p-2 rounded-4 edit-textarea"
            />
            <button className="btn btn-success btn-sm" onClick={handleSaveEdit}>Lưu</button>
            <button className="btn btn-secondary btn-sm ms-2" onClick={() => setIsEditing(false)}>Hủy</button>
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
    </div>
  );
};

export default CommentPostGroupDetail;
