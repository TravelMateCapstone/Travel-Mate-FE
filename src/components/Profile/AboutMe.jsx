import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Container, Row, Col } from 'react-bootstrap';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import "../../assets/css/Profile/AboutMe.css";

function AboutMe() {
  const [profile, setProfile] = useState(null);
  const [activities, setActivities] = useState([]);
  const token = useSelector((state) => state.auth.token);
  const baseUrl = import.meta.env.VITE_BASE_API_URL;

  useEffect(() => {
    const fetchProfileAndActivities = async () => {
      try {
        // Fetching the profile data
        const profileResponse = await axios.get(`${baseUrl}/api/Profile/current-profile`, {
          headers: { Authorization: `${token}` },
        });

        if (profileResponse.data) {
          const profileData = profileResponse.data;
          setProfile(profileData);
          // localStorage.setItem('profileData', JSON.stringify(profileData));
        }

        // Fetching user activities
        const activitiesResponse = await axios.get(`${baseUrl}/api/UserActivitiesWOO/current-user`, {
          headers: { Authorization: `${token}` },
        });

        if (activitiesResponse.data?.$values) {
          const activitiesData = activitiesResponse.data.$values;
          setActivities(activitiesData);
          // localStorage.setItem('activitiesData', JSON.stringify(activitiesData));
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchProfileAndActivities();

    // Load from localStorage or fetch from API
    // const storedProfile = localStorage.getItem('profileData');
    // const storedActivities = localStorage.getItem('activitiesData');
    // if (storedProfile && storedActivities) {
    //   setProfile(JSON.parse(storedProfile));
    //   setActivities(JSON.parse(storedActivities));
    // } else {
    //   fetchProfileAndActivities();
    // }
  }, [token, baseUrl]);

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
