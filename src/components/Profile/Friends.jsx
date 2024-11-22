import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ReactPaginate from 'react-paginate';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import '../../assets/css/Shared/Pagination.css';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { Dropdown } from 'react-bootstrap';
import { toast } from 'react-toastify';
import RoutePath from '../../routes/RoutePath';
import { viewProfile } from '../../redux/actions/profileActions';
import "../../assets/css/Profile/Friends.css";

function Friends() {
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 8;


  const url = import.meta.env.VITE_BASE_API_URL;

  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.auth.user);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const dataProfile = useSelector(state => state.profile);

  // Lấy danh sách bạn bè từ dataProfile
  const friends = dataProfile.friends && dataProfile.friends.$values ? dataProfile.friends.$values : [];

  useEffect(() => {
    if (dataProfile && dataProfile.friends) {
      setLoading(false);
    }
  }, [dataProfile]);

  // Phân trang
  const pagesVisited = currentPage * itemsPerPage;
  const displayedFriends = friends.slice(pagesVisited, pagesVisited + itemsPerPage);
  const pageCount = Math.ceil(friends.length / itemsPerPage);

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  // Hàm xử lý khi nhấn nút "Hủy kết bạn"
  const handleUnfriend = async (userIdRequest) => {
    try {
      const response = await axios.delete(
        `${url}/api/Friendship/remove?friendUserId=${userIdRequest}`,
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      if (response.status === 200) {
        dispatch(viewProfile(user.id));
        toast.success('Hủy kết bạn thành công!');
        // Xóa bạn bè khỏi danh sách trực tiếp từ Redux hoặc cần yêu cầu lại API
      }
    } catch (error) {
      console.error('Lỗi khi hủy kết bạn:', error);
      toast.error('Lỗi khi hủy kết bạn!');
    }
  };

  // Hàm xử lý khi nhấn "Xem hồ sơ"
  const handleViewProfile = (friendId) => {
    if (parseInt(friendId) === parseInt(user.id)) {
      dispatch(viewProfile(friendId));
      navigate(RoutePath.PROFILE);
    } else {
      dispatch(viewProfile(friendId));
      navigate(RoutePath.OTHERS_PROFILE);
    }

  };

  return (
    <div style={{ background: '#f9f9f9', }} className='rounded-5 py-3 px-0 item-container'>
      <h2 className="mb-4 text-success fw-bold text-header-profile mt-3">BẠN BÈ</h2>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gridGap: '20px 60px',
      }} className='px-5'>
        {loading ? (
          [...Array(itemsPerPage)].map((_, index) => (
            <div key={index} style={{
              border: '1px solid black',
              padding: '20px',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center'
            }}>
              <Skeleton circle={true} height={60} width={60} style={{ marginRight: '15px' }} />
              <div style={{ flex: 1 }}>
                <Skeleton count={1} height={20} />
                <Skeleton count={1} height={15} />
              </div>
            </div>
          ))
        ) : (
          friends.length === 0 ? (
            <div className="text-center" style={{ fontStyle: 'italic', color: '#6c757d' }}>
              Bạn chưa có bạn bè
            </div>
          ) : (
            displayedFriends.map((friend, index) => (
              <div key={index} style={{
                border: '1px solid black',
                padding: '20px',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                background: 'white'
              }}>
                <img
                  src={friend.profile?.imageUser || 'https://via.placeholder.com/60'}
                  alt={friend.profile?.lastName || 'Avatar'}
                  style={{ width: '60px', height: '60px', borderRadius: '50%', marginRight: '15px', objectFit: 'cover' }}
                />
                <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h5 style={{ margin: 0, fontWeight: 'bold' }}>{friend.profile?.firstName} {friend.profile?.lastName}</h5>
                    <p style={{ margin: 0 }}>{friend.profile?.city}</p>
                  </div>
                  <Dropdown>
                    <Dropdown.Toggle variant="link" id="dropdown-basic" style={{ padding: 0, margin: 0 }}>
                      <ion-icon name="ellipsis-horizontal-outline"></ion-icon>
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item onClick={() => handleViewProfile(friend.friendId)}>
                        Xem hồ sơ
                      </Dropdown.Item>
                      {location.pathname !== `${RoutePath.OTHERS_PROFILE}` && (
                        <Dropdown.Item onClick={() => handleUnfriend(friend.friendId)}>Hủy kết bạn</Dropdown.Item>
                      )}
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
              </div>
            ))
          )
        )}
      </div>
      {pageCount > 1 && (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: '20px'
        }}>
          <ReactPaginate
            previousLabel={'<'}
            nextLabel={'>'}
            breakLabel={'...'}
            breakClassName={'break-me'}
            pageCount={pageCount}
            marginPagesDisplayed={2}
            pageRangeDisplayed={2}
            onPageChange={handlePageChange}
            containerClassName={'pagination'}
            activeClassName={'active-pagination'}
            previousClassName={'previous'}
            nextClassName={'next'}
          />
        </div>
      )}
    </div>
  );
}

export default Friends;
