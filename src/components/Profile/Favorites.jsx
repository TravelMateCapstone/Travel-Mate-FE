import React, { useState } from 'react';
import { Card, Image, Container, Row, Col, Button } from 'react-bootstrap';
import ReactPaginate from 'react-paginate';

const favoritesData = [
  { id: 1, name: 'Phố cổ Hội An', location: 'Quảng Nam, Việt Nam', imageUrl: 'https://cdn.oneesports.vn/cdn-data/sites/4/2024/01/Zed_38.jpg' },
  { id: 2, name: 'Bãi biển Mỹ Khê', location: 'Đà Nẵng, Việt Nam', imageUrl: 'https://cdn.oneesports.vn/cdn-data/sites/4/2024/01/Zed_38.jpg' },
  { id: 3, name: 'Vịnh Hạ Long', location: 'Quảng Ninh, Việt Nam', imageUrl: 'https://cdn.oneesports.vn/cdn-data/sites/4/2024/01/Zed_38.jpg' },
  { id: 4, name: 'Phố cổ Hà Nội', location: 'Hà Nội, Việt Nam', imageUrl: 'https://cdn.oneesports.vn/cdn-data/sites/4/2024/01/Zed_38.jpg' },
  { id: 5, name: 'Thành phố Hồ Chí Minh', location: 'Việt Nam', imageUrl: 'https://cdn.oneesports.vn/cdn-data/sites/4/2024/01/Zed_38.jpg' },
  // Add more favorite places as needed...
];

function Favorites() {
  // State for pagination
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 4; // Number of items per page

  // Function to handle page change
  const handlePageChange = (data) => {
    setCurrentPage(data.selected);
  };

  // Calculate current items to display
  const displayedFavorites = favoritesData.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

  return (
    <Container className='py-3 px-0 border-0 rounded-5' style={{
      background: '#f9f9f9', 
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
          <div key={favorite.id} className='shadow' style={{
            padding: '20px',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            background: 'white'
          }}>
            <img
              src={favorite.imageUrl}
              alt={favorite.name}
              style={{ width: '60px', height: '60px', borderRadius: '50%', marginRight: '15px', objectFit: 'cover' }}
            />
            <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h5 style={{ margin: 0, fontWeight: 'bold' }}>{favorite.name}</h5>
                <p style={{ margin: 0 }}>{favorite.location}</p>
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
          pageCount={Math.ceil(favoritesData.length / itemsPerPage)}
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
