import React, { useEffect, useState } from 'react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import CommentPostGroupDetail from './CommentPostGroupDetail';
import '../../assets/css/Groups/PostGroupDetail.css';
import Dropdown from 'react-bootstrap/Dropdown';
import { Button, Modal } from 'react-bootstrap';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import FormSubmit from '../Shared/FormSubmit';
import { storage } from '../../../firebaseConfig';
import EmojiPicker from 'emoji-picker-react';
import { useMutation, useQueryClient } from 'react-query';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

const PostGroupDetail = ({ post }) => {
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadedImages, setUploadedImages] = useState(post.groupPostPhotos?.$values || []);
  const [newTitle, setNewTitle] = useState(post.title);
  const [visibleComments, setVisibleComments] = useState(5);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.auth.user);
  const groupDataRedux = useSelector((state) => state.group.selectedGroup);

  console.log(post);


  const queryClient = useQueryClient();

  const deletePostMutation = useMutation(async () => {
    try {
      await axios.delete(
        `https://travelmateapp.azurewebsites.net/api/groups/${groupDataRedux.id || groupDataRedux.groupId}/groupposts/${post.groupPostId}`,
        { headers: { Authorization: `${token}` } }
      );
      toast.success('Xóa bài viết thành công');
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error('Không thể xóa bài viết');
    }
  }, {
    onSuccess: () => {
      queryClient.invalidateQueries(['posts', groupDataRedux.id || groupDataRedux.groupId]);
    },
  });

  const updatePostMutation = useMutation(async () => {
    console.log('update post', uploadedImages);

    try {
      const uploadedUrls = await Promise.all(selectedFiles.map(async (file) => {
        const storageRef = ref(storage, `group_posts/${file.name}`);
        const snapshot = await uploadBytes(storageRef, file);
        return await getDownloadURL(snapshot.ref);
      }));
      const updatedData = {
        title: newTitle,
        GroupPostPhotos: uploadedUrls.map((url) => ({ photoUrl: url })),
      };
      await axios.put(
        `${import.meta.env.VITE_BASE_API_URL}/api/groups/${groupDataRedux.id || groupDataRedux.groupId}/groupposts/${post.groupPostId}`,
        updatedData,
        { headers: { Authorization: `${token}` } }
      );
      toast.success('Cập nhật bài viết thành công');
      setUploadedImages(uploadedUrls.map((url) => ({ photoUrl: url }))); // Update state with new images
    } catch (error) {
      toast.error('Không thể cập nhật bài viết');
    }
  }, {
    onSuccess: () => {
      queryClient.invalidateQueries(['posts', groupDataRedux.id || groupDataRedux.groupId]);
    },
  });

  const updateCommentMutation = useMutation(async ({ postCommentId, updatedText }) => {
    await axios.put(
      `https://travelmateapp.azurewebsites.net/api/groups/${groupDataRedux.id || groupDataRedux.groupId}/groupposts/${post.groupPostId}/postcomments/${postCommentId}`,
      { commentText: updatedText },
      { headers: { Authorization: `${token}` } }
    );
  }, {
    onSuccess: (data, variables) => {
      setComments((prev) => prev.map((comment) =>
        comment.postCommentId === variables.postCommentId
          ? { ...comment, commentText: variables.updatedText, isEdited: true }
          : comment
      ));
      toast.success('Cập nhật bình luận thành công');
      queryClient.invalidateQueries(['comments', post.groupPostId]);
    },
  });

  const deleteCommentMutation = useMutation(async (postCommentId) => {
    await axios.delete(
      `https://travelmateapp.azurewebsites.net/api/groups/${groupDataRedux.id || groupDataRedux.groupId}/groupposts/${post.groupPostId}/postcomments/${postCommentId}`,
      { headers: { Authorization: `${token}` } }
    );
  }, {
    onSuccess: (data, variables) => {
      setComments((prev) => prev.filter((comment) => comment.postCommentId !== variables));
      toast.success('Xóa bình luận thành công');
      queryClient.invalidateQueries(['comments', post.groupPostId]);
    },
    onError: () => {
      toast.error('Không thể xóa bình luận');
    }
  });

  const addCommentMutation = useMutation(async () => {
    if (!newComment.trim()) {
      toast.error('Bình luận không được để trống');
      return;
    }
    const response = await axios.post(
      `https://travelmateapp.azurewebsites.net/api/groups/${groupDataRedux.id || groupDataRedux.groupId}/groupposts/${post.groupPostId}/postcomments`,
      { commentText: newComment },
      { headers: { Authorization: `${token}` } }
    );
    return response.data;
  }, {
    onSuccess: (data) => {
      const newCommentData = {
        ...data,
        commentor: user.FullName,
        commentorAvatar: user.avatarUrl
      };
      setComments((prev) => [...prev, newCommentData]);
      setNewComment('');
      toast.success('Bình luận thành công');
      queryClient.invalidateQueries(['comments', post.groupPostId]);
    },
    onError: () => {
      toast.error('Không thể thêm bình luận');
    }
  });

  useEffect(() => {
    if (post.groupPostPhotos && post.groupPostPhotos.$values) setUploadedImages(post.groupPostPhotos.$values);
    if (showComments) {
      (async () => {
        try {
          const response = await axios.get(
            `https://travelmateapp.azurewebsites.net/api/groups/${groupDataRedux.id || groupDataRedux.groupId}/groupposts/${post.groupPostId}/postcomments`,
            { headers: { Authorization: `${token}` } }
          );
          setComments(response.data.$values);
        } catch (error) {
          console.error('Error fetching comments:', error);
          toast.error('Không thể tải bình luận');
        }
      })();
    }
  }, [post, showComments]);

  const autoResize = (e) => {
    e.target.style.height = 'auto';
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  const handleToggleComments = () => setShowComments(!showComments);

  const loadMoreComments = () => setVisibleComments((prev) => prev + 5);

  const handleFileChange = (event) => setSelectedFiles([...event.target.files]);

  const handleDeleteImage = (index) => {
    if (index < uploadedImages.length) {
      setUploadedImages((prev) => prev.filter((_, i) => i !== index));
    } else {
      setSelectedFiles((prev) => prev.filter((_, i) => i !== (index - uploadedImages.length)));
    }
  };

  const handleAddComment = () => {
    addCommentMutation.mutate();
  };

  const handleUpdateComment = (postCommentId, updatedText) => {
    updateCommentMutation.mutate({ postCommentId, updatedText });
  };

  const handleDeleteComment = (postCommentId) => {
    deleteCommentMutation.mutate(postCommentId);
  };

  const onEmojiClick = (emojiData) => {
    setNewComment((prev) => prev + emojiData.emoji);
    setShowEmojiPicker(false);
  };

  const toggleEmojiPicker = () => setShowEmojiPicker((prev) => !prev);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return format(date, "dd 'tháng' MM 'lúc' HH:mm", { locale: vi });
  };

  console.log(post.postById+ '-'+  user.id);
  

  return (
    <div className="post mb-3">
      <div className="d-flex align-items-center gap-3">
        <img src={post.postCreatorAvatar || 'https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg'} alt="avatar" width={70} height={70} className="rounded-circle object-fit-cover" />
        <div className="d-flex justify-content-between w-100">
          <div>
            <h5 className="m-0">{post.postCreatorName || post.commentor}</h5>
            <p>{formatDate(post.createdTime)}</p>
          </div>
          {post.postById == user.id && (
            <Dropdown>
              <Dropdown.Toggle variant="success" className="border-0 bg-transparent shadow-none text-black">
                <ion-icon name="ellipsis-vertical-outline"></ion-icon>
              </Dropdown.Toggle>
              <Dropdown.Menu align="end">
                <Dropdown.Item className='form_edit_post'>
                  <FormSubmit buttonText="Lưu thay đổi" openModalText="Sửa bài viết" onButtonClick={() => updatePostMutation.mutate()} title={'Chỉnh sửa bài viết'}>
                    <h4>Bảng thông tin</h4>
                    <p>Nhập thông tin chỉnh sửa bài viết của bạn</p>
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
                    <div className="uploaded_image_container d-flex flex-wrap flex-row gap-2">
                      {selectedFiles.length > 0 ? (
                        selectedFiles.map((file, index) => (
                          <div key={index} className="uploaded_image position-relative" style={{ width: '100px', height: '100px' }}>
                            <img
                              src={URL.createObjectURL(file)}
                              alt="Selected image"
                              width={100}
                              height={100}
                              className="w-100 h-100 object-fit-cover"
                            />
                            <div className="overlay-buttons position-absolute top-50 start-50 translate-middle d-flex gap-2">
                              <Button
                                variant=""
                                onClick={() => window.open(URL.createObjectURL(file), '_blank')}
                              >
                                <ion-icon name="eye-outline"></ion-icon>
                              </Button>
                              <Button variant="" onClick={() => handleDeleteImage(index)}>
                                <ion-icon name="trash-outline"></ion-icon>
                              </Button>
                            </div>
                          </div>
                        ))
                      ) : (
                        uploadedImages.map((image, index) => (
                          <div key={index} className="uploaded_image position-relative" style={{ width: '100px', height: '100px' }}>
                            <img
                              src={image.photoUrl}
                              alt="Uploaded image"
                              width={100}
                              height={100}
                              className="w-100 h-100 object-fit-cover"
                            />
                            <div className="overlay-buttons position-absolute top-50 start-50 translate-middle d-flex gap-2">
                              <Button
                                variant=""
                                onClick={() => window.open(image.photoUrl, '_blank')}
                              >
                                <ion-icon name="eye-outline"></ion-icon>
                              </Button>
                              <Button variant="" onClick={() => handleDeleteImage(index)}>
                                <ion-icon name="trash-outline"></ion-icon>
                              </Button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </FormSubmit>
                </Dropdown.Item>
                <Dropdown.Item onClick={() => deletePostMutation.mutate()}>Xóa bài viết</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          )}
        </div>
      </div>
      <p className='mt-3 mb-4'>{post.title}</p>
      {post.groupPostPhotos && (
        <div className="images_post_container">
          {post.groupPostPhotos.$values.map((image, index) => (
            <img key={index} src={image.photoUrl} className='object-fit-cover' alt="Post image" />
          ))}
        </div>
      )}
      <div className="d-flex gap-5 mb-3 mt-5">
        <Button
          variant=""
          className="p-0 button_action_comment rounded-circle d-flex gap-2 align-items-center justify-content-center"
          onClick={handleToggleComments}
        >
          <ion-icon
            name="chatbubble-outline"
            style={{
              fontSize: '30px',
            }}
          ></ion-icon>
          {showComments ? `${comments.length} Bình luận` : 'Bình luận'}
        </Button>
        <Button variant="" className="button_action_comment p-0 gap-2 rounded-circle d-flex align-items-center justify-content-center">
          <ion-icon name="share-social-outline" style={{
            fontSize: '30px',
          }}></ion-icon> Chia sẻ
        </Button>
      </div>
      {showComments && (
        <div>
          <hr />
          <div className="comments w-100 mt-3">
            {comments.slice(0, visibleComments).map((comment, index) => (
              <CommentPostGroupDetail
                key={`${comment.postCommentId}-${index}`}
                comment={comment}
                groupPostId={post.groupPostId}
                groupId={groupDataRedux.id || groupDataRedux.groupId}
                onUpdateComment={handleUpdateComment}
                onDeleteComment={handleDeleteComment}
              />
            ))}
          </div>
          {visibleComments < comments.length && (
            <div className="d-flex justify-content-start my-3">
              <Button variant="" className='rounded-5 py-0 d-flex align-items-center gap-2 button_loadmore_comment' onClick={loadMoreComments}>
                Xem thêm bình luận <ion-icon name="chevron-down-outline" style={{
                  fontSize: '20px',
                }}></ion-icon>
              </Button>
            </div>
          )}
          <div className="write_comment_container d-flex gap-3 mb-3">
            <img src={user.avatarUrl} alt="avatar" width={50} height={50} className="rounded-circle" />
            <div className="w-100 container_write_comment">
              <textarea
                name=""
                className="w-100"
                id="write_comment_area"
                placeholder="Viết bình luận..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onInput={autoResize}
              ></textarea>
              <div className="d-flex justify-content-between">
                <Button variant="light" onClick={toggleEmojiPicker} className="me-2">
                  <ion-icon name="happy-outline" style={{ fontSize: '1.5rem' }}></ion-icon>
                </Button>
                <Button variant="" className={`rounded-5 button_send_comment p-0 ${!newComment.trim() ? 'disabled' : ''}`} onClick={handleAddComment}>
                  <ion-icon name="send" style={{ fontSize: '1.5rem', color: '#979797' }}></ion-icon>
                </Button>
              </div>
              {showEmojiPicker && (
                <div style={{ position: 'absolute' }}>
                  <EmojiPicker onEmojiClick={onEmojiClick} />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered className="custom-modal_deletPostGroup">
        <Modal.Body className="custom-modal-body">
          <div>
            <ion-icon name="warning-outline" style={{
              fontSize: '30px',
              color: '#AC0B0B',
            }}></ion-icon>
          </div>
          <p className='mb-0 fw-medium text-black'>Bạn có muốn xóa không ?</p>
          <p className='m-0' style={{
            fontSize: '12px',
            color: '#6E6E6E',
          }}>Sau khi xóa bạn không thể hoàn tác</p>
        </Modal.Body>
        <Modal.Footer className='d-flex gap-3 justify-content-center'>
          <Button variant="" onClick={() => setShowDeleteModal(false)}>
            Hủy
          </Button>
          <Button variant="" onClick={() => {
            deletePostMutation.mutate();
            setShowDeleteModal(false);
          }}
            className='rounded-5'
            style={{
              background: '#AC0B0B',
              color: '#fff',
            }}>
            Xóa bài viết
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default PostGroupDetail;
