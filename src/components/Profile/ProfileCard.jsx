import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "react-bootstrap";
import { useSelector } from "react-redux";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import "../../assets/css/Profile/ProfileCard.css";
import { Link } from "react-router-dom";
import RoutePath from "../../routes/RoutePath";

function ProfileCard() {
  const [profile, setProfile] = useState(null);
  const [languages, setLanguages] = useState(null);
  const [education, setEducation] = useState(null);
  const token = useSelector((state) => state.auth.token);
  const url = import.meta.env.VITE_BASE_API_URL;

  useEffect(() => {
    // Lấy dữ liệu từ localStorage nếu có
    const storedProfile = localStorage.getItem("profile");
    const storedLanguages = localStorage.getItem("languages");
    const storedEducation = localStorage.getItem("education");

    if (storedProfile && storedLanguages && storedEducation) {
      setProfile(JSON.parse(storedProfile));
      setLanguages(JSON.parse(storedLanguages));
      setEducation(JSON.parse(storedEducation));
    } else {
      // Nếu chưa có trong localStorage, gọi API và lưu dữ liệu vào localStorage
      const fetchProfileData = async () => {
        try {
          const profileResponse = await axios.get(`${url}/api/Profile/current-profile`, {
            headers: { Authorization: `${token}` },
          });
          setProfile(profileResponse.data);
          localStorage.setItem("profile", JSON.stringify(profileResponse.data));

          const languagesResponse = await axios.get(`${url}/api/SpokenLanguages/current-user`, {
            headers: { Authorization: `${token}` },
          });
          setLanguages(languagesResponse.data.$values);
          localStorage.setItem("languages", JSON.stringify(languagesResponse.data.$values));

          const educationResponse = await axios.get(`${url}/api/UserEducation/current-user`, {
            headers: { Authorization: `${token}` },
          });
          setEducation(educationResponse.data.$values);
          localStorage.setItem("education", JSON.stringify(educationResponse.data.$values));
        } catch (error) {
          console.error("Lỗi khi lấy dữ liệu:", error);
        }
      };

      fetchProfileData();
    }
  }, [token]);

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
            {profile.fullName}
          </p>
          <div className="d-flex align-items-center gap-1">
            <ion-icon name="location-outline"></ion-icon>
            <p className="m-0">{profile.city}</p>
          </div>
          <p className="fw-medium text-center" style={{ fontSize: "20px", color: "#007931" }}>
            {profile.hostingAvailability}
          </p>
          <div className="profile-buttons">
            <Button as={Link} to={RoutePath.PROFILE_EDIT} variant="success" className="profile-button profile-button-success">
              Chỉnh sửa
            </Button>
            <Button as={Link} to={RoutePath.SETTING} variant="secondary" className="profile-button profile-button-secondary">
              Cài đặt
            </Button>
          </div>
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
              <p className="m-0">Thành viên tham gia từ 2024</p>
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
