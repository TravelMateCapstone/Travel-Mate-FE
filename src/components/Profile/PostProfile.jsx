import axios from 'axios';
import React from 'react';
import { Card, Image, Dropdown } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
function PostProfile({id, title,localName,star ,location, review, localLocation, date, description, images, userImage, userName, userReview, onDelete }) {
    const renderStars = Array(5).fill(0).map((_, index) => (
        <ion-icon 
            key={index} 
            name={index < star ? "star" : "star-outline"} // Hiển thị "star" nếu index < star, ngược lại là "star-outline"
            style={{ color: '#FBBC05', fontSize: '13px' }}
        ></ion-icon>
    ));
    const token = useSelector((state) => state.auth.token)
    const handleDelete = async () => {
        const apiUrl = `https://travelmateapp.azurewebsites.net/api/PastTripPosts/${id}`;
        try {
            const response = await axios.delete(apiUrl, {
                headers: {
                  Authorization: `${token}` // Thêm token vào header
                }
              });
              
            toast.success('Xoá bài viết thành công !')
            if (onDelete) onDelete();
        } catch (error) {
            console.error('Lỗi:', error);
            alert('Không thể xóa bài viết. Vui lòng thử lại.');
        }
    };

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
                        <Dropdown.Item className='d-flex align-items-center gap-2'><ion-icon name="eye-off-outline" style={{
                            fontSize: '23px'
                        }}></ion-icon> <p className='m-0'>Ẩn bài viết</p></Dropdown.Item>
                        <Dropdown.Item className='d-flex align-items-center gap-2'><ion-icon name="create-outline" style={{
                            fontSize: '23px'
                        }}></ion-icon> <p className='m-0'>Chỉnh sửa</p></Dropdown.Item>
                        <Dropdown.Item onClick={handleDelete} className='d-flex align-items-center gap-2'><ion-icon name="trash-outline" style={{
                            fontSize: '23px'
                        }}></ion-icon> Xóa</Dropdown.Item>
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
                        }}>{localName}</Card.Title>
                        <div className='d-flex gap-1 align-items-center' style={{
                            fontSize: '13px',
                            color: '#FBBC05'    
                        }}>
                            {renderStars}
                        </div>
                    </div>
                    <Card.Title className='me-3' style={{
                        fontSize: '13px',
                    }}>{localLocation}</Card.Title>
                    <Card.Text className='' style={{
                        fontSize: '16px',
                    }}>{review}</Card.Text>
                </div>
            </div>
        </Card>
    );
}

export default PostProfile;
