import React, { useState } from 'react';
import TimeLine from '../../components/Contracts/TimeLine';
import { Button, Col, Row } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import TextareaAutosize from 'react-textarea-autosize';
import axios from 'axios';
import { toast } from 'react-toastify';
import { storage } from '../../../firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

function FinishContractLocal() {
    const user = useSelector((state) => state.auth.user);
    const token = useSelector((state) => state.auth.token);
    const [images, setImages] = useState([]);
    const [caption, setCaption] = useState('');
    const [star, setStar] = useState(0);

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
        const postPhotos = images.map(image => ({ photoUrl: image }));
        const formData = {
            location: "Đà Lạt, Việt Nam",
            isPublic: true,
            caption: caption,
            review: 'Bạn thật là một người đồng hành tuyệt vời chuyến đi rất vui.', // Dùng cùng nội dung cho review
            star: star,
            postPhotos: postPhotos,
        };

        try {
            const response = await axios.post(
                "https://travelmateapp.azurewebsites.net/api/PastTripPosts?travelerId=8&localId=9",
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
            alert("Đã xảy ra lỗi trong quá trình kết nối.");
            console.error("Error:", error);
        }
    };

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
                            src={user.avatarUrl || 'https://i.ytimg.com/vi/o2vTHtPuLzY/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLDNfIoZ06P2icz2VCTX_0bZUiewiw'}
                            alt="avatar"
                            className="rounded-circle object-fit-cover"
                            height={60}
                            width={60}
                        />
                        <div>
                            <p className="m-0 fw-bold">{user.username}</p>
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
                                src={
                                    "https://scontent.fdad3-6.fna.fbcdn.net/v/t39.30808-6/329970312_896924391503385_2352475357586137104_n.jpg?stp=c0.169.1536.1536a_dst-jpg_s206x206_tt6&_nc_cat=101&ccb=1-7&_nc_sid=fe5ecc&_nc_ohc=zb9TW46mvTMQ7kNvgGeCyrB&_nc_zt=23&_nc_ht=scontent.fdad3-6.fna&_nc_gid=ACPCAcNUTB0nTIZvBDzPLhP&oh=00_AYCJfBTypoMb0NT920bkOi6sqvj6igNb3GfMSNufoKknvg&oe=676134E3"
                                }
                                alt="avatar"
                                className="rounded-circle object-fit-cover"
                                height={60}
                                width={60}
                            />
                            <div>
                                <p className="m-0 fw-bold">{"NGUYỄN MINH QUÂN"}</p>
                                <sub className="fw-medium">Quảng Nam</sub>
                            </div>
                        </div>
                        <div className='d-flex gap-4 flex-column align-items-end'>
                            <sub>Đánh giá người địa phương</sub>
                            <div className='d-flex gap-4' style={{ color: '#FFD600' }}>
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
                    <TextareaAutosize
                        className='w-100 p-2 rounded-3'
                        minRows={5}
                        value={caption}
                        onChange={(e) => setCaption(e.target.value)}
                    />
                    <h5>Ảnh chuyến đi</h5>
                    <Button variant='outline-secondary' className='rounded-5' onClick={() => document.getElementById('upload_img_traveller').click()}>Nhấn vào đây để upload</Button>
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
                </Col>
                <Col
                    lg={6}
                    style={{
                        padding: "25px",
                    }}
                >
                    <h5 className="">Đánh giá của người địa phương</h5>
                    <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Tincidunt curabitur in ornare natoque adipiscing pretium conubia fusce sociosqu morbi. Facilisi tincidunt magnis laoreet nunc ullamcorper ultricies lobortis quis aliquam leo.
                    </p>
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
