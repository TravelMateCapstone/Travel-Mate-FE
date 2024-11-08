import React, { useEffect, useState } from 'react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import CommentPostGroupDetail from './CommentPostGroupDetail';
import '../../assets/css/Groups/PostGroupDetail.css';
import Dropdown from 'react-bootstrap/Dropdown';
import { Button } from 'react-bootstrap';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import FormSubmit from '../Shared/FormSubmit';
import { storage } from '../../../firebaseConfig';

const PostGroupDetail = ({ post, onDelete, fetchPosts }) => {
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [newTitle, setNewTitle] = useState(post.title);

  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.auth.user);
  const groupDataRedux = useSelector((state) => state.group.selectedGroup);

  useEffect(() => {
    if (post.postPhotos && post.postPhotos.$values) setUploadedImages(post.postPhotos.$values);
    if (showComments) fetchComments();
  }, [post, showComments]);

  const handleToggleComments = () => setShowComments(!showComments);

  const fetchComments = async () => {
    try {
      const response = await axios.get(
        `https://travelmateapp.azurewebsites.net/api/groups/${groupDataRedux.id}/groupposts/${post.postId}/postcomments`,
        { headers: { Authorization: `${token}` } }
      );
      setComments(response.data.$values);
    } catch (error) {
      console.error('Error fetching comments:', error);
      toast.error('Không thể tải bình luận');
    }
  };

  const uploadFiles = async () => {
    const uploadedUrls = [];
    for (let file of selectedFiles) {
      const storageRef = ref(storage, `group_posts/${file.name}`);
      try {
        const snapshot = await uploadBytes(storageRef, file);
        const downloadUrl = await getDownloadURL(snapshot.ref);
        uploadedUrls.push(downloadUrl);
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }
    return uploadedUrls;
  };

  const deletePost = async () => {
    try {
      await axios.delete(
        `https://travelmateapp.azurewebsites.net/api/groups/${groupDataRedux.id}/groupposts/${post.postId}`,
        { headers: { Authorization: `${token}` } }
      );
      onDelete(post.postId);
      toast.success('Xóa bài viết thành công');
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error('Không thể xóa bài viết');
    }
  };

  const updatePost = async () => {
    try {
      const uploadedUrls = await uploadFiles();
      const updatedData = {
        title: newTitle,
        postPhotos: [
          ...uploadedImages.map((url) => ({ photoUrl: url })),
          ...uploadedUrls.map((url) => ({ photoUrl: url })),
        ],
      };
      await axios.put(
        `https://travelmateapp.azurewebsites.net/api/groups/${groupDataRedux.id}/groupposts/${post.postId}`,
        updatedData,
        { headers: { Authorization: `${token}` } }
      );
      toast.success('Cập nhật bài viết thành công');
      fetchPosts();
    } catch (error) {
      toast.error('Không thể cập nhật bài viết');
    }
  };

  const handleFileChange = (event) => setSelectedFiles([...event.target.files]);

  const handleDeleteImage = (index) => {
    if (index < uploadedImages.length) {
      setUploadedImages((prev) => prev.filter((_, i) => i !== index));
    } else {
      setSelectedFiles((prev) => prev.filter((_, i) => i !== (index - uploadedImages.length)));
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) {
      toast.error('Bình luận không được để trống');
      return;
    }
    try {
      const response = await axios.post(
        `https://travelmateapp.azurewebsites.net/api/groups/${groupDataRedux.id}/groupposts/${post.postId}/postcomments`,
        { commentText: newComment },
        { headers: { Authorization: `${token}` } }
      );
      setComments((prev) => [...prev, response.data]);
      setNewComment('');
      toast.success('Bình luận thành công');
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Không thể thêm bình luận');
    }
  };

  const handleUpdateComment = async (commentId, updatedText) => {
    try {
      await axios.put(
        `https://travelmateapp.azurewebsites.net/api/groups/${groupDataRedux.id}/groupposts/${post.postId}/postcomments/${commentId}`,
        { commentText: updatedText },
        { headers: { Authorization: `${token}` } }
      );
      setComments((prev) =>
        prev.map((comment) => (comment.commentId === commentId ? { ...comment, commentText: updatedText } : comment))
      );
      toast.success('Sửa bình luận thành công');
    } catch (error) {
      console.error('Error updating comment:', error);
      toast.error('Không thể sửa bình luận');
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await axios.delete(
        `https://travelmateapp.azurewebsites.net/api/groups/${groupDataRedux.id}/groupposts/${post.postId}/postcomments/${commentId}`,
        { headers: { Authorization: `${token}` } }
      );
      setComments((prev) => prev.filter((comment) => comment.commentId !== commentId));
      toast.success('Xóa bình luận thành công');
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast.error('Không thể xóa bình luận');
    }
  };

  return (
    <div className="post mb-3" style={{ borderBottom: '1px solid #ccc' }}>
      <div className="d-flex align-items-center gap-3">
        <img src={post.postCreatorAvatar} alt="avatar" width={70} height={70} className="rounded-circle" />
        <div className="d-flex justify-content-between w-100">
          <div>
            <h5 className="m-0">{post.postCreatorName}</h5>
            <p>{post.createdTime}</p>
          </div>
          <Dropdown>
            <Dropdown.Toggle variant="success" id="dropdown-basic" className="border-0 bg-transparent">
              <ion-icon name="ellipsis-vertical-outline"></ion-icon>
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item className='form_edit_post'>
                <FormSubmit buttonText="Lưu thay đổi" openModalText="Sửa bài viết" onButtonClick={updatePost} title={'Chỉnh sửa bài viết'}>
                  <h4>Bảng thông tin</h4>
                  <p>Nhập thông  tin chỉnh sửa bài viết của bạn</p>
                  <h4>Nội dung</h4>
                  <textarea
                    placeholder="Nội dung bài viết"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    onKeyDown={(e) => e.stopPropagation()}
                    className='w-100 p-2 rounded-4 mb-3 post_title'
                  />
                  <h4>Ảnh</h4>
                  <input
                    type="file"
                    id="image_update"
                    multiple
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <Button variant='' className='button_upload_images rounded-5 d-flex gap-1 mb-3' onClick={() => document.getElementById('image_update').click()}>
                    Nhấn vào đây để <p className='m-0 text-primary'>upload</p>
                  </Button>
                  <div className="uploaded_image_container d-flex flex-row gap-2">
                    {[...uploadedImages, ...selectedFiles].map((file, index) => (
                      <div key={index} className="uploaded_image position-relative" style={{ width: '100px', height: '100px' }}>
                        <img src={typeof file === 'string' ? file : URL.createObjectURL(file)} alt="Uploaded image" width={100} height={100} className="w-100 h-100 object-fit-cover" />
                        <div className="overlay-buttons position-absolute top-50 start-50 translate-middle d-flex gap-2">
                          <Button className='' variant="" onClick={() => window.open(typeof file === 'string' ? file : URL.createObjectURL(file), '_blank')}>
                            <ion-icon name="eye-outline"></ion-icon>
                          </Button>
                          <Button variant="" onClick={() => handleDeleteImage(index)}>
                            <ion-icon name="trash-outline"></ion-icon>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </FormSubmit>
              </Dropdown.Item>
              <Dropdown.Item onClick={deletePost}>Xóa bài viết</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>
      <p>{post.title}</p>
      {post.postPhotos && (
        <div className="images_post_container">
          {post.postPhotos.$values.map((image, index) => (
            <img key={index} src={image} alt="Post image" />
          ))}
        </div>
      )}
      <div className="d-flex gap-3 my-3">
        <Button variant="outline-dark" className="button_action_comment rounded-circle d-flex align-items-center justify-content-center" onClick={handleToggleComments}>
          <ion-icon name="chatbubble-outline"></ion-icon>
        </Button>
        <Button variant="outline-dark" className="button_action_comment rounded-circle d-flex align-items-center justify-content-center">
          <ion-icon name="share-social-outline"></ion-icon>
        </Button>
      </div>
      {showComments && (
        <div>
          <div className="comments w-100 mt-3">
            {comments.map((comment, index) => (
              <CommentPostGroupDetail
                key={`${comment.commentId}-${index}`}
                comment={comment}
                postId={post.postId}
                groupId={groupDataRedux.id}
                onUpdateComment={handleUpdateComment}
                onDeleteComment={handleDeleteComment}
              />
            ))}
          </div>
          <div className="write_comment_container d-flex gap-3 mb-3">
            <img src={user.avatarUrl} alt="avatar" width={50} height={50} className="rounded-circle" />
            <div className="w-100">
              <p className="fw-medium">{user.username}</p>
              <textarea
                name=""
                className="w-100 p-2 rounded-4"
                id="write_comment_area"
                placeholder="Viết bình luận..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              ></textarea>
              <div className="d-flex justify-content-end">
                <Button variant="outline-success" className="rounded-5" onClick={handleAddComment}>
                  Bình luận
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostGroupDetail;
