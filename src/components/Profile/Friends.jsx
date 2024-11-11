import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ReactPaginate from 'react-paginate';
import { useSelector } from 'react-redux';
import '../../assets/css/Shared/Pagination.css';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

function Friends() {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 4;
  const token = useSelector((state) => state.auth.token);
  const url = import.meta.env.VITE_BASE_API_URL;

  useEffect(() => {
    const fetchFriends = async () => {
      const storedFriends = localStorage.getItem('friendsData');

      if (storedFriends) {
        console.log("Dữ liệu bạn bè từ localStorage:", storedFriends);
        // Nếu có dữ liệu trong localStorage, chuyển vào state và dừng loading
        setFriends(JSON.parse(storedFriends));
        setLoading(false);
      } else {
        try {
          const response = await axios.get(`${url}/api/Friendship/current-user/friends`, {
            headers: {
              Authorization: `${token}`,
            },
          });

          setFriends(response.data.$values);
          // Lưu dữ liệu vào localStorage
          localStorage.setItem('friendsData', JSON.stringify(response.data.$values));
        } catch (error) {
          console.error('Lỗi khi lấy dữ liệu bạn bè:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchFriends();
  }, [token, url]);

  // Tính toán các trang và chỉ số của các thẻ bạn bè hiện tại
  const pagesVisited = currentPage * itemsPerPage;
  const displayedFriends = friends.slice(pagesVisited, pagesVisited + itemsPerPage);
  const pageCount = Math.ceil(friends.length / itemsPerPage);

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  return (
    <div style={{ background: '#f9f9f9',  }} className='rounded-5 py-3 px-0'>
      <h2 className="mb-4 text-success fw-bold text-header-profile mt-3">BẠN BÈ</h2>
      {/* Grid layout for the cards */}
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
          displayedFriends.map((friend, index) => (
            <div key={index} style={{
              border: '1px solid black',
              padding: '20px',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center'
            }}>
              <img
                src={friend.profile.imageUser}
                alt={friend.profile.fullName}
                style={{ width: '60px', height: '60px', borderRadius: '50%', marginRight: '15px', objectFit: 'cover' }} // Điều chỉnh kích thước ảnh
              />
              <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h5 style={{ margin: 0, fontWeight: 'bold' }}>{friend.profile.fullName}</h5>
                  <p style={{ margin: 0 }}>{friend.profile.city}</p>
                </div>
                <i className="bi bi-three-dots"></i>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Center the button and remove background */}
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
