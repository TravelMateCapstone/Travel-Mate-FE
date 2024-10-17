import React from "react";
import { Button } from "react-bootstrap";
import "../../assets/css/Profile/ProfileCard.css";
import { Link } from "react-router-dom";
import RoutePath from "../../routes/RoutePath";

function ProfileCard() {
  return (
    <div className="d-flex justify-content-center profile-card">
      <div className="profile-card-container">
        <div className="d-flex justify-content-center profile-image-wrapper">
          <img
            className="rounded-circle"
            src="https://yt3.googleusercontent.com/oN0p3-PD3HUzn2KbMm4fVhvRrKtJhodGlwocI184BBSpybcQIphSeh3Z0i7WBgTq7e12yKxb=s900-c-k-c0x00ffffff-no-rj"
            alt=""
            width={192}
            height={192}
          />
        </div>
        <div className="profile-info">
          <p className="text-center fw-medium profile-name">
            Trần Duy Nguyễn Nhơn
          </p>
          <div className="d-flex align-items-center gap-1">
            <ion-icon name="location-outline"></ion-icon>
            <p className="m-0">Ngũ Hành sơn, Đà Nẵng, Việt Nam</p>
          </div>
          <p className="fw-medium text-center" style={{ fontSize: "20px", color: "#007931" }}>
            Chào đón khách
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
              <p className="m-0">Ngũ Hành sơn, Đà Nẵng, Việt Nam</p>
            </p>
            <p className="profile-education">
              <ion-icon name="book-outline"></ion-icon>
              <p className="m-0">Đại học FPT Đà Nẵng</p>
            </p>
            <p className="profile-language">
              <ion-icon name="language-outline"></ion-icon>
              <p className="m-0">Tiếng Anh, Tiếng Nhật</p>
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
