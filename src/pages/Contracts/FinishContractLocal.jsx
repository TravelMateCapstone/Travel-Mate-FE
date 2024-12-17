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
    const [additional, setAdditional] = useState();
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
                setPostParticipant(response.data.$values[response.data.$values.length - 1]);
                setStar(response.data.$values[response.data.$values.length - 1].star);
            } catch (error) {
                console.error("Error fetching data:", error);
            }

            try {
                const additionalResponse = await axios.get(`https://travelmateapp.azurewebsites.net/api/PastTripPost/${participant.postId}`, {
                    headers: {
                        Authorization: `${token}`,
                    },
                });
                setAdditional(additionalResponse.data);
                // Handle additional data as needed
            } catch (error) {
                console.error("Error fetching additional data:", error);
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
                            <sub className="fw-medium">{participant.address || 'Chưa cập nhật'}</sub>
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
                                <sub className="fw-medium">{additional?.location || 'Đà Nẵng' }</sub>
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
                   
                    <div className='d-flex gap-4 flex-column mb-3'>
                        <div className='d-flex gap-2' style={{ color: '#FFD600' }}>
                            {[1, 2, 3, 4, 5].map(i => (
                                <ion-icon
                                    key={i}
                                    name={i <= additional?.star ? "star" : "star-outline"}
                                    style={{ cursor: "pointer" }}
                                ></ion-icon>
                            ))}
                        </div>
                    </div>
                    <p>
                        {additional?.caption}
                    </p>
                    <input type="file" className='d-none' id='upload_img_traveller' multiple onChange={handleImageUpload} />
                    <div className='row mt-3'>
                        {additional?.tripImages.$values.map((image, index) => (
                            <div className='col col-lg-4 mb-4 position-relative' key={index}>
                                <img src={image} alt='' className='w-100 rounded-4 object-fit-cover' />
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
                    <h6 className="">Đánh giá của người địa phương</h6>
                    <TextareaAutosize
                        className='w-100 p-2 rounded-3 form-control'
                        minRows={5}
                        value={review}
                        onChange={(e) => setReview(e.target.value)}
                    />
                    <div className='d-flex justify-content-end mt-4'>
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
