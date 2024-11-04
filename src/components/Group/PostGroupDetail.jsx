import React, { useState } from 'react';
import CommentPostGroupDetail from './CommentPostGroupDetail';
import { Button, Dropdown, Form, Modal, Placeholder } from 'react-bootstrap';
import '../../assets/css/Groups/PostGroupDetail.css';
import FormSubmit from '../Shared/FormSubmit';
import EmojiPicker from 'emoji-picker-react';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '../../../firebaseConfig';
import { toast } from 'react-toastify';

function PostGroupDetail({ postDetails }) {
  const [visibleComments, setVisibleComments] = useState(2);
  const [filePlaceholders, setFilePlaceholders] = useState([]);
  const [tempImageUrls, setTempImageUrls] = useState([]);
  const [showComments, setShowComments] = useState(false); // New state to toggle comments visibility
  const [comment, setComment] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedUrls, setUploadedUrls] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [errors, setErrors] = useState({});
  const [uploadedFileRefs, setUploadedFileRefs] = useState([]); // References for deleting the files from Firebase
  const [showModal, setShowModal] = useState(false); // State for modal visibility
  const [modalImageUrl, setModalImageUrl] = useState(null); // State for image URL in modal


  const triggerFileInput = () => {
    document.getElementById('fileInputPostGroup').click();
  };

  const handleViewImage = (url) => {
    setModalImageUrl(url); // Set the image URL for the modal
    setShowModal(true); // Show the modal
  };

  const handleShowMore = () => {
    setVisibleComments((prev) => prev + 2);
  };

  const handelEditPostDetail = () => {
    console.log('Edit post detail');
  };

  const handleEmojiClick = (emoji) => {
    setComment((prevComment) => prevComment + emoji.emoji);
  };

  const handleDeleteImage = async (index) => {
    if (uploadedFileRefs[index]) {
      try {
        await deleteObject(uploadedFileRefs[index]);
        setUploadedUrls((prevUrls) => prevUrls.filter((_, i) => i !== index));
        setUploadedFileRefs((prevRefs) => prevRefs.filter((_, i) => i !== index));
        toast.success('Ảnh đã được xóa thành công');
      } catch (error) {
        console.log('Error deleting image:', error);
        toast.error('Lỗi khi xóa ảnh');
      }
    }
  };

  const handleFileSelect = async (event) => {
    const files = Array.from(event.target.files);
    if (files.length > 0) {
      setSelectedFiles(files);
      setFilePlaceholders(files.map((file) => file.name));
      setTempImageUrls(files.map((file) => URL.createObjectURL(file)));
      setIsUploading(true);

      const newUploadedUrls = [];
      const newUploadedFileRefs = [];

      for (const file of files) {
        const storageRef = ref(storage, `images/${file.name}`);
        newUploadedFileRefs.push(storageRef);
        try {
          await uploadBytes(storageRef, file);
          const url = await getDownloadURL(storageRef);
          newUploadedUrls.push(url);
        } catch (error) {
          setErrors((prevErrors) => ({ ...prevErrors, groupImageUrl: 'Lỗi khi tải lên ảnh bìa' }));
          toast.error(`Lỗi khi tải lên ảnh ${file.name}`);
        }
      }

      setUploadedUrls((prevUrls) => [...prevUrls, ...newUploadedUrls]);
      setUploadedFileRefs((prevRefs) => [...prevRefs, ...newUploadedFileRefs]);
      setIsUploading(false);

      if (newUploadedUrls.length > 0) {
        toast.success('Tất cả ảnh đã được tải lên thành công');
      }
    }
  };
  const toggleComments = () => {
    setShowComments((prev) => !prev); // Toggle visibility of comments
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      console.log("File selected:", file.name);
    }
  };

  return (
    <div className='mb-5 post-group-detail-container'>
      <div className='d-flex'>
        <div className='w-100 p-2 d-flex gap-3 align-items-center'>
          <img src={postDetails.authorAvatar} alt="" style={{
            width: '72px',
            height: '72px',
            objectFit: 'cover',
            borderRadius: '50%'
          }} />
          <div>
            <strong style={{
              fontWeight: '600',
              fontSize: '20px'
            }}>{postDetails.authorName}</strong>
            <p className='m-0' style={{
              fontWeight: '500',
              fontSize: '16px'
            }}>{postDetails.date}</p>
          </div>
        </div>

        <Dropdown>
          <Dropdown.Toggle variant="link" id="dropdown-basic" className='bg-transparent border-0' style={{ padding: '0', marginLeft: 'auto', color: 'black', }}>
            <ion-icon name="ellipsis-horizontal-outline" style={{ cursor: 'pointer', fontSize: '24px' }}></ion-icon>
          </Dropdown.Toggle>
          <Dropdown.Menu align="end" style={{ zIndex: '1000' }} className='edit-post-detail-dropdown'>
            <Dropdown.Item>
              <FormSubmit buttonText={'Cập nhật'} title={'Chỉnh sửa bài viết'} openModalText={'Chỉnh sửa'} onButtonClick={handelEditPostDetail}>
                <h3>Bảng thông tin</h3>
                <small>Nhập thông tin chi tiết cho nhóm mới của bạn</small>

                <h4 style={{
                  marginTop: '20px'
                }}>Nội dung</h4>
                <textarea placeholder='Nhập nội dung' className='w-100 rounded-5 p-3' style={{
                  height: '105px'
                }} />
         <Form.Group id="groupImage" className="mb-3 d-flex flex-column">
        <h4 style={{ marginTop: '20px' }}>Ảnh</h4>
        <Button
          variant="outline-primary"
          onClick={triggerFileInput}
          className="d-flex rounded-5 gap-1 alignItems-center mb-2 text-black"
          style={{
            width: '30%',
            borderStyle: 'dashed',
            backgroundColor: '#f2f7ff',
          }}
        >
          Nhấn vào đây để <p className='text-primary m-0'>upload</p>
        </Button>
        <Form.Control
          type="file"
          id="fileInputPostGroup"
          onClick={(e) => e.stopPropagation()}
          onChange={handleFileSelect}
          className="d-none"
          multiple
        />
        {isUploading ? (
          <Placeholder as="div" animation="glow" className="mt-3 d-flex flex-wrap gap-3">
            {filePlaceholders.map((_, index) => (
              <Placeholder key={index} xs={12} style={{ height: '100px', width: '100px', borderRadius: '5px' }} />
            ))}
          </Placeholder>
        ) : (
          <div className="d-flex flex-wrap gap-3">
            {uploadedUrls.map((url, index) => (
              <div
                key={index}
                style={{
                  position: 'relative',
                  width: '100px',
                  height: '100px',
                }}
              >
                <img
                  src={url}
                  alt="Ảnh bìa nhóm"
                  className="mt-3"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: '5px',
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    top: '17px',
                    left: '0',
                    right: '0',
                    bottom: '0',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    borderRadius: '5px',
                    opacity: '0',
                    transition: 'opacity 0.3s ease',
                    cursor: 'pointer',
                    height: '100%',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.opacity = '1';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = '0';
                  }}
                >
                  <ion-icon
                    name="eye-outline"
                    style={{
                      fontSize: '24px',
                      color: 'white',
                      marginRight: '10px',
                    }}
                    onClick={() => handleViewImage(url)}
                  ></ion-icon>
                  <ion-icon
                    name="trash-outline"
                    style={{
                      fontSize: '24px',
                      color: 'white',
                    }}
                    onClick={() => handleDeleteImage(index)}
                  ></ion-icon>
                </div>
              </div>
            ))}
          </div>
        )}
        {errors.groupImageUrl && (
          <div style={{ color: 'red', marginTop: '5px' }}>
            {errors.groupImageUrl}
          </div>
        )}
      </Form.Group>
              </FormSubmit>
            </Dropdown.Item>
            <Dropdown.Item onClick={() => console.log('Xóa bình luận')}>Xóa</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>

      <p style={{
        margin: '14px 0 18px 0',
        fontSize: '16px',
        fontWeight: '500'
      }}>{postDetails.content}</p>

      <div style={{
        border: '1px solid #D9D9D9',
        display: 'flex',
        justifyContent: 'space-between',
        padding: '18px',
        borderRadius: '10px',
        boxShadow: '4px 4px 4px rgba(0, 0, 0, 0.25)',
      }} className='post-group-detail-img'>
        {postDetails.images.map((img, index) => (
          <img key={index} src={img} alt="địa điểm" style={{
            objectFit: 'cover',
            borderRadius: '20px'
          }} />
        ))}
      </div>

      <div style={{
        padding: '18px 33px',
        display: 'flex',
        alignItems: 'center',
        gap: '45px'
      }}>
        <ion-icon name="chatbubble-outline" style={{
          fontSize: '36px',
          cursor: 'pointer' // Make it clickable
        }} onClick={toggleComments}></ion-icon>
        <ion-icon name="share-social-outline" style={{
          fontSize: '36px',
        }}></ion-icon>
      </div>

      {/* Show comments and comment input if showComments is true */}
      {showComments && (
        <>
          {postDetails.comments.slice(0, visibleComments).map((comment) => (
            <CommentPostGroupDetail key={comment.id} comment={comment} />
          ))}

          <div className='d-flex gap-2'>
            <img
              src="https://cdn.oneesports.vn/cdn-data/sites/4/2024/01/Zed_38.jpg"
              className='rounded-circle object-fit-cover'
              height={60}
              width={60}
              alt=""
            />
            <div className='w-100 position-relative'>
              <p className='m-0 fw-bold'>Nhơn Trần</p>
              <textarea
                placeholder='Nhập bình luận'
                className='mb-2 w-100 rounded-4 p-2'
                style={{ height: '80px' }}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <div className='w-100 d-flex justify-content-end gap-2'>
                <Button variant='' className='d-flex justify-content-center align-items-center' onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
                  <ion-icon name="happy-outline" style={{
                    fontSize: '24px'
                  }}></ion-icon>
                </Button>
                <Button>Bình luận</Button>
              </div>
              {showEmojiPicker && (
                <div style={{ position: 'absolute', zIndex: 1000, right: '0', bottom: '30px' }}>
                  <EmojiPicker onEmojiClick={handleEmojiClick} />
                </div>
              )}
            </div>
          </div>

          {/* Show "Show More" button if there are more comments to show */}
          {visibleComments < postDetails.comments.length && (
            <button onClick={handleShowMore} className='btn btn-outline-dark' style={{
              padding: '10px 20px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              borderRadius: '20px',
              fontSize: '12px'
            }}>
              Tải thêm các bình luận <ion-icon name="chevron-down-outline"></ion-icon>
            </button>
          )}
        </>
      )}

      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        centered
        backdrop={false}
        dialogClassName="transparent-modal"
      >
        <div
          onClick={() => setShowModal(false)} // Close modal when clicking on overlay
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
            zIndex: 1040, // Ensure it sits below the modal content
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
            }}
          >
            <img src={modalImageUrl} alt="Ảnh lớn" style={{ width: '50%', borderRadius: '5px' }} />
          </div>
        </div>
      </Modal>


    </div>
  );
}

export default PostGroupDetail;
