import React from 'react';
import { Card, Image, Dropdown } from 'react-bootstrap';

function PostProfile({ title, location, localLocation, date, description, images, userImage, userName, userReview }) {
    return (
        <Card className="py-3 px-5 mb-3 rounded-4 border-0 shadow">
            <div className="d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center">
                    <Image
                        src={userImage}
                        roundedCircle
                        className="me-2 object-fit-cover"
                        style={{ width: '60px', height: '60px' }}
                    />
                    <div>
                        <div className="d-flex">
                            <Card.Title className="mb-0 fw-medium mx-2" style={{
                                fontSize: '16.5px'
                            }}>{userName}</Card.Title>
                            <Card.Text className='fw-medium' style={{
                                fontSize: '13px',
                            }}>{location}</Card.Text>
                        </div>
                        <div className="mx-2 fw-medium" style={{
                            fontSize: '13px',
                        }}>
                            {date}
                        </div>
                    </div>
                </div>

                <Dropdown align="end">
                    <Dropdown.Toggle as="div" id="dropdown-custom-components" style={{ cursor: 'pointer' }}>
                        <ion-icon name="ellipsis-vertical-outline"></ion-icon>
                    </Dropdown.Toggle>
                    <Dropdown.Menu style={{
                        background: 'white',
                        borderRadius: '8px',
                        padding: '12px',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.15)',
                        border: 'none'
                    }}>
                        <Dropdown.Item href="#/action-1">Chỉnh sửa</Dropdown.Item>
                        <Dropdown.Item href="#/action-2">Xóa</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </div>

            <Card.Text className='mt-3 mb-1 fw-medium' style={{
                fontSize: '13px',
            }}>
                {description}
            </Card.Text>

            <div className="d-flex align-items-center justify-content-start">
                {images.map((image, index) => (
                    <Image
                        key={index}
                        src={image}
                        className='me-3'
                        style={{ width: '30%', height: '100%', objectFit: 'cover', borderRadius: '8px' }}
                    />
                ))}
            </div>

            <Card.Title className='mb-0 fw-bold m-2'>Guest Review</Card.Title>
            <div className="d-flex align-items-center m-2">
                <Image
                    src={userImage}
                    roundedCircle
                    className='me-3 object-fit-cover'
                    style={{ width: '60px', height: '60px' }}
                />
                <div>
                    <div className='d-flex'>
                        <Card.Title className='fw-bold me-3' style={{
                            fontSize: '16px'
                        }}>{userName}</Card.Title>
                        <div className='d-flex gap-1 align-items-center' style={{
                            fontSize: '13px',
                            color: '#FBBC05'    
                        }}>
                            <ion-icon name="star"></ion-icon>
                            <ion-icon name="star"></ion-icon>
                            <ion-icon name="star"></ion-icon>
                            <ion-icon name="star"></ion-icon>
                            <ion-icon name="star"></ion-icon>
                        </div>
                    </div>
                    <Card.Title className='me-3' style={{
                        fontSize: '13px',
                    }}>{localLocation}</Card.Title>
                    <Card.Text className='' style={{
                        fontSize: '16px',
                    }}>{userReview}</Card.Text>
                </div>
            </div>
        </Card>
    );
}

export default PostProfile;
