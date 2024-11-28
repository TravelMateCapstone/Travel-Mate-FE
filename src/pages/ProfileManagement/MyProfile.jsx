import React, { useState } from 'react';
import { Container, Tab, Tabs } from 'react-bootstrap';
import '../../assets/css/ProfileManagement/MyProfile.css';
import { useSelector, useDispatch } from 'react-redux';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../../firebaseConfig';
import { toast } from 'react-toastify';
import { updateUserAvatar } from '../../redux/actions/authActions';
import CreateTour from '../../components/ProfileManagement/CreateTour';
import AboutMe from '../../components/Profile/MyProfile/AboutMe';
import MyHome from '../../components/Profile/MyProfile/MyHome';
import MyPastTrip from '../../components/Profile/MyProfile/MyPastTrip';
import MyFriends from '../../components/Profile/MyProfile/MyFriends';
import MyFavorites from '../../components/Profile/MyProfile/MyFavorists';
import { useLocation, useNavigate } from 'react-router-dom';
import { viewProfile } from '../../redux/actions/profileActions';

import axios from "axios";

function MyProfile() {
    const [key, setKey] = useState('introduce');
    const dispatch = useDispatch();
    const location = useLocation();

    const [profile, setProfile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const token = useSelector((state) => state.auth.token);
    const user = useSelector((state) => state.auth.user);
    const dataProfile = useSelector((state) => state.profile);

    const url = import.meta.env.VITE_BASE_API_URL;


    const handleImageUpload = async (event) => {
        const file = event.target.files[0];
        if (file) {
            setIsUploading(true);

            try {
                const storageRef = ref(storage, `profile-images/${file.name}`);
                await uploadBytes(storageRef, file);
                const downloadURL = await getDownloadURL(storageRef);

                await axios.put(
                    `${url}/api/Profile/current-user/update-image`,
                    downloadURL,
                    {
                        headers: {
                            Authorization: `${token}`,
                            "Content-Type": "application/json",
                        },
                    }
                );

                setProfile((prevProfile) => ({
                    ...prevProfile,
                    imageUser: downloadURL,
                }));
                dispatch(viewProfile(user.id));
                toast.success("Cập nhật ảnh đại diện thành công!");
                dispatch(updateUserAvatar(downloadURL));
            } catch (error) {
                console.error("Lỗi khi cập nhật ảnh:", error);
            } finally {
                setIsUploading(false);
            }
        }
    };
    const registrationDate = dataProfile?.profile?.user?.registrationTime
        ? new Date(dataProfile.profile.user.registrationTime).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
        : "Không rõ";

    return (
        <Container>

            <div className='info_section'>
                <div className='info_user_profile'>
                    <div className="profile-image-wrapper">
                        <img src={dataProfile.profile.imageUser} alt="avatar" />
                        <label htmlFor="upload-image" className="upload-icon">
                            <ion-icon name="camera-outline"></ion-icon>
                        </label>
                        <input
                            type="file"
                            id="upload-image"
                            accept="image/*"
                            onChange={handleImageUpload}
                        />
                    </div>

                    <div className='info_user_profile_content'>
                        <h4>{dataProfile.profile.user.fullName}</h4>
                        <p className='fw-medium d-flex align-items-center gap-2'><ion-icon name="location-outline"></ion-icon> {dataProfile.profile.city}</p>
                        <p className='fw-medium d-flex align-items-center gap-2'><ion-icon name="person-add-outline"></ion-icon> Thành viên tham gia từ {registrationDate}</p>
                        <p className='text-success fw-medium  d-flex align-items-center gap-2'><ion-icon name="shield-checkmark-outline"></ion-icon> 65% hoàn thành hồ sơ</p>
                    </div>
                </div>

                <CreateTour />
            </div>

            <div className="edit_section">
                <Tabs
                    id="controlled-tab-example"
                    activeKey={key}
                    onSelect={(k) => setKey(k)}
                    className="mb-3 no-border-radius"
                >
                    <Tab eventKey="introduce" title="GIỚI THIỆU">
                        <AboutMe />
                    </Tab>
                    <Tab eventKey="myHome" title="NHÀ CỦA TÔI">
                        <MyHome />
                    </Tab>
                    <Tab eventKey="trip" title="CHUYẾN ĐI">
                        <MyPastTrip />
                    </Tab>
                    <Tab eventKey="friend" title="BẠN BÈ">
                        <MyFriends />
                    </Tab>
                    <Tab eventKey="destination" title="TOURS">
                        <MyFavorites />
                    </Tab>
                </Tabs>
            </div>
        </Container>
    );
}

export default MyProfile;