import React, { useState } from 'react';

function PostProfile({ pastTripPostId, location, travelerId, travelerName, travelerAvatar, isPublic, caption, localId, localName, localAvatar, review, star, createdAt, postPhotos }) {
    const [showModal, setShowModal] = useState(false);

    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

    const renderPhotos = () => {
        const photos = postPhotos.$values;
        if (photos.length === 1) {
            return <img src={photos[0].photoUrl} alt="Post" style={{ width: '100%', height: '300px', objectFit: 'cover', marginBottom: '10px' }} />;
        } else if (photos.length === 2) {
            return photos.map(photo => (
                <img key={photo.postPhotoId} src={photo.photoUrl} alt="Post" style={{ width: '50%', height: '300px', objectFit: 'cover', marginBottom: '10px' }} />
            ));
        } else if (photos.length > 2) {
            return (
                <div className='d-flex flex-wrap position-relative' style={{ height: '300px', gap: '10px' }}>
                    {photos.slice(0, 2).map(photo => (
                        <img key={photo.postPhotoId} src={photo.photoUrl} alt="Post" style={{ width: 'calc(50% - 5px)', height: '300px', objectFit: 'cover' }} />
                    ))}
                    <div className='position-relative' style={{ width: 'calc(50% - 5px)', height: '300px' }}>
                        <img src={photos[2].photoUrl} alt="Post" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        {photos.length > 3 && (
                            <div className='position-absolute top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center' style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', color: 'white', fontSize: '24px', cursor: 'pointer' }} onClick={handleShowModal}>
                                +{photos.length - 3}
                            </div>
                        )}
                    </div>
                </div>
            );
        }
    };

    return (
        <div className='shadow px-5 py-4 rounded-4 mb-2'>
            <div className='d-flex gap-2 mb-2'>
                <img src={travelerAvatar} alt="avatar" width={60} height={60} className='object-fit-cover rounded-circle' />
                <div>
                    <div className='d-flex gap-2 align-items-end'>
                        <p className='m-0 fw-bold'>{travelerName}</p>
                        <small className='m-0 text-success fw-medium' style={{
                            fontSize: '14px',
                        }}>{location}</small>
                    </div>
                    <small className='m-0'>{createdAt}</small>
                </div>
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
            {showModal && (
                <div className='modal' onClick={handleCloseModal}>
                    <div className='modal-content'>
                        {postPhotos.$values.map(photo => (
                            <img key={photo.postPhotoId} src={photo.photoUrl} alt="Post" style={{ width: '100%', marginBottom: '10px' }} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

export default PostProfile