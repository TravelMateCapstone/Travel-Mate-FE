import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Container, Row, Col } from 'react-bootstrap';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import "../../assets/css/Profile/AboutMe.css";
import FormSubmit from '../../components/Shared/FormSubmit'
function AboutMe() {
  const [profile, setProfile] = useState(null);
  const [activities, setActivities] = useState(null);
  const token = useSelector((state) => state.auth.token);
  const url = import.meta.env.VITE_BASE_API_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedProfile = localStorage.getItem('profileData');
        const storedActivities = localStorage.getItem('activitiesData');

        // If data is already in localStorage, use it
        if (storedProfile && storedActivities) {
          setProfile(JSON.parse(storedProfile));
          setActivities(JSON.parse(storedActivities));
        } else {
          // Otherwise, fetch from API
          const profileResponse = await axios.get(`${url}/api/profile`, {
            headers: {
              Authorization: `${token}`,
            },
          });

          if (profileResponse.data?.$values && Array.isArray(profileResponse.data.$values)) {
            const profileData = profileResponse.data.$values[6];
            setProfile(profileData);
            localStorage.setItem('profileData', JSON.stringify(profileData));
          } else {
            console.log("Không tìm thấy dữ liệu profile.");
          }

          const activitiesResponse = await axios.get(`https://travelmateapp.azurewebsites.net/api/UserActivitiesWOO/current-user`, {
            headers: { Authorization: `${token}` },
          });

          if (activitiesResponse.data?.$values) {
            const activitiesData = activitiesResponse.data.$values;
            setActivities(activitiesData);
            localStorage.setItem('activitiesData', JSON.stringify(activitiesData));
          }
        }
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu:', error);
      }
    };

    fetchData();
  }, [token, url]);

  return (
    <Container className='py-3 px-0 border-0 rounded-5' style={{
      boxShadow: '0 0 4px rgba(0, 0, 0, 0.25)'
    }}>
      <Row>
        <Col md={12}>
        <div className='d-flex align-items-center justify-content-between'>
        <h2 className="mb-4 text-success fw-bold text-header-profile mt-3">GIỚI THIỆU</h2>
        <FormSubmit buttonText={'Lưu thay đổi'} openModalText={'Tạo mẫu thông tin'} title={'Mẫu câu hỏi thông tin'}>
        <div>
    {/* Câu hỏi 1 */}
    <div className="mb-4">
      <label className="fw-bold">Tôn giáo của bạn là gì?</label>
      <div>
        <input type="checkbox" id="buddhism" name="religion" value="Buddhism" checked />
        <label htmlFor="buddhism" className="ms-2">Phật giáo</label>
      </div>
      <div>
        <input type="checkbox" id="catholic" name="religion" value="Catholic" />
        <label htmlFor="catholic" className="ms-2">Công giáo</label>
      </div>
      <div>
        <input type="checkbox" id="none" name="religion" value="None" />
        <label htmlFor="none" className="ms-2">Không</label>
      </div>
    </div>

    {/* Câu hỏi 2 */}
    <div className="mb-4">
      <label className="fw-bold">Bạn hay chơi vị trí nào trong bóng đá?</label>
      <div>
        <input type="checkbox" id="forward" name="position" value="Forward" checked />
        <label htmlFor="forward" className="ms-2">Tiền đạo</label>
      </div>
      <div>
        <input type="checkbox" id="defender" name="position" value="Defender" checked />
        <label htmlFor="defender" className="ms-2">Hậu vệ</label>
      </div>
      <div>
        <input type="checkbox" id="goalkeeper" name="position" value="Goalkeeper" />
        <label htmlFor="goalkeeper" className="ms-2">Thủ môn</label>
      </div>
    </div>

    {/* Nút thêm mẫu câu hỏi */}
    <div className="mt-4">
      <a href="#" className="text-primary" style={{ display: 'inline-flex', alignItems: 'center' }}>
        <i className="zmdi zmdi-plus-circle-outline me-1"></i> Tạo thêm mẫu câu hỏi
      </a>
    </div>
  </div>
        </FormSubmit>
        </div>
         
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
                  {activities ? (
                    <p className="small border border-dark btn mx-3 rounded-pill">{activities.map(activity => activity.activityName).join(", ")}</p>
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
