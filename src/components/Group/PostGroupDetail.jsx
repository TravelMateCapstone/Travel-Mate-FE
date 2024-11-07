import React, { useEffect, useState } from 'react';
import CommentPostGroupDetail from './CommentPostGroupDetail';
import { Button, Dropdown, Form, Modal, Placeholder } from 'react-bootstrap';
import '../../assets/css/Groups/PostGroupDetail.css';
import FormSubmit from '../Shared/FormSubmit';
import EmojiPicker from 'emoji-picker-react';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '../../../firebaseConfig';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

function PostGroupDetail({ postDetails, groupId }) {
  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.auth.user);
  const [visibleComments, setVisibleComments] = useState(2);
  const [filePlaceholders, setFilePlaceholders] = useState([]);
  const [tempImageUrls, setTempImageUrls] = useState([]);
  const [showComments, setShowComments] = useState(false);
  const [comment, setComment] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedUrls, setUploadedUrls] = useState([]);
  const [errors, setErrors] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [modalImages, setModalImages] = useState([]);
  const [comments, setComments] = useState([]);
  const [title, setTitle] = useState('');
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [loadingMoreComments, setLoadingMoreComments] = useState(false);
  const triggerFileInput = () => document.getElementById('fileInputPostGroup').click();
 
  const formatDateTime = (dateString) => {
    if (!dateString) {
      return 'Ngày không xác định';
    }
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return 'Ngày không xác định';
    }
    
    return format(date, "dd 'tháng' MM 'lúc' HH:mm", { locale: vi });
  };
  
  const handleEditComment = async (commentId, newCommentText) => {
    try {
      await axios.put(
        `https://travelmateapp.azurewebsites.net/api/Groups/${groupId}/GroupPosts/${postDetails.postId}/PostComments/${commentId}`,
        { commentText: newCommentText },
        { headers: { Authorization: `${token}` } }
      );
      setComments((prev) => prev.map((c) => (c.commentId === commentId ? { ...c, commentText: newCommentText } : c)));
      toast.success('Bình luận đã được cập nhật');
    } catch {
      toast.error('Có lỗi xảy ra khi cập nhật bình luận');
    }
  };
  useEffect(() => {
    if (postDetails) {
      setTitle(postDetails.title);
      setUploadedUrls(postDetails.postPhotos?.$values || []);
    }
  }, [postDetails]);
  const fetchComments = async (loadMore = false) => {
    loadMore ? setLoadingMoreComments(true) : setIsLoadingComments(true);
    try {
      const response = await axios.get(
        `https://travelmateapp.azurewebsites.net/api/Groups/${groupId}/GroupPosts/${postDetails.postId}/PostComments`,
        { headers: { Authorization: `${token}` } }
      );
      setComments(response.data.$values || []);
    } catch {
      toast.error('Có lỗi xảy ra khi tải bình luận');
    } finally {
      loadMore ? setLoadingMoreComments(false) : setIsLoadingComments(false);
    }
  };
  const handleViewImage = (urls) => {
    setModalImages(Array.isArray(urls) ? urls : [urls]);
    setShowModal(true);
  };
  const handleShowMore = () => {
    setVisibleComments((prev) => prev + 2);
    fetchComments(true);
  };
  const handelEditPostDetail = async () => {
    try {
      await axios.put(
        `https://travelmateapp.azurewebsites.net/api/groups/${groupId}/groupposts/${postDetails.postId}`,
        { title, postPhotos: uploadedUrls.map((url) => ({ photoUrl: url })) },
        { headers: { Authorization: `${token}` } }
      );
      toast.success('Bài viết đã được cập nhật thành công');
    } catch {
      toast.error('Có lỗi xảy ra khi cập nhật bài viết');
    }
  };
  const handleEmojiClick = (emoji) => setComment((prev) => prev + emoji.emoji);
  const handleDeleteImage = async (index) => {
    try {
      await deleteObject(ref(storage, `images/${selectedFiles[index].name}`));
      setUploadedUrls((prev) => prev.filter((_, i) => i !== index));
      toast.success('Ảnh đã được xóa thành công');
    } catch {
      toast.error('Lỗi khi xóa ảnh');
    }
  };
  const handleFileSelect = async (event) => {
    const files = Array.from(event.target.files);
    if (files.length > 0) {
      setIsUploading(true);
      const newUploadedUrls = [];
      for (const file of files) {
        const storageRef = ref(storage, `images/${file.name}`);
        await uploadBytes(storageRef, file);
        newUploadedUrls.push(await getDownloadURL(storageRef));
      }
      setUploadedUrls((prev) => [...prev, ...newUploadedUrls]);
      setIsUploading(false);
      toast.success('Tất cả ảnh đã được tải lên thành công');
    }
  };
  const handleCommentSubmit = async () => {
    if (!comment.trim()) return toast.error('Vui lòng nhập bình luận');
    try {
      const response = await axios.post(
        `https://travelmateapp.azurewebsites.net/api/Groups/${groupId}/GroupPosts/${postDetails.postId}/PostComments`,
        { commentText: comment },
        { headers: { Authorization: `${token}` } }
      );
      setComments((prev) => [response.data, ...prev]);
      setComment('');
      toast.success('Bình luận đã được thêm');
    } catch {
      toast.error('Có lỗi xảy ra khi thêm bình luận');
    }
  };

  const toggleComments = () => {
    setShowComments((prev) => !prev);
    if (!showComments) fetchComments();
  };

  const handleDeletePost = async () => {
    try {
      await axios.delete(
        `https://travelmateapp.azurewebsites.net/api/groups/${groupId}/groupposts/${postDetails.postId}`,
        { headers: { Authorization: `${token}` } }
      );
      toast.success('Bài viết đã được xóa thành công');
    } catch {
      toast.error('Có lỗi xảy ra khi xóa bài viết');
    }
  };
  const capitalizeName = (name) => {
    if (!name) return 'Người dùng ẩn danh';
    return name
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };
  
  return (
    <div className='post-group-detail-container' style={{
      borderBottom: '1px solid #d9d9d9',
      margin: '20px 0'
    }}>
      <div className='d-flex justify-content-between'>
        <div className='d-flex gap-4 mb-2'>
          <img className='rounded-circle' width={72} height={72} src={postDetails.postCreatorAvatar || 'https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg'} alt="avatar" />
          <div>
            <strong className='postCreatorName'>{capitalizeName(postDetails.postCreatorName)}</strong>
            <p className='fw-medium post-createdTime'>{formatDateTime(postDetails.createdTime)}</p>
          </div>
        </div>
        {(postDetails.postCreatorName === user.username) && (
          <Dropdown className='post-dropdown'>
            <Dropdown.Toggle variant="link" id="dropdown-basic" className='border-0 bg-transparent'>
              <ion-icon name="ellipsis-vertical-outline"></ion-icon>
            </Dropdown.Toggle>
            <Dropdown.Menu align="end" className='post-dropdown-menu'>
              <Dropdown.Item>
                <FormSubmit buttonText={'Lưu thay đổi'} title={'Chỉnh sửa bài viết'} openModalText={'Chỉnh sửa'} onButtonClick={handelEditPostDetail}>
                  <textarea
                    placeholder='Nhập nội dung'
                    className='textarea-edit-modal border-1 p-2 w-100'
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    onKeyDown={(e) => e.stopPropagation()}
                  />
                  <Form.Group id="groupImage">
                    <Button className='button-uploadImage-edit-modal' variant="" onClick={triggerFileInput}>
                      Nhấn vào đây để <p className='m-0 text-primary'>upload</p>
                    </Button>
                    <Form.Control type="file" id="fileInputPostGroup" onClick={(e) => e.stopPropagation()} onChange={handleFileSelect} className="d-none" multiple />
                    {isUploading && <Placeholder as="div" animation="glow" className='d-flex flex-wrap gap-2 mt-3'>{filePlaceholders.map((_, index) => (<Placeholder key={index} xs={12} style={{ width: '245px', height: '180px', borderRadius: '10px' }} />))}</Placeholder>}
                    <div className='container-image-upload gap-2 mt-3'>
                      {uploadedUrls.map((url, index) => (
                        <div key={index} className='position-relative'>
                          <img src={url} alt="Ảnh bìa nhóm" className="group-image-edit-modal " />
                          <div onMouseEnter={(e) => { e.currentTarget.style.opacity = '1'; }} onMouseLeave={(e) => { e.currentTarget.style.opacity = '0'; }} className='position-absolute container-action-image d-flex gap-4'>
                            <ion-icon name="eye-outline" style={{ fontSize: '30px', color: 'white' }} onClick={() => handleViewImage(url)}></ion-icon>
                            <ion-icon name="trash-outline" style={{ fontSize: '30px', color: 'white' }} onClick={() => handleDeleteImage(index)}></ion-icon>
                          </div>
                        </div>
                      ))}
                    </div>
                    {errors.groupImageUrl && <div>{errors.groupImageUrl}</div>}
                  </Form.Group>
                </FormSubmit>
              </Dropdown.Item>
              <Dropdown.Item onClick={handleDeletePost}>Xóa</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        )}
      </div>
      <p className='post-content fw-medium'>{postDetails.title}</p>
      <div style={{ border: postDetails.postPhotos?.$values?.length ? '1px solid #d9d9d9' : 'none', padding: postDetails.postPhotos?.$values?.length ? '15px' : 'none', borderRadius: '10px' }}>
        <div className={`image-grid ${postDetails.postPhotos?.$values?.length === 1 ? 'one-image' : postDetails.postPhotos?.$values?.length === 2 ? 'two-images' : postDetails.postPhotos?.$values?.length === 3 ? 'three-images' : postDetails.postPhotos?.$values?.length === 4 ? 'four-images' : 'five-or-more-images'}`}>
          {(postDetails.postPhotos?.$values || []).slice(0, 4).map((img, index) => (
            <div key={index} className={index === 3 && postDetails.postPhotos?.$values.length > 4 ? 'more-images-overlay' : ''} data-more={index === 3 && postDetails.postPhotos?.$values.length > 4 ? `+${postDetails.postPhotos?.$values.length - 4}` : ''} onClick={() => { if (index === 3 && postDetails.postPhotos?.$values.length > 4) { handleViewImage(postDetails.postPhotos?.$values); } else { handleViewImage(img); } }}>
              <img src={img} alt="địa điểm" className={postDetails.postPhotos?.$values.length === 3 && index === 0 ? 'large-image' : ''} />
            </div>
          ))}
        </div>
      </div>
      <div className='my-4 d-flex gap-3'>
        <ion-icon name="chatbubble-outline" style={{ border: '2px solid black', borderRadius: '50%', fontSize: '20px', padding: '10px' }} onClick={toggleComments}></ion-icon>
        <ion-icon name="share-social-outline" style={{ border: '2px solid black', borderRadius: '50%', fontSize: '20px', padding: '10px' }}></ion-icon>
      </div>
      {showComments && (
        <>
          {isLoadingComments ? ([...Array(2)].map((_, index) => (
            <div key={index} className="comment-post-group-detail-container" style={{ display: 'flex', gap: '10px', width: '810px', borderRadius: '20px', marginBottom: '30px' }}>
              <Placeholder as="div" animation="glow" style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: '#f0f0f0' }} />
              <div style={{ width: '100%' }}>
                <Placeholder as="div" animation="glow" style={{ marginBottom: '5px' }}>
                  <Placeholder xs={4} style={{ height: '16px', borderRadius: '4px' }} />
                  <Placeholder xs={2} style={{ height: '12px', borderRadius: '4px', marginLeft: '10px' }} />
                </Placeholder>
                <Placeholder as="div" animation="glow">
                  <Placeholder xs={10} style={{ height: '12px', borderRadius: '4px', marginBottom: '4px' }} />
                  <Placeholder xs={8} style={{ height: '12px', borderRadius: '4px', marginBottom: '4px' }} />
                </Placeholder>
              </div>
            </div>
          ))) : (comments.slice(0, visibleComments).map((comment) => (
            <CommentPostGroupDetail key={comment.commentId} comment={comment} onEditComment={handleEditComment} />
          )))}
          {loadingMoreComments && ([...Array(2)].map((_, index) => (
            <div key={index} className="comment-post-group-detail-container" style={{ display: 'flex', gap: '10px', width: '810px', borderRadius: '20px', marginBottom: '30px' }}>
              <Placeholder as="div" animation="glow" style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: '#f0f0f0' }} />
              <div style={{ width: '100%' }}>
                <Placeholder as="div" animation="glow" style={{ marginBottom: '5px' }}>
                  <Placeholder xs={4} style={{ height: '16px', borderRadius: '4px' }} />
                  <Placeholder xs={2} style={{ height: '12px', borderRadius: '4px', marginLeft: '10px' }} />
                </Placeholder>
                <Placeholder as="div" animation="glow">
                  <Placeholder xs={10} style={{ height: '12px', borderRadius: '4px', marginBottom: '4px' }} />
                  <Placeholder xs={8} style={{ height: '12px', borderRadius: '4px', marginBottom: '4px' }} />
                </Placeholder>
              </div>
            </div>
          )))}
          {visibleComments < comments.length && (<Button onClick={handleShowMore} variant='' className='my-2 d-flex align-items-center gap-2'>Tải thêm các bình luận <ion-icon name="chevron-down-outline"></ion-icon></Button>)}
          <div className='d-flex gap-3'>
            <img src="https://cdn.oneesports.vn/cdn-data/sites/4/2024/01/Zed_38.jpg" alt="" width={60} height={60} className='rounded-circle' />
            <div className='w-100'>
              <p className='mb-2 name-comment-type'>Nhơn Trần</p>
              <div>
                <div style={{
                  border: '1px solid #d9d9d9',
                  borderRadius: '20px',
                }}><textarea placeholder='Nhập bình luận' value={comment} onChange={(e) => setComment(e.target.value)} id='giftMessage' className='w-100 textarea-comment' /></div>
                <div className='d-flex justify-content-end gap-3 mb-3' style={{
                  borderTop: '1px solid #d9d9d9',
                }}>
                  <Button variant='' onClick={() => setShowEmojiPicker(!showEmojiPicker)}><ion-icon name="happy-outline"></ion-icon></Button>
                  <Button variant="primary" onClick={handleCommentSubmit}>Bình luận</Button>
                </div>
              </div>
              {showEmojiPicker && <div className='position-relative'><EmojiPicker onEmojiClick={handleEmojiClick} /></div>}
            </div>
          </div>

        </>
      )}
      <Modal show={showModal} onRequestClose={() => setShowModal(false)} shouldCloseOnOverlayClick={true} onHide={() => setShowModal(false)} centered backdrop={false} dialogClassName="transparent-modal">
        <div onClick={() => setShowModal(false)}>
          <div>{modalImages.map((imageUrl, index) => (<img key={index} src={imageUrl} alt={`Ảnh ${index + 1}`} />))}</div>
        </div>
      </Modal>
    </div>
  );
}
export default PostGroupDetail;