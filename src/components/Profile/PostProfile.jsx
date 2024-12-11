import React, { useState } from 'react';
import { Dropdown } from 'react-bootstrap';
import Modal from 'react-modal';
import { useMutation, useQueryClient } from 'react-query'; // Import useMutation and useQueryClient from react-query
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { deletePost } from '../../redux/actions/profileActions';

Modal.setAppElement('#root'); // Thiết lập root element cho modal

function PostProfile({ postPhotos, travelerAvatar, travelerName, location, createdAt, caption, localAvatar, localName, review, star, pastTripPostId }) {
    const [showModal, setShowModal] = useState(false);
    const token = useSelector(state => state.auth.token);
    const queryClient = useQueryClient(); // Initialize queryClient
    const dispatch = useDispatch();

    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

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

    const handleDeletePost = () => {
        deletePostMutation.mutate();
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
                        <small className='m-0'>{createdAt}</small>
                    </div>
                </div>
                <Dropdown>
                    <Dropdown.Toggle variant="" >
                    <ion-icon name="ellipsis-vertical-outline"></ion-icon>
                    </Dropdown.Toggle>
                    <Dropdown.Menu align={'end'}>
                        <Dropdown.Item onClick={handleDeletePost}>Xóa bài viết</Dropdown.Item>
                        <Dropdown.Item >Sửa bài viết</Dropdown.Item>
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
        </div>
    );
}

export default PostProfile;
