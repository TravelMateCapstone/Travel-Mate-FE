import React, { useState } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ReactPaginate from 'react-paginate'; // Import react-paginate
import '../../assets/css/Shared/Pagination.css'; // Import your custom pagination CSS
import GroupCard from '../../components/Group/GroupCard';
import '../../assets/css/Groups/Group.css'


function GroupList() {
  const cardData = [
    {
      id: 1,
      img: 'https://danangfantasticity.com/wp-content/uploads/2024/03/chuong-trinh-kich-cau-va-thu-hut-khach-du-lich-den-da-nang-nam-2024-enjoy-danang-2024.jpg',
      title: 'Câu lạc bộ Lướt sóng',
      location: 'Đà Nẵng',
      members: '35 thành viên',
      text: 'Hướng dẫn viên chuyên nghiệp và cộng đồng vui vẻ sẽ giúp bạn cải thiện kỹ năng lướt sóng và tận hưởng đại dương.',
    },
    {
      id: 2,
      img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS95DegtOM6_WVdoeH-RAidSP_ceOkXcLlOPQ&s',
      title: 'Leo núi',
      location: 'Sapa',
      members: '25 thành viên',
      text: 'Tham gia cùng chúng tôi trong cuộc phiêu lưu trên núi và nâng cao trải nghiệm leo núi của bạn!',
    },
    {
      id: 3,
      img: 'https://thanhnien.mediacdn.vn/Uploaded/tiendung/2022_09_21/78b0bcc5-d37b-4301-8ee3-679d35df3c17-2002.jpeg',
      title: 'Câu lạc bộ Nhiếp ảnh',
      location: 'Hà Nội',
      members: '50 thành viên',
      text: 'Chụp những cảnh quan tuyệt đẹp và làm chủ các kỹ thuật nhiếp ảnh cùng những người đam mê khác.',
    },
    {
      id: 4,
      img: 'https://www.cet.edu.vn/wp-content/uploads/2018/05/nghe-nau-an-la-gi.jpg',
      title: 'Lớp học Nấu ăn',
      location: 'Hồ Chí Minh',
      members: '20 thành viên',
      text: 'Học cách nấu các món ăn truyền thống Việt Nam dưới sự hướng dẫn của các đầu bếp chuyên nghiệp.',
    },
    {
      id: 5,
      img: 'https://suckhoedoisong.qltns.mediacdn.vn/324455921873985536/2021/8/10/1-16286119551351320735821.jpg',
      title: 'Khóa tu Yoga',
      location: 'Mũi Né',
      members: '15 thành viên',
      text: 'Tham gia khóa tu yoga yên bình của chúng tôi để thư giãn và phục hồi trong một khung cảnh thanh bình.',
    },
    {
      id: 6,
      img: 'https://campingdalat.vn/wp-content/uploads/2022/11/Tour-dap-xe-cam-trai-kham-pha-rung-mai-anh-dao-4.jpg',
      title: 'Câu lạc bộ Đạp xe',
      location: 'Đà Lạt',
      members: '40 thành viên',
      text: 'Khám phá các con đường đẹp và cải thiện kỹ năng đạp xe của bạn cùng với cộng đồng những người đam mê.',
    },
    {
      id: 7,
      img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRoVlcIThIxwAEK8OxM-hOlK7pFhjJqCnCaLA&s',
      title: 'Câu lạc bộ Sách',
      location: 'Huế',
      members: '18 thành viên',
      text: 'Chia sẻ tình yêu văn học và thảo luận về những cuốn sách hay cùng những người đọc khác.',
    },
    {
      id: 8,
      img: 'https://static.vinwonders.com/2022/03/bao-tang-my-thuat-da-nang-7.jpg',
      title: 'Hội thảo Nghệ thuật',
      location: 'Đà Nẵng',
      members: '22 thành viên',
      text: 'Khơi dậy sự sáng tạo của bạn qua các hội thảo nghệ thuật thực hành với các nghệ sĩ địa phương.',
    },
    {
      id: 9,
      img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSKsDgfKC-rYLXjNI9O1k3cU2I9f61TZ9WQkQ&s',
      title: 'Trao đổi Ngôn ngữ',
      location: 'Hà Nội',
      members: '30 thành viên',
      text: 'Thực hành các ngôn ngữ mới và gặp gỡ mọi người từ khắp nơi trên thế giới trong một không gian thân thiện.',
    },
    {
      id: 10,
      img: 'https://caodangvietmyhanoi.edu.vn/upload_images/images/ky-thuat-lap-trinh-cong-nghe-thong-tin.jpg',
      title: 'Trại huấn luyện Lập trình ',
      location: 'Hồ Chí Minh',
      members: '28 thành viên',
      text: 'Nâng cao kỹ năng lập trình của bạn và học hỏi từ các chuyên gia trong trại huấn luyện của chúng tôi.',
    },

  ];
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 6; // Number of items you want per page

  // Calculate the items to display based on the current page
  const offset = currentPage * itemsPerPage;
  const currentItems = cardData.slice(offset, offset + itemsPerPage);

  // Handle page change
  const handlePageChange = (data) => {
    setCurrentPage(data.selected);
  };

  return (
    <div>
      <Row className='p-0 m-0'>
        {currentItems.map((card) => (
          <Col md={4} xs={6} key={card.id} className="mb-4 d-flex justify-content-center">
            <GroupCard
              img={card.img}
              title={card.title}
              location={card.location}
              members={card.members}
              text={card.text}
            />
          </Col>
        ))}
      </Row>

      <ReactPaginate
        previousLabel={'<'}
        nextLabel={'>'}
        breakLabel={'...'}
        breakClassName={'break-me'}
        pageCount={Math.ceil(cardData.length / itemsPerPage)}
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

export default GroupList