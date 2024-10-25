import React, { useState, useEffect } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ReactPaginate from 'react-paginate'; // Import react-paginate
import '../../assets/css/Shared/Pagination.css'; // Import your custom pagination CSS
import GroupCard from '../../components/Group/GroupCard';
import '../../assets/css/Groups/Group.css';
import axios from 'axios';

function GroupList() {
  const [groups, setGroups] = useState(() => {
    // Lấy dữ liệu groups từ localStorage nếu có
    const savedGroups = localStorage.getItem('groups');
    return savedGroups ? JSON.parse(savedGroups) : [];
  });
  const [currentPage, setCurrentPage] = useState(() => {
    // Lấy trang hiện tại từ localStorage hoặc mặc định là trang đầu tiên (0)
    const savedPage = localStorage.getItem('currentPage');
    return savedPage ? parseInt(savedPage, 10) : 0;
  });
  const [totalPages, setTotalPages] = useState(() => {
    // Lấy tổng số trang từ localStorage nếu có
    const savedTotalPages = localStorage.getItem('totalPages');
    return savedTotalPages ? parseInt(savedTotalPages, 10) : 0;
  });

  useEffect(() => {
    // Fetch data từ API nếu không có trong localStorage hoặc khi thay đổi trang
    const fetchGroups = async () => {
      try {
        const response = await axios.get('https://travelmateapp.azurewebsites.net/api/groups', {
          params: {
            pageNumber: currentPage + 1,
          },
        });
        setGroups(response.data.groups);
        setTotalPages(response.data.totalPages);

        // Lưu lại dữ liệu vào localStorage
        localStorage.setItem('groups', JSON.stringify(response.data.groups));
        localStorage.setItem('totalPages', response.data.totalPages);
        localStorage.setItem('currentPage', currentPage); // Lưu lại trang hiện tại vào localStorage
      } catch (error) {
        console.error('Error fetching groups:', error);
      }
    };

    // Chỉ gọi API nếu dữ liệu groups không có hoặc khi chuyển trang
    if (!localStorage.getItem('groups') || currentPage !== parseInt(localStorage.getItem('currentPage'), 10)) {
      fetchGroups();
    }
  }, [currentPage]);

  // Handle page change
  const handlePageChange = (data) => {
    const newPage = data.selected;
    setCurrentPage(newPage);
    // Xóa dữ liệu groups trong localStorage khi chuyển trang để đảm bảo dữ liệu cũ không bị sử dụng
    localStorage.removeItem('groups');
  };

  return (
    <div>
      <Row className='p-0 m-0'>
        {groups.map((group) => (
          <Col md={4} xs={6} key={group.groupId} className="mb-4 d-flex justify-content-center">
            <GroupCard
              img={group.groupImageUrl}
              title={group.groupName}
              location={group.location}
              members={`${group.groupParticipants.length} thành viên`}
              text={group.description}
            />
          </Col>
        ))}
      </Row>

      <ReactPaginate
        previousLabel={'<'}
        nextLabel={'>'}
        breakLabel={'...'}
        breakClassName={'break-me'}
        pageCount={totalPages}
        marginPagesDisplayed={2}
        pageRangeDisplayed={2}
        onPageChange={handlePageChange}
        containerClassName={'pagination'}
        activeClassName={'active-pagination'}
        previousClassName={'previous'}
        nextClassName={'next'}
      />
    </div>
  );
}

export default GroupList;
