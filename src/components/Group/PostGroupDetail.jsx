import React, { useState, useEffect } from 'react';
import CommentPostGroupDetail from './CommentPostGroupDetail';
import '../../assets/css/Groups/PostGroupDetail.css';
import Dropdown from 'react-bootstrap/Dropdown';
import { Button, Modal, Form } from 'react-bootstrap';
import TextareaAutosize from 'react-textarea-autosize';
import ConfirmModal from '../Shared/ConfirmModal';
import FormSubmit from '../Shared/FormSubmit';
import { useSelector } from 'react-redux';
import useApi from '../../hooks/useApi';
import FormModal from '../Shared/FormModal';
import ImageSelector from '../Shared/ImageSelector';
import { storage } from '../../../firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { toast } from 'react-toastify';
import EmojiPicker from 'emoji-picker-react';

const PostGroupDetail = ({ post }) => {
  const group = useSelector(state => state.group.selectedGroup);
  const { useDelete, useUpdate } = useApi(`https://travelmateapp.azurewebsites.net/api/Groups/${group.groupId}/GroupPosts`, `groupPosts-${group.groupId}`);
  const { useFetch: useFetchComments } = useApi(`https://travelmateapp.azurewebsites.net/api/Groups/${group.groupId}/GroupPosts/${post.groupPostId}/PostComments`, `postComments-${post.groupPostId}`);
  const { mutate: deletePost } = useDelete();
  const { mutate: updatePost, isLoading: isSubmitting, isSuccess: isSubmitted } = useUpdate();
  const { data: commentsData } = useFetchComments();
  const { useCreate: useCreateComment } = useApi(`https://travelmateapp.azurewebsites.net/api/Groups/${group.groupId}/GroupPosts/${post.groupPostId}/PostComments`, `postComments-${post.groupPostId}`);
  const { mutate: createComment, isLoading: isCommentSubmitting } = useCreateComment();
  const [commentText, setCommentText] = useState("");

  // State management
  const [comments, setComments] = useState([]);
  const [showComments, setShowComments] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPhotos, setSelectedPhotos] = useState(post.groupPostPhotos.$values.map(photo => photo.photoUrl));
  const [formValues, setFormValues] = useState({ title: post.title, photos: post.groupPostPhotos.$values.map(photo => photo.photoUrl) });
  const [error, setError] = useState(null);
  const user = useSelector(state => state.auth.user);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [visibleComments, setVisibleComments] = useState(5);

  // Comment handling
  const handleShowComments = () => {
    setShowComments(!showComments);
    if (!showComments) {
      useFetchComments();
    }
  };

  const handleLoadMoreComments = () => {
    setVisibleComments(prevCount => prevCount + 5);
  };

  useEffect(() => {
    if (commentsData) {
      setComments(commentsData.$values);
    }
  }, [commentsData]);

  // Post handling
  const handleDeletePost = () => {
    setShowConfirmDelete(true);
  };

  const confirmDeletePost = () => {
    deletePost(post.groupPostId);
    setShowConfirmDelete(false);
    toast.success('Bài viết đã được xóa');
  };

  const handleCloseConfirmDelete = () => {
    setShowConfirmDelete(false);
  };

  const handleEditPost = () => {
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
  };

  // Form handling
  const handleSelectPhotos = (photos) => {
    setSelectedPhotos(photos);
    const photoUrls = photos.map(photo => URL.createObjectURL(photo));
    setFormValues({ ...formValues, photos: photoUrls });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const uploadPhotosToFirebase = async (photos) => {
    const uploadPromises = photos.map(async (photo) => {
      const photoRef = ref(storage, `groupPosts/${group.groupId}/${Date.now()}_${photo.name}`);
      await uploadBytes(photoRef, photo);
      return getDownloadURL(photoRef);
    });
    return Promise.all(uploadPromises);
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const uploadedPhotoUrls = await uploadPhotosToFirebase(selectedPhotos);
      const updatedData = {
        title: formValues.title,
        GroupPostPhotos: uploadedPhotoUrls.map(photoUrl => ({ photoUrl }))
      };
      await updatePost({ id: post.groupPostId, updatedData });
      if (isSubmitted) {
        setFormValues({ ...formValues, photos: uploadedPhotoUrls });
        setShowEditModal(false);
      }
    } catch (error) {
      console.error(error);
      setError(error.message);
    }
  };

  const handleCommentChange = (e) => {
    setCommentText(e.target.value);
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (commentText.trim()) {
      createComment({ commentText });
      setCommentText("");
    }
    toast.success('Bình luận đã được đăng');
  };

  const handleCommentKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleCommentSubmit(e);
    }
  };

  const handleEmojiClick = (emojiObject) => {
    setCommentText(prevText => prevText + emojiObject.emoji);
  };

  return (
    <div className="post mb-3">
      <div className="d-flex align-items-center gap-3">
        <img src={post.postCreatorAvatar || 'https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg'} alt="avatar" width={70} height={70} className="rounded-circle object-fit-cover" />
        <div className="d-flex justify-content-between w-100">
          <div>
            <h5 className="m-0">{post.postCreatorName}</h5>
            <p>{new Date(post.createdTime).toLocaleString()}</p>
          </div>
          {user.id == post.postById && (
             <Dropdown>
             <Dropdown.Toggle variant="success" className="border-0 bg-transparent shadow-none text-black">
               <ion-icon name="ellipsis-vertical-outline"></ion-icon>
             </Dropdown.Toggle>
             <Dropdown.Menu align="end" style={{
                border: 'none',
                boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
                borderRadius: '10px',
             }}>
               <Dropdown.Item className='form_edit_post' onClick={handleEditPost}>
                 Chỉnh sửa bài viết
               </Dropdown.Item>
               <Dropdown.Item onClick={handleDeletePost} style={{
                 fontSize: '16px',
               }}>Xóa bài viết</Dropdown.Item>
             </Dropdown.Menu>
           </Dropdown>
          )}
        </div>
      </div>
      <p className={`mt-3 mb-0 line-clamp-2`}>{post.title}</p>
      <div className="images_post_container mt-3">
        {post.groupPostPhotos.$values.map((photo, index) => (
          <div key={index} className="image-wrapper">
            <img src={photo.photoUrl} className='object-fit-cover' alt="Post image" />
          </div>
        ))}
      </div>
      <div className="d-flex gap-3 mb-3 mt-5">
        <Button
          variant="outline-success"
          className="d-flex gap-2 align-items-center justify-content-center rounded-5"
          onClick={handleShowComments}
        >
          <ion-icon
            name="chatbubble-outline"
            className="icon-large"
          ></ion-icon>
          {comments.length} Bình luận 
        </Button>
        <Button variant="outline-primary" className="d-flex gap-2 align-items-center justify-content-center rounded-5">
          <ion-icon name="share-social-outline" className="icon-large"></ion-icon> Chia sẻ
        </Button>
      </div>
      {showComments && (
        <>
          <hr />
          <div className="comments w-100 mt-3">
            {comments.slice(0, visibleComments).map((comment, index) => (
              <CommentPostGroupDetail
                key={comment.postCommentId}
                comment={comment}
                groupId={group.groupId}
                groupPostId={post.groupPostId}
              />
            ))}
          </div>
          {visibleComments < comments.length && (
            <div className="d-flex justify-content-start my-3">
              <Button variant="" className='rounded-5 py-0 d-flex align-items-center gap-2 button_loadmore_comment' onClick={handleLoadMoreComments}>
                Xem thêm bình luận <ion-icon name="chevron-down-outline" className="icon-medium"></ion-icon>
              </Button>
            </div>
          )}
          <div className="write_comment_container d-flex gap-3 mb-3">
            <img src={user.avatarUrl} alt="avatar" width={50} height={50} className="rounded-circle object-fit-cover" />
            <div className="w-100 container_write_comment">
              <TextareaAutosize
                name="comment"
                className="w-100"
                id="write_comment_area"
                placeholder="Viết bình luận..."
                value={commentText}
                onChange={handleCommentChange}
                onKeyPress={handleCommentKeyPress}
              />
              <div className="d-flex justify-content-between">
                <Button variant="light" className="me-2" onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
                  <ion-icon name="happy-outline" className="icon-medium"></ion-icon>
                </Button>
                <Button
                  variant=""
                  className={`rounded-5 button_send_comment p-0 ${isCommentSubmitting ? 'disabled' : ''}`}
                  onClick={handleCommentSubmit}
                >
                  <ion-icon name="send" className="icon-medium text-muted"></ion-icon>
                </Button>
              </div>
              {showEmojiPicker && (
                <div className="emoji-picker-container">
                  <EmojiPicker onEmojiClick={handleEmojiClick} />
                </div>
              )}
            </div>
          </div>
        </>
      )}
      <Modal show={false} centered className="transparent-modal">
        <Modal.Body>
          <div className="modal-images-container">
            <img src='' className='object-fit-cover' alt="Post image" />
          </div>
        </Modal.Body>
      </Modal>
      <ConfirmModal
        show={showConfirmDelete}
        title="Bạn có muốn xóa không?"
        message="Bài viết sẽ bị xóa vĩnh viễn"
        onConfirm={confirmDeletePost}
        onHide={handleCloseConfirmDelete}
      />
      <FormModal
        show={showEditModal}
        handleClose={handleCloseEditModal}
        title="Chỉnh sửa bài viết"
        saveButtonText="Lưu"
        handleSave={handleSubmitEdit}
        isSubmitting={isSubmitting}
      >
        {error && <div className="alert alert-danger">{error}</div>}
        <Form.Group controlId="formTitle">
          <Form.Label>Nội dung</Form.Label>
          <Form.Control type="text" name="title" value={formValues.title} onChange={handleInputChange} />
        </Form.Group>
        <Form.Group controlId="formContent">
          <Form.Label>Ảnh bài viết</Form.Label>
          <ImageSelector multiple={true} onSelect={handleSelectPhotos} selectedPhotos={formValues.photos} />
          <div className="mt-3">
            {formValues.photos.map((photoUrl, index) => (
              <img key={index} src={photoUrl} alt="Uploaded" className="img-thumbnail" />
            ))}
          </div>
        </Form.Group>
      </FormModal>
    </div>
  );
};

export default PostGroupDetail;
