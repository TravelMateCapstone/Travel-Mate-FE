import React, { useState } from 'react';
import TimeLine from '../../components/Contracts/TimeLine';
import { Button, Col, Row } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import TextareaAutosize from 'react-textarea-autosize';
import axios from 'axios';
import { toast } from 'react-toastify';
import { storage } from '../../../firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useNavigate } from 'react-router-dom';
import RoutePath from '../../routes/RoutePath'

function FinishContractTraveller() {
    const user = useSelector((state) => state.auth.user);
    const navigate = useNavigate();
    const token = useSelector((state) => state.auth.token);
    const [images, setImages] = useState([]);
    const [caption, setCaption] = useState('');
    const [star, setStar] = useState(0);
    const contractInfo = JSON.parse(localStorage.getItem('contractInfo'));
    const contract_selected = JSON.parse(localStorage.getItem('contract_selected'));
    const profile = useSelector((state) => state.profile);
    const handleImageUpload = async (event) => {
        const files = Array.from(event.target.files);
        const uploadPromises = files.map(async (file) => {
            const storageRef = ref(storage, `images/${file.name}`);
            await uploadBytes(storageRef, file);
            return getDownloadURL(storageRef);
        });
        const imageUrls = await Promise.all(uploadPromises);
        setImages(prevImages => [...prevImages, ...imageUrls]);
    };
    const handleRemoveImage = (index) => {
        URL.revokeObjectURL(images[index]);
        setImages(images.filter((_, i) => i !== index));
    };
    const handleFinishContract = async () => {
        if (!caption) {
            toast.error("Vui lòng nhập nội dung bài viết.");
        }
        if (star === 0) {
            toast.error("Vui lòng đánh giá người địa phương.");
        }
        if (images.length === 0) {
            toast.error("Vui lòng upload ít nhất một ảnh chuyến đi.");
            return;
        }
        console.log(user.id)
        const tripImages = images.map(image => image);
        const formData = {
            tourId: contract_selected.tourId || contractInfo.tourId,
            travelerId: user.id,
            caption: caption,
            star: star,
            tripImages: tripImages,
        };
        try {
            const response = await axios.post(
                "https://travelmateapp.azurewebsites.net/api/PastTripPost",
                formData,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `${token}`,
                    },
                }
            );

            toast.success("Tạo bài viết thành công.");
            console.log(response.data);
        } catch (error) {
            console.error("Error:", error);
            if (error.response.data == 'You have already create post about this tour') {
                toast.error('Bạn đã tạo bài viết về chuyến đi này rồi.');
                navigate(RoutePath.DONE_CONTRACT)
            }
        }
    };

    return (
        <div>
            <TimeLine activeStep={3} />
          <div style={{
            paddingTop: '150px',
          }}>
                <Row>
                    <Col
                        className='rounded-top-4'
                        lg={12}
                        style={{
                            borderLeft: "1px solid #CCCCCC",
                            borderRight: "1px solid #CCCCCC",
                            borderTop: "1px solid #CCCCCC",
                            padding: "15px 25px",
                            display: "flex",
                            alignContent: "center",
                            gap: "15px",
                        }}
                    >
                        <ion-icon
                            name="location-outline"
                            style={{
                                fontSize: "24px",
                            }}
                        ></ion-icon>{" "}
                        <p className="m-0">Địa điểm</p>
                        <p className="m-0 fw-medium">Quảng Trị</p>
                    </Col>
                </Row>
                <Row
                    style={{
                        border: "1px solid #CCCCCC",
                    }}
                >
                    <Col
                        lg={6}
                        style={{
                            borderRight: "1px solid #CCCCCC",
                            padding: "15px 25px",
                        }}
                    >
                        <h6 className='mb-3'>Khách du lịch</h6>
                        <div className="d-flex gap-3">
                            <img
                                src={user.avatarUrl || 'https://i.ytimg.com/vi/o2vTHtPuLzY/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLDNfIoZ06P2icz2VCTX_0bZUiewiw'}
                                alt="avatar"
                                className="rounded-circle object-fit-cover"
                                height={60}
                                width={60}
                            />
                            <div className='d-flex flex-column justify-content-center'>
                                <p className="mb-2 fw-bold">{user.FullName}</p>
                                <small className="fw-medium">{profile.profile?.address|| 'Quảng Nam'}</small>
                            </div>
                        </div>
                    </Col>
                    <Col
                        lg={6}
                        style={{
                            padding: "15px 25px",
                        }}
                    >
                        <h6 className='mb-3'>Người địa phương</h6>
                        <div className="d-flex justify-content-between align-items-center">
                            <div className="d-flex gap-3">
                                <img
                                    src={contract_selected.localProfile.imageUser}
                                    alt="avatar"
                                    className="rounded-circle object-fit-cover"
                                    height={60}
                                    width={60}
                                />
                                <div className='d-flex flex-column justify-content-center'>
                                    <p className="mb-2 fw-bold">{"NGUYỄN MINH QUÂN"}</p>
                                    <small className="fw-medium">{contract_selected.location}</small>
                                </div>
                            </div>
    
                        </div>
                    </Col>
                </Row>
        
            <Row
                className="rounded-bottom-4"
                style={{
                    border: "1px solid #CCCCCC",
                    borderTop: '0px'
                }}
            >
                <Col
                    lg={6}
                    style={{
                        borderRight: "1px solid #CCCCCC",
                        padding: "10px 25px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "15px",
                    }}
                >
                     <div className=''>
                        <h6 className='fw-semibold' style={{
                            paddingBottom: '10px',
                        }}>Đánh giá người địa phương</h6>
                        <div className='d-flex gap-2 mb-3' style={{ color: '#ebc600' }}>
                            {[1, 2, 3, 4, 5].map(i => (
                                <ion-icon
                                    key={i}
                                    name={i <= star ? "star" : "star-outline"}
                                    style={{ cursor: "pointer" }}
                                    onClick={() => setStar(i)}
                                ></ion-icon>
                            ))}
                        </div>
                    </div>
                   <div>
                        <h6 className='fw-semibold'>Nội dung bài viết</h6>
                        <TextareaAutosize
                            className='w-100 p-2 rounded-3 form-control mb-2'
                            minRows={5}
                            value={caption}
                            onChange={(e) => setCaption(e.target.value)}
                        />
                   </div>
                   
                    <div>
                        <h6 className='fw-semibold'>Ảnh chuyến đi</h6>
                        <Button variant='outline-dark' className='rounded-5' onClick={() => document.getElementById('upload_img_traveller').click()}>Nhấn vào đây để upload</Button>
                        <input type="file" className='d-none' id='upload_img_traveller' multiple onChange={handleImageUpload} />
                        <div className='row mt-3'>
                            {images.map((image, index) => (
                                <div className='col col-lg-4 mb-4 position-relative' key={index}>
                                    <img src={image} alt='' className='w-100 rounded-4 object-fit-cover' />
                                    <button
                                        className='btn btn-danger position-absolute top-0 end-0 m-1'
                                        onClick={() => handleRemoveImage(index)}
                                    >
                                        X
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </Col>
                <Col
                    lg={6}
                    style={{
                        padding: "25px",
                    }}
                >
                    <div className='h-75'></div>
                    <div className='d-flex justify-content-end align-items-end mt-4'>
                        <Button variant='success' className='rounded-5' onClick={handleFinishContract}>
                            Hoàn thành
                        </Button>
                    </div>
                </Col>
            </Row>
            </div>
        </div>
    );
}

export default FinishContractTraveller;
