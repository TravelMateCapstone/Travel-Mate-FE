import React, { useEffect, useState } from 'react';
import TimeLine from '../../components/Contracts/TimeLine';
import { Button, Col, Row } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import TextareaAutosize from 'react-textarea-autosize';
import axios from 'axios';
import { toast } from 'react-toastify';
import { storage } from '../../../firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { set } from 'date-fns';

function FinishContractLocal() {
    const user = useSelector((state) => state.auth.user);
    const token = useSelector((state) => state.auth.token);
    const [images, setImages] = useState([]);
    const [review, setReview] = useState('');
    const [star, setStar] = useState(0);
    const participant = JSON.parse(localStorage.getItem('participant'));
    
    const [postParticipant, setPostParticipant] = useState();
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
        if (!review.trim()) {
            toast.error("Đánh giá không được để trống.");
            return;
        }
        const formData = {
            localId: parseInt(user.id),
            comment: review
        };
        console.log('formData', formData);
        
        try {
            const response = await axios.put(
                `https://travelmateapp.azurewebsites.net/api/PastTripPost/local?postId=${participant.postId}`,
                formData,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `${token}`,
                    },
                }
            );
            toast.success("Phản hồi bài viết khách du lịch thành công.");
            console.log(response.data);
        } catch (error) {
            alert("Đã xảy ra lỗi trong quá trình kết nối.");
            console.error("Error:", error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`https://travelmateapp.azurewebsites.net/api/PastTripPosts/UserTrips/${participant.participantId}`, {
                    headers: {
                        Authorization: `${token}`,
                    },
                });
                console.log('response', response.data.$values[response.data.$values.length - 1]);
                setPostParticipant(response.data.$values[response.data.$values.length - 1]);
                setStar(response.data.$values[response.data.$values.length - 1].star);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, [])

    return (
        <div>
            <TimeLine activeStep={3} />
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
                        padding: "25px",
                    }}
                >
                    <h6>Khách du lịch</h6>
                    <div className="d-flex gap-2">
                        <img
                            src={'https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg'}
                            alt="avatar"
                            className="rounded-circle object-fit-cover"
                            height={60}
                            width={60}
                        />
                        <div>
                            <p className="m-0 fw-bold">{participant.fullName}</p>
                            <sub className="fw-medium">Quảng Nam</sub>
                        </div>
                    </div>
                </Col>
                <Col
                    lg={6}
                    style={{
                        padding: "25px",
                    }}
                >
                    <h6>Người địa phương</h6>
                    <div className="d-flex justify-content-between align-items-center">
                        <div className="d-flex gap-2">
                            <img
                                src={user.avatarUrl}
                                alt="avatar"
                                className="rounded-circle object-fit-cover"
                                height={60}
                                width={60}
                            />
                            <div>
                                <p className="m-0 fw-bold">{user.FullName}</p>
                                <sub className="fw-medium">Quảng Nam</sub>
                            </div>
                        </div>
                        <div className='d-flex gap-4 flex-column align-items-end'>
                            <sub>Đánh giá của khách du lịch</sub>
                            <div className='d-flex gap-4' style={{ color: '#FFD600' }}>
                                {[1, 2, 3, 4, 5].map(i => (
                                    <ion-icon
                                        key={i}
                                        name={i <= star ? "star" : "star-outline"}
                                        style={{ cursor: "pointer" }}
                  
                                    ></ion-icon>
                                ))}
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
                    }}
                >
                    <h5 className="">Nội dung bài viết</h5>
                    <p>
                        {postParticipant?.caption}
                    </p>
                    <h5>Ảnh chuyến đi</h5>
                    <input type="file" className='d-none' id='upload_img_traveller' multiple onChange={handleImageUpload} />
                    <div className='row mt-3'>
                        {postParticipant?.postPhotos.$values.map((image, index) => (
                            <div className='col col-lg-4 mb-4 position-relative'>
                                <img src={image.photoUrl} alt='' className='w-100 rounded-4 object-fit-cover' />
                            </div>
                        ))}
                    </div>
                </Col>
                <Col
                    lg={6}
                    style={{
                        padding: "25px",
                    }}
                >
                    <h5 className="">Đánh giá của người địa phương</h5>
                    <TextareaAutosize
                        className='w-100 p-2 rounded-3'
                        minRows={5}
                        value={review}
                        onChange={(e) => setReview(e.target.value)}
                    />
                    <div className='d-flex justify-content-end'>
                        <Button variant='success' className='rounded-5' onClick={handleFinishContract}>
                            Hoàn thành
                        </Button>
                    </div>
                </Col>
            </Row>
        </div>
    );
}

export default FinishContractLocal;
