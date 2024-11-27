import React, { useState, useEffect } from 'react';
import { Container, Placeholder } from 'react-bootstrap';
import ReactPaginate from 'react-paginate';
import { useSelector } from 'react-redux';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import "../../../assets/css/Profile/Friends.css";

function MyFavorites() {
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 8;
  const [loading, setLoading] = useState(true);

  const dataProfile = useSelector(state => state.profile);

  useEffect(() => {
    if (dataProfile && dataProfile.location) {
      setLoading(false);
    }
  }, [dataProfile]);

  const handlePageChange = (data) => setCurrentPage(data.selected);

  const displayedFavorites = loading || !dataProfile.location || !dataProfile.location.$values
    ? []
    : dataProfile.location.$values.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

  return (
    <Container className='py-3 px-0 border-0 rounded-5 item-container'>
      {loading ? (
        <Placeholder as="p" animation="glow">
          <Skeleton height={200} count={4} style={{ marginBottom: '20px' }} />
        </Placeholder>
      ) : (
        <>
          {displayedFavorites.length === 0 ? (
            <div className="text-center" style={{ fontStyle: 'italic', color: '#6c757d' }}>
              Bạn chưa có địa điểm ưa thích
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(1, 1fr)', gridGap: '20px 60px' }} className='px-5'>
              {displayedFavorites.map((favorite, index) => (
                <div key={index} style={{ border: '1px solid black', padding: '20px', borderRadius: '16px', display: 'flex', alignItems: 'center', background: 'white' }}>
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
          {Math.ceil(dataProfile.location.$values.length / itemsPerPage) > 1 && (
            <div className="d-flex justify-content-center align-items-center mt-4">
              <ReactPaginate
                previousLabel={'<'}
                nextLabel={'>'}
                breakLabel={'...'}
                breakClassName={'break-me'}
                pageCount={Math.ceil(dataProfile.location.$values.length / itemsPerPage)}
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
        </>
      )}
    </Container>
  );
}

export default MyFavorites;
