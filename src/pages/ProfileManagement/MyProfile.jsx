import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Col, Container, Row } from 'react-bootstrap'
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Form from 'react-bootstrap/Form';
import Dropdown from 'react-bootstrap/Dropdown';
import Modal from 'react-bootstrap/Modal';
import '../../assets/css/ProfileManagement/MyProfile.css'
import PostProfile from '../../components/Profile/PostProfile';
import { useSelector } from 'react-redux';
import UploadImageComponent from '../../components/Shared/UploadImageComponent';

import MyFavorites from '../../components/Profile//MyProfile/MyFavorists';
import MyFriends from '../../components/Profile/MyProfile/MyFriends';
import MyHome from '../../components/Profile/MyProfile/MyHome';
import MyPastTrip from '../../components/Profile/MyProfile/MyPastTrip';
import AboutMe from '../../components/Profile/MyProfile/AboutMe';

import CreateTour from '../../components/ProfileManagement/CreateTour';

function MyProfile() {
    const [key, setKey] = useState('introduce');
    const [showModalForm, setShowModalForm] = useState(false);
    const handleShowModalForm = () => setShowModalForm(true);
    const handleCloseModalForm = () => setShowModalForm(false);
    const [uploadedImages, setUploadedImages] = useState([]);
    const [posts, setPosts] = useState([]);

    const [languages, setLanguages] = useState([]); // danh sách ngôn ngữ trong hệ thống
    const [language, setLanguage] = useState();

    const [hobbies, setHobbies] = useState([]); // danh sách sở thích trong hệ thống
    const [hobbie, setHobbie] = useState();

    const [educations, setEducations] = useState([]); // danh sách giáo dục trong hệ thống
    const [education, setEducation] = useState();

    const [locations, setLocations] = useState([]);
    const [city, setCity] = useState();

    const dataProfile = useSelector(state => state.profile);

    const handleUploadImages = (urls) => {
        setUploadedImages(urls);
    };
    console.log("profile", dataProfile);
    useEffect(() => {
        // Lấy ra trip
        if (dataProfile?.trip?.$values && Array.isArray(dataProfile.trip.$values)) {
            setPosts(dataProfile.trip.$values);
        }
        fetchLocations();


        fetchLanguages();
        fetchHobbies();
        fetchEducation();
    }, [dataProfile]);

    // Lấy ra 64 tỉnh thành
    const fetchLocations = async () => {
        try {
            const response = await axios.get('https://provinces.open-api.vn/api/p/');
            const locationData = response.data.map((location) => ({
                ...location,
                name: location.name.replace(/^Tỉnh |^Thành phố /, ''),
            }));
            setLocations(locationData);
        } catch (error) {
            console.error("Error fetching locations:", error);
        }
    };

    // Lấy ra danh sách sở thích
    const fetchHobbies = async () => {
        try {
            const response = await fetch("https://travelmateapp.azurewebsites.net/api/Activity");
            const data = await response.json();
            setHobbies(data.$values || []);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách sở thích:", error);
        }
    };

    //Lấy danh sách Education
    const fetchEducation = async () => {
        try {
            const response = await fetch("https://travelmateapp.azurewebsites.net/api/University");
            const data = await response.json();
            setEducations(data.$values || []);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách giáo dục:", error);
        }
    };

    // API get All ngôn ngữ 
    const fetchLanguages = async () => {
        try {
            const response = await fetch("https://travelmateapp.azurewebsites.net/api/Languages");
            const data = await response.json();
            setLanguages(data.$values || []);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách ngôn ngữ:", error);
        }
    };

    // Thời gian tham gia
    const registrationDate = dataProfile?.profile?.user?.registrationTime
        ? new Date(dataProfile.profile.user.registrationTime).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
        : "Không rõ";

    // Chỉnh sửa Profile
    const handleEditProfile = async () => {

    }

    return (
        <Container>

            <div className='info_section'>
                <div className='info_user_profile'>
                    <img
                        src={dataProfile.profile.imageUser}
                        alt="avatar"
                        width={150}
                        height={150}
                        className='rounded-circle object-fit-cover'
                        style={{
                            border: "2px solid #d9d9d9",
                        }} />

                    <div className='info_user_profile_content'>
                        <h4>{dataProfile.profile.user.fullName}</h4>
                        <p className='fw-medium d-flex align-items-center gap-2'><ion-icon name="location-outline"></ion-icon> {dataProfile.profile.city}</p>
                        <p className='fw-medium d-flex align-items-center gap-2'><ion-icon name="person-add-outline"></ion-icon> Thành viên tham gia từ {registrationDate}</p>
                        <p className='text-success fw-medium  d-flex align-items-center gap-2'><ion-icon name="shield-checkmark-outline"></ion-icon> 65% hoàn thành hồ sơ</p>
                    </div>
                </div>
                <CreateTour />
            </div>

            <div className='edit_section'>

                {/* <Button variant='warning' className='rounded-5' onClick={handleEditProfile}>Chỉnh sửa hồ sơ</Button> */}
                <Tabs
                    id="controlled-tab-example"
                    activeKey={key}
                    onSelect={(k) => setKey(k)}
                    className="mb-3 no-border-radius"
                >
                    {/* Tab giới thiệu */}
                    <Tab eventKey="introduce" title="GIỚI THIỆU">
                        <AboutMe />
                    </Tab>

                    {/* Tab nhà của tôi */}
                    <Tab eventKey="myHome" title="NHÀ CỦA TÔI">
                        <MyHome />
                    </Tab>
                    {/* Tab Chuyến đi */}
                    <Tab eventKey="trip" title="CHUYẾN ĐI">
                        <MyPastTrip />
                    </Tab>

                    {/* Tab bạn bè  */}
                    <Tab eventKey="friend" title="BẠN BÈ">
                        <MyFriends />
                    </Tab>
                    <Tab eventKey="destination" title="ĐỊA ĐIỂM">
                        <MyFavorites />
                    </Tab>
                </Tabs>
            </div>

        </Container>
    )
}

export default MyProfile