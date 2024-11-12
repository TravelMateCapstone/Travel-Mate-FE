import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import "../../assets/css/Profile/AboutMe.css";

function AboutMe() {
  const [profile, setProfile] = useState(null);
  const [activities, setActivities] = useState([]);
  const token = useSelector((state) => state.auth.token);
  const baseUrl = import.meta.env.VITE_BASE_API_URL;
  const location = useLocation(); // Sử dụng để kiểm tra đường dẫn hiện tại

  useEffect(() => {
    const fetchProfileAndActivities = async () => {
      if (location.pathname === '/others-profile') {
        // Nếu đang ở trang hồ sơ người khác, lấy dữ liệu từ localStorage
        const othersProfile = JSON.parse(localStorage.getItem('othersProfile'));
        const othersActivity = JSON.parse(localStorage.getItem('othersActivity'));

        if (othersProfile) {
          setProfile(othersProfile);
        } else {
          console.error('Lỗi khi lấy dữ liệu hồ sơ từ localStorage');
        }

        if (othersActivity?.$values) {
          setActivities(othersActivity.$values.map(item => item.activity));
        } else {
          console.error('Lỗi khi lấy dữ liệu hoạt động từ localStorage');
        }
      } else if (location.pathname === '/profile') {
        // Nếu đang ở trang hồ sơ cá nhân, lấy dữ liệu từ API
        try {
          const profileResponse = await axios.get(`${baseUrl}/api/Profile/current-profile`, {
            headers: { Authorization: `${token}` },
          });

          if (profileResponse.data) {
            const profileData = profileResponse.data;
            setProfile(profileData);
          }

          const activitiesResponse = await axios.get(`${baseUrl}/api/UserActivitiesWOO/current-user`, {
            headers: { Authorization: `${token}` },
          });

          if (activitiesResponse.data?.$values) {
            const activitiesData = activitiesResponse.data.$values;
            setActivities(activitiesData);
          }
        } catch (error) {
          console.error('Error fetching data from API:', error);
        }
      }
    };
    fetchProfileAndActivities();
  }, [token, baseUrl, location.pathname]);

  return (
    <Container className='py-3 px-0 border-0 rounded-5' style={{ boxShadow: '0 0 4px rgba(0, 0, 0, 0.25)' }}>
      <Row>
        <Col md={12}>
          <h2 className="mb-4 text-success fw-bold text-header-profile mt-3">GIỚI THIỆU</h2>
          <ul className="cbp_tmtimeline">
            <li>
              <div className="cbp_tmicon"><i className="zmdi zmdi-label"></i></div>
              <div className="cbp_tmlabel">
                <h4>MÔ TẢ</h4>
                <p>{profile ? profile.description : <Skeleton width={200} height={20} />}</p>
              </div>
            </li>
            <li>
              <div className="cbp_tmicon"><i className="zmdi zmdi-label"></i></div>
              <div className="cbp_tmlabel">
                <h4>TẠI SAO TÔI SỬ DỤNG TRAVEL MATE</h4>
                <p>{profile ? profile.whyUseTravelMate : <Skeleton width={200} height={20} />}</p>
              </div>
            </li>
            <li>
              <div className="cbp_tmicon"><i className="zmdi zmdi-case"></i></div>
              <div className="cbp_tmlabel">
                <h4>SỞ THÍCH</h4>
                <div className='d-flex favorite-tag'>
                  {activities.length > 0 ? (
                    activities.map((activity, index) => (
                      <div key={index} className="small border border-dark btn mx-3 rounded-pill">
                        {activity.activityName}
                      </div>
                    ))
                  ) : (
                    <Skeleton width={200} height={20} />
                  )}
                </div>
              </div>
            </li>
            <li>
              <div className="cbp_tmicon"><i className="zmdi zmdi-case"></i></div>
              <div className="cbp_tmlabel">
                <h4>ÂM NHẠC, PHIM ẢNH & SÁCH</h4>
                <p>{profile ? profile.musicMoviesBooks : <Skeleton width={200} height={20} />}</p>
              </div>
            </li>
            <li>
              <div className="cbp_tmicon"><i className="zmdi zmdi-case"></i></div>
              <div className="cbp_tmlabel">
                <h4>TÔI CÓ THỂ CHIA SẺ GÌ VỚI BẠN</h4>
                <p>{profile ? profile.whatToShare : <Skeleton width={200} height={20} />}</p>
              </div>
            </li>
          </ul>
        </Col>
      </Row>
    </Container>
  );
}

export default AboutMe;
