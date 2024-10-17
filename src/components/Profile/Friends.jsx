import React, { useState } from 'react';
import '../../assets/css/Shared/Pagination.css'; 
import ReactPaginate from 'react-paginate';

const cardData = [
  { name: "Nhon Tran", location: "Dien Ngoc, Quang Nam", imgSrc: "https://cdn.oneesports.vn/cdn-data/sites/4/2024/01/Zed_38.jpg" },
  { name: "Nguyen Van A", location: "Da Nang", imgSrc: "https://cdn.oneesports.vn/cdn-data/sites/4/2024/01/Zed_38.jpg" },
  { name: "Le Thi B", location: "Hanoi", imgSrc: "https://cdn.oneesports.vn/cdn-data/sites/4/2024/01/Zed_38.jpg" },
  { name: "Tran Van C", location: "HCMC", imgSrc: "https://cdn.oneesports.vn/cdn-data/sites/4/2024/01/Zed_38.jpg" },
  { name: "Pham Van D", location: "Hai Phong", imgSrc: "https://cdn.oneesports.vn/cdn-data/sites/4/2024/01/Zed_38.jpg" },
  { name: "Nguyen Van E", location: "Can Tho", imgSrc: "https://cdn.oneesports.vn/cdn-data/sites/4/2024/01/Zed_38.jpg" },
  { name: "Hoang Thi F", location: "Nam Dinh", imgSrc: "https://cdn.oneesports.vn/cdn-data/sites/4/2024/01/Zed_38.jpg" },
  { name: "Nguyen Thi G", location: "Bac Ninh", imgSrc: "https://cdn.oneesports.vn/cdn-data/sites/4/2024/01/Zed_38.jpg" },
  { name: "Nguyen Van H", location: "Quang Ninh", imgSrc: "https://cdn.oneesports.vn/cdn-data/sites/4/2024/01/Zed_38.jpg" },
];

function Friends() {
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 4; // Số lượng thẻ bạn bè mỗi trang

  // Tính toán các trang và chỉ số của các thẻ bạn bè hiện tại
  const pagesVisited = currentPage * itemsPerPage;
  const displayedFriends = cardData.slice(pagesVisited, pagesVisited + itemsPerPage);
  const pageCount = Math.ceil(cardData.length / itemsPerPage);

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };


  return (
    <div style={{
       boxShadow: '0 0 4px rgba(0, 0, 0, 0.25)'
    }} className='rounded-5 py-3 px-0'>
      <h2 className="mb-4 text-success fw-bold text-header-profile mt-3">
        BẠN BÈ
      </h2>
      {/* Grid layout for the cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gridGap: '20px 60px',
      }} className='px-5'>
        {displayedFriends.map((friend, index) => (
          <div key={index} style={{
            border: '1px solid black',
            padding: '20px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center'
          }}>
            <img
              src={friend.imgSrc}
              alt={friend.name}
              style={{ width: '60px', height: '60px', borderRadius: '50%', marginRight: '15px', objectFit: 'cover' }} // Điều chỉnh kích thước ảnh
            />
            <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h5 style={{ margin: 0, fontWeight: 'bold' }}>{friend.name}</h5>
                <p style={{ margin: 0 }}>{friend.location}</p>
              </div>
              <i className="bi bi-three-dots"></i>
            </div>
          </div>
        ))}
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
