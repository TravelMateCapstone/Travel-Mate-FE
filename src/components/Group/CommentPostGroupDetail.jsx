import React, { useState } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import { useSelector } from 'react-redux';
import useApi from '../../hooks/useApi';
import { Button } from 'react-bootstrap';
import TextareaAutosize from 'react-textarea-autosize';
import { toast } from 'react-toastify';

const CommentPostGroupDetail = ({ comment, groupId, groupPostId }) => {
  const user = useSelector(state => state.auth.user);
  const { useUpdate, useDelete } = useApi(`https://travelmateapp.azurewebsites.net/api/Groups/${groupId}/GroupPosts/${groupPostId}/PostComments`, `postComments-${groupPostId}`);
  const { mutate: updateComment } = useUpdate();
  const { mutate: deleteComment } = useDelete();
  const [isEditing, setIsEditing] = useState(false);
  const [editedComment, setEditedComment] = useState(comment.commentText);

  const handleEditComment = () => {
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    updateComment({ id: comment.postCommentId, updatedData: { commentText: editedComment } });
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditedComment(comment.commentText);
    setIsEditing(false);
  };

  const handleDeleteComment = () => {
    deleteComment(comment.postCommentId);
    toast.success('Xóa bình luận thành công');
  };

  return (
    <div className="d-flex ">
      <div className='d-flex gap-3 w-100 comment-container'>
        <img src={comment.commentorAvatar || 'https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg'} alt="avatar comment" width={60} height={60} className='rounded-circle object-fit-cover' />
        <div className='comment-text-info w-100'>
          <div className='d-flex justify-content-between align-items-center'>
            <div className=''>
              <div className='d-flex gap-3 align-items-center'>
                <strong className='commentor_name fw-medium'>{comment.commentor || comment.postCreatorName}</strong>
                <small className='m-0 isEditText'>{comment.isEdited ? 'Đã chỉnh sửa' : ''}</small>
              </div>
              <p className='comment_time fw-medium'>{new Date(comment.commentTime).toLocaleString()}</p>
            </div>
          </div>
          <div className="comment_content_wrapper">
            {isEditing ? (
              <>
                <TextareaAutosize
                  value={editedComment}
                  onChange={(e) => setEditedComment(e.target.value)}
                  className='w-100 rounded-3 p-2'
                />
                <div className='d-flex gap-2 align-items-center'>
                  <Button size='sm' onClick={handleSaveEdit}>Lưu</Button>
                  <Button size='sm' variant="secondary" onClick={handleCancelEdit}>Hủy</Button>
                </div>
              </>
            ) : (
              <p className='comment_content m-0'>
                {comment.commentText}
              </p>
            )}
          </div>
        </div>
      </div>
      {user.id == comment.commentedById && (
        <Dropdown>
        <Dropdown.Toggle variant="" className='d-flex justify-content-center align-items-center'>
          <ion-icon name="ellipsis-vertical-outline"></ion-icon>
        </Dropdown.Toggle>
        <Dropdown.Menu style={{ border: 'none', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)', borderRadius: '10px' }}>
          <Dropdown.Item className='form_edit_group' onClick={handleEditComment}>Chỉnh sửa bình luận</Dropdown.Item>
          <Dropdown.Item onClick={handleDeleteComment}>Xóa bình luận</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
      )}
    </div>
  );
};

export default CommentPostGroupDetail;
