import React, { useState } from 'react';
import { Dropdown } from 'react-bootstrap';
import Modal from 'react-modal';
import { useMutation, useQueryClient } from 'react-query'; // Import useMutation and useQueryClient from react-query
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { deletePost, updatePost, viewProfile } from '../../redux/actions/profileActions'; // Import deletePost and updatePost actions
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import ConfirmModal from '../Shared/ConfirmModal'; // Import ConfirmModal

Modal.setAppElement('#root'); // Thiết lập root element cho modal

function PostProfile({ postPhotos, travelerAvatar, travelerName, location, createdAt, caption, localAvatar, localName, review, star, pastTripPostId }) {
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false); // State for edit modal
    const [editData, setEditData] = useState({ location, caption, star, postPhotos: [] }); // State for edit data
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [showConfirmModal, setShowConfirmModal] = useState(false); // State for confirm modal
    const token = useSelector(state => state.auth.token);
    const queryClient = useQueryClient(); // Initialize queryClient
    const dispatch = useDispatch();
    const storage = getStorage();
    const user = useSelector(state => state.auth.user);

    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);
    const handleShowEditModal = () => setShowEditModal(true);
    const handleCloseEditModal = () => setShowEditModal(false);
    const handleShowConfirmModal = () => {
        console.log("Confirm modal opened");
        setShowConfirmModal(true);
    };
    const handleCloseConfirmModal = () => setShowConfirmModal(false);

    const deletePostMutation = useMutation(
        async () => {
            const response = await fetch(`https://travelmateapp.azurewebsites.net/api/PastTripPosts/${pastTripPostId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `${token}`
                }
            });
            if (!response.ok) {
                throw new Error('Error deleting post');
            }
        },
        {
            onSuccess: () => {
                toast.success('Xóa bài viết thành công');
                queryClient.invalidateQueries('pastTrips'); // Invalidate and refetch posts
                dispatch(deletePost(pastTripPostId)); // Dispatch deletePost action
            },
            onError: (error) => {
                console.error('Error deleting post:', error);
            }
        }
    );

    const updatePostMutation = useMutation(
        async (updatedData) => {
            const response = await fetch(`https://travelmateapp.azurewebsites.net/api/PastTripPosts/${pastTripPostId}/TravelerUpdate`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `${token}`
                },
                body: JSON.stringify(updatedData)
            });
            if (!response.ok) {
                throw new Error('Error updating post');
            }
        },
        {
            onSuccess: (data) => {
                toast.success('Cập nhật bài viết thành công');
                dispatch(viewProfile(user.id, token));
                handleCloseEditModal();
                dispatch(updatePost(pastTripPostId, data)); // Dispatch updatePost action
                queryClient.invalidateQueries('pastTrips');
                queryClient.refetchQueries('pastTrips');

            },
            onError: (error) => {
                console.error('Error updating post:', error);
            }
        }
    );

    const handleDeletePost = () => {
        deletePostMutation.mutate();
        handleCloseConfirmModal();
    };

    const handleEditPost = async () => {
        const uploadedPhotos = await Promise.all(selectedFiles.map(file => uploadImage(file)));
        const updatedData = { ...editData, postPhotos: uploadedPhotos.map(url => ({ photoUrl: url })) };
        updatePostMutation.mutate(updatedData);
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditData(prevState => ({ ...prevState, [name]: value }));
    };

    const handlePhotoChange = (e) => {
        const files = Array.from(e.target.files);
        setSelectedFiles(files);
        const photos = files.map(file => ({ photoUrl: URL.createObjectURL(file) }));
        setEditData(prevState => ({ ...prevState, postPhotos: photos }));
    };

    const handleRemovePhoto = (index) => {
        setEditData(prevState => {
            const newPhotos = [...prevState.postPhotos];
            newPhotos.splice(index, 1);
            return { ...prevState, postPhotos: newPhotos };
        });
        setSelectedFiles(prevFiles => {
            const newFiles = [...prevFiles];
            newFiles.splice(index, 1);
            return newFiles;
        });
    };

    const uploadImage = async (file) => {
        const storageRef = ref(storage, `images/${file.name}`);
        await uploadBytes(storageRef, file);
        return await getDownloadURL(storageRef);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return format(date, 'dd/MM/yyyy HH:mm', { locale: vi });
    };

    const renderPhotos = () => {
        const photos = postPhotos.$values;
        if (photos.length === 1) {
            return <img src={photos[0].photoUrl} alt="Post" style={{ width: '100%', height: '300px', objectFit: 'cover', marginBottom: '10px' }} />;
        } else if (photos.length === 2) {
            return photos.map(photo => (
                <img key={photo.postPhotoId} src={photo.photoUrl} alt="Post" style={{ width: '50%', height: '300px', objectFit: 'cover', marginBottom: '10px' }} />
            ));
        } else if (photos.length === 3) {
            return (
                <div className='d-flex flex-wrap position-relative' style={{ gap: '10px' }}>
                    {photos.slice(0, 2).map(photo => (
                        <img key={photo.postPhotoId} src={photo.photoUrl} alt="Post" style={{ width: 'calc(50% - 5px)', height: '300px', objectFit: 'cover' }} />
                    ))}
                    <div style={{ width: 'calc(50% - 5px)', height: '300px' }}>
                        <img src={photos[2].photoUrl} alt="Post" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                </div>
            );
        } else if (photos.length === 4) {
            return (
                <div className='d-flex flex-wrap' style={{ gap: '10px' }}>
                    {photos.map((photo, index) => (
                        <img
                            key={photo.postPhotoId}
                            src={photo.photoUrl}
                            alt="Post"
                            style={{ width: 'calc(50% - 5px)', height: '200px', objectFit: 'cover', cursor: index === 3 ? 'pointer' : 'default' }}
                            onClick={index === 3 ? handleShowModal : undefined}
                        />
                    ))}
                </div>
            );
        } else if (photos.length > 4) {
            return (
                <div className='d-flex flex-wrap position-relative' style={{ gap: '10px' }}>
                    {photos.slice(0, 3).map(photo => (
                        <img key={photo.postPhotoId} src={photo.photoUrl} alt="Post" style={{ width: 'calc(50% - 5px)', height: '300px', objectFit: 'cover' }} />
                    ))}
                    <div className='position-relative' style={{ width: 'calc(50% - 5px)', height: '300px' }}>
                        <img src={photos[3].photoUrl} alt="Post" style={{ width: '100%', height: '100%', objectFit: 'cover', cursor: 'pointer' }} />
                        <div className='position-absolute top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center' onClick={handleShowModal} style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', color: 'white', fontSize: '24px', cursor: 'pointer' }}>
                            +{photos.length - 4}
                        </div>
                    </div>
                </div>
            );
        }
    };

    const handleStarClick = (starValue) => {
        setEditData(prevState => ({ ...prevState, star: starValue }));
    };

    return (
        <div className='shadow px-5 py-4 rounded-4 mb-2' style={{ height: 'auto' }}>
            <div className='d-flex justify-content-between'>
                <div className='d-flex gap-2 mb-2'>
                    <img src={travelerAvatar} alt="avatar" width={60} height={60} className='object-fit-cover rounded-circle' />
                    <div>
                        <div className='d-flex gap-2 align-items-end'>
                            <p className='m-0 fw-bold'>{travelerName}</p>
                            <small className='m-0 text-success fw-medium' style={{ fontSize: '14px' }}>{location}</small>
                        </div>
                        <small className='m-0'>{formatDate(createdAt)}</small>
                    </div>
                </div>
                <Dropdown>
                    <Dropdown.Toggle variant="" >
                        <ion-icon name="ellipsis-vertical-outline"></ion-icon>
                    </Dropdown.Toggle>
                    <Dropdown.Menu align={'end'}>
                        <Dropdown.Item onClick={handleShowConfirmModal}>Xóa bài viếts</Dropdown.Item>
                        <Dropdown.Item onClick={handleShowEditModal}>Sửa bài viết</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </div>
            <p>{caption}</p>
            <div className='d-flex flex-wrap mb-2'>
                {renderPhotos()}
            </div>
            <div className='d-flex gap-2'>
                <img src={localAvatar} alt={localName} width={60} height={60} className='object-fit-cover rounded-circle' />
                <div>
                    <div className='d-flex gap-2'>
                        <p className='m-0'>{localName}</p>
                        <p className='m-0'>
                            {Array.from({ length: star }, (_, i) => (
                                <ion-icon key={i} name="star" style={{ color: '#ffd250', marginRight: '4px' }}></ion-icon>
                            ))}
                        </p>
                    </div>
                    <p>{review}</p>
                </div>
            </div>
            <Modal
                isOpen={showModal}
                onRequestClose={handleCloseModal}
                contentLabel="View All Photos"
                style={{
                    overlay: { backgroundColor: 'rgba(0, 0, 0, 0.75)' },
                    content: { inset: '10%', padding: '20px', borderRadius: '10px', overflow: 'auto' }
                }}
            >
                <div className='d-flex justify-content-end'><button className='btn btn-danger' onClick={handleCloseModal}><ion-icon name="close-outline"></ion-icon></button></div>
                <div className='d-flex flex-wrap'>
                    {postPhotos.$values.map(photo => (
                        <img key={photo.postPhotoId} src={photo.photoUrl} alt="Post" style={{ width: 'calc(33.33% - 10px)', margin: '5px', height: '200px', objectFit: 'cover' }} />
                    ))}
                </div>
            </Modal>
            <Modal
                isOpen={showEditModal}
                onRequestClose={handleCloseEditModal}
                contentLabel="Edit Post"
                style={{
                    overlay: { backgroundColor: 'rgba(0, 0, 0, 0.75)' },
                    content: { inset: '5%', padding: '20px', borderRadius: '10px', overflow: 'auto', maxWidth: '600px', height: '520px', margin: 'auto' } // Adjusted size
                }}
            >
                <div className='d-flex justify-content-end'><button className='btn btn-danger' onClick={handleCloseEditModal}><ion-icon name="close-outline"></ion-icon></button></div>
                <div className='overflow-auto'>
                    <div className='mb-3'>
                        <label>Địa điểm</label>
                        <input type="text" name="location" value={editData.location} onChange={handleEditChange} className='form-control' />
                    </div>
                    <div className='mb-3'>
                        <label>Nội dung bài viết</label>
                        <input type="text" name="caption" value={editData.caption} onChange={handleEditChange} className='form-control' />
                    </div>
                    <div className='mb-3'>
                        <label>Đánh giá</label>
                        <div>
                            {Array.from({ length: 5 }, (_, i) => (
                                <ion-icon
                                    key={i}
                                    name={i < editData.star ? "star" : "star-outline"}
                                    style={{ color: '#ffd250', fontSize: '24px', cursor: 'pointer' }}
                                    onClick={() => handleStarClick(i + 1)}
                                ></ion-icon>
                            ))}
                        </div>
                    </div>
                    <div className='mb-3'>
                        <button className='btn btn-outline-primary rounded-5' onClick={() => document.getElementById('upload_img_pastrip').click()}>Vui lòng chọn ảnh để upload</button>
                        <input type="file" id='upload_img_pastrip' multiple onChange={handlePhotoChange} className='form-control d-none' />
                    </div>
                    <div className='d-flex flex-wrap'>
                        {editData.postPhotos.map((photo, index) => (
                            <div key={index} style={{ position: 'relative', margin: '5px' }}>
                                <img src={photo.photoUrl} alt="Selected" style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
                                <button
                                    type="button"
                                    className="btn btn-danger btn-sm"
                                    style={{ position: 'absolute', top: '5px', right: '5px' }}
                                    onClick={() => handleRemovePhoto(index)}
                                >
                                    <ion-icon name="close-outline"></ion-icon>
                                </button>
                            </div>
                        ))}
                    </div>
                    <div className='d-flex justify-content-end'><button className='btn btn-success rounded-5' onClick={handleEditPost}>Lưu thay đổi</button></div>
                </div>
            </Modal>
            <ConfirmModal
                show={showConfirmModal}
                onHide={handleCloseConfirmModal}
                onConfirm={handleDeletePost}
                title="Xác nhận xóa bài viết"
                message="Bạn có chắc chắn muốn xóa bài viết này không?"
            />

        </div>
    );
}

export default PostProfile;
