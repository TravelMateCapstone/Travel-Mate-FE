import React, { useState } from 'react';
import axios from 'axios';
import ReactPaginate from 'react-paginate';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import '../../assets/css/Shared/Pagination.css';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { Dropdown } from 'react-bootstrap';
import { toast } from 'react-toastify';
import RoutePath from '../../routes/RoutePath';

function Friends() {
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 4;
  const token = useSelector((state) => state.auth.token);
  const url = import.meta.env.VITE_BASE_API_URL;
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFriends = async () => {
      if (location.pathname === '/others-profile') {
        const othersListFriend = JSON.parse(localStorage.getItem('othersListFriend'));
        if (othersListFriend) {
          setFriends(othersListFriend.$values || []);
        } else {
          console.error('Lỗi khi lấy dữ liệu bạn bè từ localStorage');
        }
        setLoading(false);
      } else if (location.pathname === '/profile') {
        try {
          const response = await axios.get(`${url}/api/Friendship/current-user/friends`, {
            headers: {
              Authorization: `${token}`,
            },
          });

          setFriends(response.data.$values);
        } catch (error) {
          console.error('Lỗi khi lấy dữ liệu bạn bè:', error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchFriends();
  }, [token, url, location.pathname]);

  const pagesVisited = currentPage * itemsPerPage;
  const displayedFriends = friends.slice(pagesVisited, pagesVisited + itemsPerPage);
  const pageCount = Math.ceil(friends.length / itemsPerPage);

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  const handleViewProfile = async (friendId) => {
    try {
      const othersUserProfile = await axios.get(`https://travelmateapp.azurewebsites.net/api/Profile/${friendId}`);
      localStorage.setItem('othersProfile', JSON.stringify(othersUserProfile.data));

      const userProfileResponse = await axios.get(`https://travelmateapp.azurewebsites.net/api/UserHome/user/${friendId}`);
      localStorage.setItem('othersHome', JSON.stringify(userProfileResponse.data));

      const userActivitiesResponse = await axios.get(`https://travelmateapp.azurewebsites.net/api/UserActivitiesWOO/user/${friendId}`);
      localStorage.setItem('othersActivity', JSON.stringify(userActivitiesResponse.data));

      const userFriendsResponse = await axios.get(`https://travelmateapp.azurewebsites.net/api/Friendship/List-friends/${friendId}`);
      localStorage.setItem('othersListFriend', JSON.stringify(userFriendsResponse.data));

      const othersLocation = await axios.get(`https://travelmateapp.azurewebsites.net/api/UserLocationsWOO/user/${friendId}`);
      localStorage.setItem('othersLocation', JSON.stringify(othersLocation.data));

      const othersUserEducation = await axios.get(`https://travelmateapp.azurewebsites.net/api/UserEducation/user/${friendId}`);
      localStorage.setItem('othersEducation', JSON.stringify(othersUserEducation.data));

      const othersUserLanguages = await axios.get(`https://travelmateapp.azurewebsites.net/api/SpokenLanguages/user/${friendId}`);
      localStorage.setItem('othersLanguages', JSON.stringify(othersUserLanguages.data));

      navigate(RoutePath.OTHERS_PROFILE);
    } catch (error) {
      toast.error("Lỗi khi lấy thông tin hồ sơ!");
      console.error("Error fetching user profile, activities, or friends:", error);
    }
  };

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
        toast.success('Hủy kết bạn thành công!');
        setFriends((prevFriends) => prevFriends.filter(friend => friend.friendId !== userIdRequest));
      }
    } catch (error) {
      console.error('Lỗi khi hủy kết bạn:', error);
      toast.error('Lỗi khi hủy kết bạn!');
    }
  };

  return (
    <div style={{ background: '#f9f9f9', }} className='rounded-5 py-3 px-0'>
      <h2 className="mb-4 text-success fw-bold text-header-profile mt-3">BẠN BÈ</h2>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gridGap: '20px 60px',
      }} className='px-5'>
        {isLoading ? (
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
          displayedFriends.map((friend, index) => (
            <div key={index} style={{
              border: '1px solid black',
              padding: '20px',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center'
            }}>
              <img
                src={friend.profile?.imageUser}
                alt={friend.profile?.lastName}
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
                    <Dropdown.Item onClick={() => handleViewProfile(friend.friendId)}>Xem hồ sơ</Dropdown.Item>
                    {location.pathname !== '/others-profile' && (
                      <Dropdown.Item onClick={() => handleUnfriend(friend.friendId)}>Hủy kết bạn</Dropdown.Item>
                    )}
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </div>
          ))
        )}
      </div>
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
    </div>
  );
}

export default Friends;
