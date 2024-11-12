import React, { useEffect, useState } from 'react';
import { Container, Button } from 'react-bootstrap';
import ReactPaginate from 'react-paginate';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

function Favorites() {
  // State for favorites data and pagination
  const [favorites, setFavorites] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 4; // Number of items per page
  const token = useSelector((state) => state.auth.token);
  const url = import.meta.env.VITE_BASE_API_URL;
  const location = useLocation();

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        if (location.pathname === '/others-profile') {
          // Lấy dữ liệu từ localStorage nếu là trang /others-profile
          const othersLocation = JSON.parse(localStorage.getItem('othersLocation'));
          setFavorites(othersLocation?.$values || []);
        } else {
          // Gọi API nếu là trang /profile
          const response = await axios.get(`${url}/api/UserLocationsWOO/get-current-user`, {
            headers: {
              Authorization: `${token}`,
            },
          });
          setFavorites(response.data.$values);
        }
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu địa điểm yêu thích:', error);
      }
    };
    fetchFavorites();
  }, [token, url, location.pathname]);

  // Function to handle page change
  const handlePageChange = (data) => {
    setCurrentPage(data.selected);
  };

  // Calculate current items to display
  const displayedFavorites = favorites.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

  return (
    <Container className='py-3 px-0 border-0 rounded-5' style={{
      boxShadow: '0 0 4px rgba(0, 0, 0, 0.25)'
    }}>
      <h2 className="mb-4 text-success fw-bold text-header-profile mt-3">
        ĐỊA ĐIỂM ƯA THÍCH
      </h2>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gridGap: '20px 60px',
      }} className='px-5'>
        {displayedFavorites.map((favorite) => (
          <div key={favorite.location.locationId} style={{
            border: '1px solid black',
            padding: '20px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center'
          }}>
            <img
              src={'https://cdn.oneesports.vn/cdn-data/sites/4/2024/01/Zed_38.jpg'}
              alt={favorite.location.locationName}
              style={{ width: '60px', height: '60px', borderRadius: '50%', marginRight: '15px', objectFit: 'cover' }}
            />
            <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h5 style={{ margin: 0, fontWeight: 'bold' }}>{favorite.location.locationName}</h5>
                <p style={{ margin: 0 }}>Việt Nam</p>
              </div>
              <i className="bi bi-three-dots"></i>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="d-flex justify-content-center align-items-center mt-4">
        <ReactPaginate
          previousLabel={'<'}
          nextLabel={'>'}
          breakLabel={'...'}
          breakClassName={'break-me'}
          pageCount={Math.ceil(favorites.length / itemsPerPage)}
          marginPagesDisplayed={2}
          pageRangeDisplayed={2}
          onPageChange={handlePageChange}
          containerClassName={'pagination'}
          activeClassName={'active-pagination'}
          previousClassName={'previous'}
          nextClassName={'next'}
        />
      </div>
    </Container>
  );
}

export default Favorites;
