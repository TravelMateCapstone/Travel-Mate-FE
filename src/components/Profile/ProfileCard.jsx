import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Dropdown, DropdownButton } from "react-bootstrap";
import { useSelector } from "react-redux";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import "../../assets/css/Profile/ProfileCard.css";
import { Link, useLocation } from "react-router-dom";
import { toast } from 'react-toastify'; // Import react-toastify


function ProfileCard() {
  const [profile, setProfile] = useState(null);
  const [languages, setLanguages] = useState(null);
  const [education, setEducation] = useState(null);
  const token = useSelector((state) => state.auth.token);
  const url = import.meta.env.VITE_BASE_API_URL;
  const location = useLocation();
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    if (location.pathname === "/others-profile") {
      // Lấy dữ liệu từ localStorage khi ở đường dẫn /others-profile
      const othersProfile = JSON.parse(localStorage.getItem('othersProfile'));
      const othersLanguages = JSON.parse(localStorage.getItem('othersLanguages'))?.$values || [];
      const othersEducation = JSON.parse(localStorage.getItem('othersEducation'))?.$values || [];

      if (othersProfile) {
        setProfile(othersProfile);
      }
      if (othersLanguages) {
        setLanguages(othersLanguages);
      }
      if (othersEducation) {
        setEducation(othersEducation);
      }
    } else {
      // Gọi API khi ở đường dẫn /profile
      const fetchProfileData = async () => {
        try {
          const profileResponse = await axios.get(`${url}/api/Profile/current-profile`, {
            headers: { Authorization: token },
          });
          setProfile(profileResponse.data);

          const languagesResponse = await axios.get(`${url}/api/SpokenLanguages/current-user`, {
            headers: { Authorization: token },
          });
          setLanguages(languagesResponse.data.$values);

          const educationResponse = await axios.get(`${url}/api/UserEducation/current-user`, {
            headers: { Authorization: token },
          });
          setEducation(educationResponse.data.$values);
        } catch (error) {
          console.error("Lỗi khi lấy dữ liệu:", error);
        }
      };

      fetchProfileData();
    }
  }, [token, url, location.pathname]);

  if (!profile || !languages || !education) {
    return (
      <div className="d-flex justify-content-center profile-card">
        <div className="profile-card-container">
          <div className="d-flex justify-content-center profile-image-wrapper">
            <Skeleton circle={true} width={192} height={192} />
          </div>
          <div className="profile-info">
            <Skeleton width={120} height={20} />
            <Skeleton width={100} height={20} />
            <Skeleton width={150} height={20} />
            <Skeleton width={100} height={40} style={{ marginRight: "10px" }} />
            <Skeleton width={100} height={40} />
            <Skeleton width={200} height={20} />
            <Skeleton width={180} height={20} />
            <Skeleton width={150} height={20} />
            <Skeleton width={160} height={20} />
            <Skeleton width={140} height={20} />
          </div>
        </div>
      </div>
    );
  }

  const registrationYear = profile?.user?.registrationTime
    ? new Date(profile.user.registrationTime).getFullYear()
    : "Không xác định";

  const handleSendFriendRequest = async () => {
    try {
      // Lấy userId từ othersProfile
      const userId = profile.userId;

      console.log("check id", userId);
      // Gửi yêu cầu kết bạn đến API
      const response = await axios.post(
        `${url}/api/Friendship/send?toUserId=${userId}`,
        {},
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success('Bạn đã gửi yêu cầu kết bạn thành công!');
      }
    } catch (error) {
      console.error('Lỗi khi gửi yêu cầu kết bạn:', error);
      toast.error('Lỗi khi gửi yêu cầu kết bạn. Vui lòng thử lại sau.');
    }
  };

  return (
    <div className="d-flex justify-content-center profile-card">
      <div className="profile-card-container">
        <div className="d-flex justify-content-center profile-image-wrapper">
          <img
            className="rounded-circle"
            src={profile.imageUser || "default-image-url"}
            alt="User profile"
            width={192}
            height={192}
          />
        </div>
        <div className="profile-info">
          <p className="text-center fw-medium profile-name">
            {location.pathname === "/profile"
              ? user?.FullName
              : `${profile.firstName} ${profile.lastName}`}
          </p>
          <div className="d-flex align-items-center gap-1">
            <ion-icon name="location-outline"></ion-icon>
            <p className="m-0">{profile.city}</p>
          </div>
          <p className="fw-medium text-center" style={{ fontSize: "20px", color: "#007931" }}>
            {profile.hostingAvailability || "Chưa xác định"}
          </p>
          {location.pathname === "/profile" ? (
            <div className="profile-buttons">
              <Button as={Link} to="/profile-edit" variant="success" className="profile-button profile-button-success">
                Chỉnh sửa
              </Button>
              <Button as={Link} to="/setting" variant="secondary" className="profile-button profile-button-secondary">
                Cài đặt
              </Button>
            </div>
          ) : (
            <div className="profile-buttons">
              <Button as={Link} to="/send-request" variant="success" className="profile-button profile-button-success">
                Gửi yêu cầu
              </Button>
              <DropdownButton
                id="dropdown-options"
                title="Tùy chọn"
                variant="secondary"
                className="profile-button-options"
              >
                <Dropdown.Item onClick={handleSendFriendRequest}>Kết bạn</Dropdown.Item>
                <Dropdown.Item onClick={() => toast.info('Bạn đã báo cáo người dùng này!')}>Báo cáo</Dropdown.Item>
              </DropdownButton>
            </div>
          )}
          <hr className="border-line" />

          <div className="d-flex flex-column justify-content-between">
            <p className="profile-location">
              <ion-icon name="location-outline"></ion-icon>
              <p className="m-0">{profile.address}</p>
            </p>
            <p className="profile-education">
              <ion-icon name="book-outline"></ion-icon>
              <p className="m-0">{education?.[0]?.university?.universityName || "Không có thông tin"}</p>
            </p>

            <p className="profile-language">
              <ion-icon name="language-outline"></ion-icon>
              <p className="m-0">{languages ? languages.map(lang => lang.languages.languagesName).join(", ") : "Không có thông tin"}</p>
            </p>
            <p className="profile-joined">
              <ion-icon name="person-add-outline"></ion-icon>
              <p className="m-0">Thành viên tham gia từ {registrationYear}</p>
            </p>
            <p className="profile-completion">
              <ion-icon name="shield-checkmark-outline"></ion-icon>
              <p className="m-0">65% hoàn thành hồ sơ</p>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileCard;
