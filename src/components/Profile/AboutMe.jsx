import React, { useState, useEffect } from 'react';
import { useSelector } from "react-redux";
import { Container, Row, Col } from 'react-bootstrap';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { useLocation } from 'react-router-dom';
import "../../assets/css/Profile/AboutMe.css";
import FormBuilder from './FormBuilder/FormBuilder';
import RoutePath from '../../routes/RoutePath';

function AboutMe() {
  const dataProfile = useSelector(state => state.profile);
  const location = useLocation(); // Sử dụng useLocation để xác định URL hiện tại

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (dataProfile && dataProfile.profile) {
      setLoading(false);
    }
  }, [dataProfile]);

  const renderDataOrFallback = (data) => {
    return data ? data : <span style={{ fontStyle: 'italic', color: '#6c757d' }}>Người dùng chưa cập nhập</span>;
  };

  return (
    <Container className='py-3 px-0 border-0 rounded-5' style={{ background: '#f9f9f9' }}>
      <Row className='w-100'>
        <Col md={12}>
          <div className='d-flex align-items-center justify-content-between'>
            <h2 className="mb-4 text-success fw-bold text-header-profile mt-3">GIỚI THIỆU</h2>
            {/* Chỉ hiển thị FormBuilder nếu ở RoutePath.PROFILE */}
            {location.pathname === RoutePath.PROFILE && <FormBuilder />}
          </div>
          <ul className="cbp_tmtimeline">
            <li>
              <div className="cbp_tmicon"><i className="zmdi zmdi-label"></i></div>
              <div className="cbp_tmlabel">
                <h4>MÔ TẢ</h4>
                <p>{loading ? <Skeleton width={200} height={20} /> : renderDataOrFallback(dataProfile.profile.description)}</p>
              </div>
            </li>
            <li>
              <div className="cbp_tmicon"><i className="zmdi zmdi-label"></i></div>
              <div className="cbp_tmlabel">
                <h4>TẠI SAO TÔI SỬ DỤNG TRAVEL MATE</h4>
                <p>{loading ? <Skeleton width={200} height={20} /> : renderDataOrFallback(dataProfile.profile.whyUseTravelMate)}</p>
              </div>
            </li>
            <li>
              <div className="cbp_tmicon"><i className="zmdi zmdi-case"></i></div>
              <div className="cbp_tmlabel">
                <h4>SỞ THÍCH</h4>
                <div className='d-flex favorite-tag'>
                  {loading ? (
                    <Skeleton width={100} height={20} count={3} className="mx-2" />
                  ) : (
                    dataProfile.activities && dataProfile.activities.$values && dataProfile.activities.$values.length > 0
                      ? dataProfile.activities.$values.map((activityItem, index) => (
                        <div key={index} className="small border border-dark btn mx-3 rounded-pill text-success">
                          {activityItem.activity.activityName}
                        </div>
                      ))
                      : <span style={{ fontStyle: 'italic', color: '#6c757d' }}>Người dùng chưa cập nhập</span>
                  )}
                </div>
              </div>
            </li>
            <li>
              <div className="cbp_tmicon"><i className="zmdi zmdi-case"></i></div>
              <div className="cbp_tmlabel">
                <h4>ÂM NHẠC, PHIM ẢNH & SÁCH</h4>
                <p>{loading ? <Skeleton width={200} height={20} /> : renderDataOrFallback(dataProfile.profile.musicMoviesBooks)}</p>
              </div>
            </li>
            <li>
              <div className="cbp_tmicon"><i className="zmdi zmdi-case"></i></div>
              <div className="cbp_tmlabel">
                <h4>TÔI CÓ THỂ CHIA SẺ GÌ VỚI BẠN</h4>
                <p>{loading ? <Skeleton width={200} height={20} /> : renderDataOrFallback(dataProfile.profile.whatToShare)}</p>
              </div>
            </li>
          </ul>
        </Col>
      </Row>
    </Container>
  );
}

export default React.memo(AboutMe);
