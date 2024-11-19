import React, { memo, useEffect, useState, useCallback, useMemo } from "react";
import axios from "axios";
import { Button, Dropdown, DropdownButton } from "react-bootstrap";
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
import { useQuery } from 'react-query';

function ProfileCard() {
  const [isUploading, setIsUploading] = useState(false);
  const token = useSelector((state) => state.auth.token);
  const url = import.meta.env.VITE_BASE_API_URL;
  const user = useSelector((state) => state.auth.user);
  const location = useLocation();
  const dispatch = useDispatch();

  const fetchProfile = async () => {
    const response = await axios.get(`${url}/api/Profile/current-profile`, { headers: { Authorization: token } });
    return response.data;
  };

  const fetchLanguages = async () => {
    const response = await axios.get(`${url}/api/SpokenLanguages/current-user`, { headers: { Authorization: token } });
    return response.data.$values;
  };

  const fetchEducation = async () => {
    const response = await axios.get(`${url}/api/UserEducation/current-user`, { headers: { Authorization: token } });
    return response.data.$values;
  };

  const { data: profile, isLoading: isProfileLoading } = useQuery('profile', fetchProfile, { retry: false });
  const { data: languages, isLoading: isLanguagesLoading } = useQuery('languages', fetchLanguages, { retry: false });
  const { data: education, isLoading: isEducationLoading } = useQuery('education', fetchEducation, { retry: false });

  const handleImageUpload = useCallback(async (event) => {
    const file = event.target.files[0];
    if (file) {
      setIsUploading(true);
      try {
        const storageRef = ref(storage, `profile-images/${file.name}`);
        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);
        await axios.put(`${url}/api/Profile/current-user/update-image`, downloadURL, {
          headers: { Authorization: token, "Content-Type": "application/json" }
        });
        toast.success('Cập nhật ảnh đại diện thành công !');
        dispatch(updateUserAvatar(downloadURL));
      } catch (error) {
        console.error("Lỗi khi cập nhật ảnh:", error);
      } finally {
        setIsUploading(false);
      }
    }
  }, [dispatch, token, url]);

  const handleSendFriendRequest = useCallback(async () => {
    try {
      const userId = profile.userId;
      const response = await axios.post(`${url}/api/Friendship/send?toUserId=${userId}`, {}, {
        headers: { Authorization: token }
      });
      if (response.status === 200) {
        toast.success('Bạn đã gửi yêu cầu kết bạn thành công!');
      }
    } catch (error) {
      console.error('Lỗi khi gửi yêu cầu kết bạn:', error);
      toast.error('Lỗi khi gửi yêu cầu kết bạn. Vui lòng thử lại sau.');
    }
  }, [profile, token, url]);

  if (isProfileLoading || isLanguagesLoading || isEducationLoading) {
    return (
      <div className="d-flex justify-content-center profile-card">
        <div className="profile-card-container position-relative">
          <div className="d-flex justify-content-center profile-image-wrapper position-absolute">
            <div style={{ position: "relative", top: '-30px' }}>
              <Skeleton circle={true} width={192} height={192} />
            </div>
          </div>
          <div className="profile-info">
            <p className="text-center fw-medium profile-name">
              <Skeleton width={120} height={20} />
            </p>
            <p className="fw-medium text-center" style={{ fontSize: "20px", color: "#007931" }}>
              <Skeleton width={100} height={20} />
            </p>
            <div className="profile-buttons" style={{ marginTop: '24px', marginBottom: '24px' }}>
              <Skeleton width={100} height={40} style={{ marginRight: "10px" }} />
              <Skeleton width={100} height={40} />
            </div>
            <hr className="border-line" />
            <div className="d-flex flex-column justify-content-between" style={{ gap: '20px' }}>
              <div className="profile-location">
                <Skeleton width={200} height={20} />
              </div>
              <div className="profile-education">
                <Skeleton width={180} height={20} />
              </div>
              <div className="profile-language">
                <Skeleton width={150} height={20} />
              </div>
              <div className="profile-joined">
                <Skeleton width={160} height={20} />
              </div>
              <div className="profile-completion">
                <Skeleton width={140} height={20} />
              </div>
            </div>
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
              src={user.avatarUrl || "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg"}
              alt="User profile"
              width={192}
              height={192}
              style={{ border: '2px solid #d9d9d9' }}
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
          <p className="text-center fw-medium profile-name">
            {user?.FullName || 'Chưa cập nhật'}
          </p>
          <p className="fw-medium text-center text-uppercase" style={{ fontSize: "20px", color: "#007931" }}>
            {profile?.hostingAvailability || "Chưa xác định"}
          </p>
          <div className="profile-buttons" style={{ marginTop: '24px', marginBottom: '24px' }}>
            {location.pathname === RoutePath.PROFILE || location.pathname === RoutePath.PROFILE_EDIT || location.pathname === RoutePath.PROFILE_EDIT_MY_HOME ? (
              <>
                {location.pathname === RoutePath.PROFILE_EDIT || location.pathname === RoutePath.PROFILE_EDIT_MY_HOME ? (
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
              </>
            ) : (
              <>
                <Button as={Link} to="/chat" variant="success" className="profile-button profile-button-success">
                  <span className="send-request">Gửi yêu cầu</span>
                </Button>
                <DropdownButton
                  id="dropdown-options"
                  variant="custom"
                  className="profile-button-options"
                  title={
                    <span style={{ color: 'white' }}>
                      Tùy chọn <ion-icon name="chevron-down-outline" style={{ color: 'white' }}></ion-icon>
                    </span>
                  }
                >
                  <Dropdown.Item onClick={handleSendFriendRequest}>
                    <span className="icon-option">
                      <ion-icon name="person-add-outline"></ion-icon>
                    </span>
                    Kết bạn
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => toast.success('Bạn đã báo cáo người dùng này!')}>
                    <span className="icon-option">
                      <ion-icon name="warning-outline"></ion-icon>
                    </span>
                    Báo cáo
                  </Dropdown.Item>
                </DropdownButton>

              </>
            )}
          </div>
          <hr className="border-line" />
          <div className="d-flex flex-column justify-content-between" style={{ gap: '20px' }}>
            <div className="profile-location">
              <ion-icon name="location-outline"></ion-icon>
              <span className="m-0">{profile?.address || "Không có thông tin"}</span>
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

export default memo(ProfileCard);
