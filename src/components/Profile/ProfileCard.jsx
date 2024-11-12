import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import "../../assets/css/Profile/ProfileCard.css";
import { Link, useLocation } from "react-router-dom";
import RoutePath from "../../routes/RoutePath";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../../firebaseConfig";
import { updateUserAvatar } from "../../redux/actions/authActions";
import { toast } from "react-toastify";


function ProfileCard() {
  const [profile, setProfile] = useState(null);
  const [languages, setLanguages] = useState(null);
  const [education, setEducation] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const token = useSelector((state) => state.auth.token);
  const url = import.meta.env.VITE_BASE_API_URL;
  const user = useSelector((state) => state.auth.user);
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const profileResponse = await axios.get(`${url}/api/Profile/current-profile`, {
          headers: { Authorization: `${token}` },
        });
        setProfile(profileResponse.data);

        const languagesResponse = await axios.get(`${url}/api/SpokenLanguages/current-user`, {
          headers: { Authorization: `${token}` },
        });
        setLanguages(languagesResponse.data.$values);

        const educationResponse = await axios.get(`${url}/api/UserEducation/current-user`, {
          headers: { Authorization: `${token}` },
        });
        setEducation(educationResponse.data.$values);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
      }
    };

    fetchProfileData();
  }, [token]);
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
        toast.success('Cập nhật ảnh đại diện thành công !');
        // Dispatch action để cập nhật avatar trong Redux
        dispatch(updateUserAvatar(downloadURL));
      } catch (error) {
        console.error("Lỗi khi cập nhật ảnh:", error);
      } finally {
        setIsUploading(false);
      }
    }
  };
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
      <div className="profile-card-container position-relative">
        <div className="d-flex justify-content-center profile-image-wrapper position-absolute">
          <div style={{ position: "relative", top: '-30px' }}>
            <img
              className="rounded-circle object-fit-cover"
              src={profile.imageUser || "default-image-url"}
              alt="User profile"
              width={192}
              height={192}
              style={{
                border: '2px solid #d9d9d9'
              }}
            />
            <label htmlFor="upload-image" className="upload-icon position-absolute top-0 text-white">
              <ion-icon name="camera-outline"></ion-icon>
            </label>
            <input
              type="file"
              id="upload-image"
              accept="image/*"
              onChange={handleImageUpload}
              style={{ display: "none" }}
            />
          </div>
        </div>
        <div className="profile-info">
          <div className="fw-medium text-center" style={{
            fontSize: "24px",
            marginBottom: '10px'
          }}>{user.username}</div>
          <p className="fw-medium text-center text-uppercase text" style={{ fontSize: "20px", color: "#007931", }}>
            {profile.hostingAvailability}
          </p>
          <div className="profile-buttons" style={{
            marginTop: '24px',
            marginBottom: '24px',
          }}>
            {(location.pathname === RoutePath.PROFILE_EDIT || location.pathname === RoutePath.PROFILE_EDIT_MY_HOME) ? (
              <Button as={Link} to={RoutePath.PROFILE} variant="success" className="profile-button profile-button-success">
                Hồ sơ
              </Button>
            ) : (
              <Button as={Link} to={RoutePath.PROFILE_EDIT} variant="success" className="profile-button profile-button-success">
                Chỉnh sửa
              </Button>
            )}
            <Button as={Link} to={RoutePath.SETTING} variant="secondary" className="profile-button profile-button-secondary">
              Cài đặt
            </Button>
          </div>
          <hr className="border-line" />

          <div className="d-flex flex-column justify-content-between" style={{
            gap: '20px'
          }}>
            <div className="profile-location">
              <ion-icon name="location-outline"></ion-icon>
              <span className="m-0">{profile.address}</span>
            </div>

            <div className="profile-education">
              <ion-icon name="book-outline"></ion-icon>
              <span className="m-0">{education?.[0]?.university?.universityName || "Không có thông tin"}</span>
            </div>

            <div className="profile-language">
              <ion-icon name="language-outline"></ion-icon>
              <span className="m-0">{languages ? languages.map(lang => lang.languages.languagesName).join(", ") : "Không có thông tin"}</span>
            </div>

            <div className="profile-joined">
              <ion-icon name="person-add-outline"></ion-icon>
              <span className="m-0">Thành viên tham gia từ 2024</span>
            </div>

            <div className="profile-completion">
              <ion-icon name="shield-checkmark-outline"></ion-icon>
              <span className="m-0">65% hoàn thành hồ sơ</span>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileCard;
