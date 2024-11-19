import React, { useState } from 'react';
import { Container, Placeholder } from 'react-bootstrap';
import ReactPaginate from 'react-paginate';
import { useSelector } from 'react-redux';
import { useQuery } from 'react-query';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

function Favorites() {
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 4;
  const token = useSelector((state) => state.auth.token);
  const url = import.meta.env.VITE_BASE_API_URL;
  const location = useLocation();

  const fetchFavorites = async () => {
    try {
      const response = await axios.get(`${url}/api/UserLocationsWOO/get-current-user`, {
        headers: { Authorization: `${token}` },
      });
      return response.data.$values;
    } catch (error) {
      throw new Error('Error fetching data');
    }
  };

  const { data: favorites = [], isLoading, error } = useQuery(['favorites', location.pathname], fetchFavorites, {
    retry: false,
  });

  const handlePageChange = (data) => setCurrentPage(data.selected);

  const displayedFavorites = favorites.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

  if (isLoading) return (
    <Container className='py-3 px-0 border-0 rounded-5' style={{ background: '#f9f9f9' }}>
      <h2 className="mb-4 text-success fw-bold text-header-profile mt-3">ĐỊA ĐIỂM ƯA THÍCH</h2>
      <Placeholder as="p" animation="glow">
        <Placeholder xs={12} />
      </Placeholder>
    </Container>
  );
  if (error) return <div>Error fetching data</div>;

  return (
    <Container className='py-3 px-0 border-0 rounded-5' style={{ background: '#f9f9f9' }}>
      <h2 className="mb-4 text-success fw-bold text-header-profile mt-3">ĐỊA ĐIỂM ƯA THÍCH</h2>
      {favorites.length === 0 ? (
        <div className="text-center">Bạn chưa đi du lịch nơi nào</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gridGap: '20px 60px' }} className='px-5'>
          {displayedFavorites.map((favorite) => (
            <div key={favorite.location.locationId} style={{ border: '1px solid black', padding: '20px', borderRadius: '16px', display: 'flex', alignItems: 'center', background: 'white' }}>
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
      )}
      {Math.ceil(favorites.length / itemsPerPage) > 1 && (
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
      )}
    </Container>
  );
}

export default Favorites;
