import React, { useCallback, useMemo } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { useQuery } from 'react-query';
import "../../assets/css/Profile/AboutMe.css";
import FormBuilder from './FormBuilder/FormBuilder';

function AboutMe() {
  const token = useSelector((state) => state.auth.token);
  const baseUrl = import.meta.env.VITE_BASE_API_URL;
  const location = useLocation();

  const fetchProfile = useCallback(async () => {
    const response = await axios.get(`${baseUrl}/api/Profile/current-profile`, {
      headers: { Authorization: `${token}` },
    });
    return response.data?.$values || response.data;
  }, [token, baseUrl]);

  const fetchActivities = useCallback(async () => {
    const response = await axios.get(`${baseUrl}/api/UserActivitiesWOO/current-user`, {
      headers: { Authorization: `${token}` },
    });
    return response.data?.$values || response.data;
  }, [token, baseUrl]);

  const { data: profile, isLoading: isProfileLoading } = useQuery(
    ['profile', token, baseUrl],
    fetchProfile,
    { enabled: !!token }
  );

  const { data: activities, isLoading: isActivitiesLoading } = useQuery(
    ['activities', token, baseUrl],
    fetchActivities,
    { enabled: !!token }
  );

  const profileDescription = useMemo(() => (
    isProfileLoading ? <Skeleton width={200} height={20} /> : profile?.description
  ), [isProfileLoading, profile]);

  const profileWhyUseTravelMate = useMemo(() => (
    isProfileLoading ? <Skeleton width={200} height={20} /> : profile?.whyUseTravelMate
  ), [isProfileLoading, profile]);

  const profileMusicMoviesBooks = useMemo(() => (
    isProfileLoading ? <Skeleton width={200} height={20} /> : profile?.musicMoviesBooks
  ), [isProfileLoading, profile]);

  const profileWhatToShare = useMemo(() => (
    isProfileLoading ? <Skeleton width={200} height={20} /> : profile?.whatToShare
  ), [isProfileLoading, profile]);

  const activitiesList = useMemo(() => (
    isActivitiesLoading ? (
      <Skeleton width={200} height={20} />
    ) : (
      activities?.map((activity, index) => (
        <div key={index} className="small border border-dark btn mx-3 rounded-pill text-success">
          {activity.activityName}
        </div>
      ))
    )
  ), [isActivitiesLoading, activities]);

  return (
    <Container className='py-3 px-0 border-0 rounded-5' style={{ background: '#f9f9f9' }}>
      <Row className='w-100'>
        <Col md={12}>
          <div className='d-flex align-items-center justify-content-between'>
            <h2 className="mb-4 text-success fw-bold text-header-profile mt-3">GIỚI THIỆU</h2>
            <FormBuilder/>
          </div>
          <ul className="cbp_tmtimeline">
            <li>
              <div className="cbp_tmicon"><i className="zmdi zmdi-label"></i></div>
              <div className="cbp_tmlabel">
                <h4>MÔ TẢ</h4>
                <p>{profileDescription}</p>
              </div>
            </li>
            <li>
              <div className="cbp_tmicon"><i className="zmdi zmdi-label"></i></div>
              <div className="cbp_tmlabel">
                <h4>TẠI SAO TÔI SỬ DỤNG TRAVEL MATE</h4>
                <p>{profileWhyUseTravelMate}</p>
              </div>
            </li>
            <li>
              <div className="cbp_tmicon"><i className="zmdi zmdi-case"></i></div>
              <div className="cbp_tmlabel">
                <h4>SỞ THÍCH</h4>
                <div className='d-flex favorite-tag'>
                  {activitiesList}
                </div>
              </div>
            </li>
            <li>
              <div className="cbp_tmicon"><i className="zmdi zmdi-case"></i></div>
              <div className="cbp_tmlabel">
                <h4>ÂM NHẠC, PHIM ẢNH & SÁCH</h4>
                <p>{profileMusicMoviesBooks}</p>
              </div>
            </li>
            <li>
              <div className="cbp_tmicon"><i className="zmdi zmdi-case"></i></div>
              <div className="cbp_tmlabel">
                <h4>TÔI CÓ THỂ CHIA SẺ GÌ VỚI BẠN</h4>
                <p>{profileWhatToShare}</p>
              </div>
            </li>
          </ul>
        </Col>
      </Row>
    </Container>
  );
}

export default React.memo(AboutMe);
