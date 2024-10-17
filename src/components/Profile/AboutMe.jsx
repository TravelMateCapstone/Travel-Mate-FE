import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import "../../assets/css/Profile/AboutMe.css";

function AboutMe() {
  return (
    <Container className='py-3 px-0 border-0 rounded-5' style={{
      boxShadow: '0 0 4px rgba(0, 0, 0, 0.25)'
    }}>
      <Row>
        <Col md={12}>
          <h2 className="mb-4 text-success fw-bold text-header-profile mt-3">GIỚI THIỆU</h2>
          <ul className="cbp_tmtimeline">
            <li>
              <div className="cbp_tmicon "><i className="zmdi zmdi-label"></i></div>
              <div className="cbp_tmlabel">
                <h4>MÔ TẢ</h4>
                <p>Xin chào, tôi là một nhà phát triển đam mê với việc xây dựng các ứng dụng web và di động.</p>
              </div>
            </li>
            <li>
              <div className="cbp_tmicon "><i className="zmdi zmdi-label"></i></div>
              <div className="cbp_tmlabel">
                <h4>TẠI SAO TÔI SỬ DỤNG TRAVEL MATE</h4>
                <p>Tôi ở đây để mở rộng kiến ​​thức, cộng tác vào các dự án thú vị và chia sẻ kỹ năng của mình.</p>
              </div>
            </li>
            <li>
              <div className="cbp_tmicon"><i className="zmdi zmdi-case"></i></div>
              <div className="cbp_tmlabel">
                <h4>SỞ THÍCH</h4>
                <div className='d-flex favorite-tag'>
                  <p className="small border border-dark btn rounded-pill fw-medium">Coding</p>
                  <p className="small border border-dark btn rounded-pill fw-medium">Coding</p>
                  <p className="small border border-dark btn rounded-pill fw-medium">Coding</p>
                </div>
              </div>
            </li>
            <li>
              <div className="cbp_tmicon "><i className="zmdi zmdi-case"></i></div>
              <div className="cbp_tmlabel">
                <h4>ÂM NHẠC, PHIM ẢNH & SÁCH</h4>
                <p>Tôi thích sự pha trộn của nhiều thể loại—từ nhạc indie pop và jazz đến nhạc rock. Luôn sẵn sàng khám phá những giai điệu mới, đặc biệt là các bản nhạc địa phương. Rất thích những bộ phim khiến bạn phải suy nghĩ hoặc cảm nhận sâu sắc. Tôi thích mọi thứ từ phim kinh dị của Nolan đến phép thuật của Studio Ghibli, và tôi luôn săn lùng những viên ngọc indie.
                Sách là nơi tôi trốn thoát. Cho dù là tiểu thuyết hay phi tiểu thuyết, tôi đều thích bất cứ thứ gì kể một câu chuyện hay. Luôn sẵn lòng trao đổi các đề xuất sách khi uống cà phê!</p>
              </div>
            </li>
            <li>
              <div className="cbp_tmicon "><i className="zmdi zmdi-case"></i></div>
              <div className="cbp_tmlabel">
                <h4>TÔI CÓ THỂ CHIA SẺ GÌ VỚI BẠN</h4>
                <p>Tôi rất vui khi được chia sẻ những cuộc trò chuyện thú vị, những câu chuyện du lịch và sự trân trọng thực sự đối với những trải nghiệm mới. Nếu bạn thích chỉnh sửa video hoặc muốn học một số điều cơ bản, tôi rất muốn chia sẻ các kỹ năng của mình. Tôi cũng là một đầu bếp giỏi và có thể nấu một bữa ăn ngon từ quê hương của mình hoặc một món ăn mới mà chúng ta có thể cùng nhau thử. Quan trọng nhất là tôi mang đến một thái độ tích cực và sẵn sàng giúp đỡ việc nhà theo bất kỳ cách nào tôi có thể!</p>
              </div>
            </li>
          </ul>
        </Col>
      </Row>
    </Container>
  );
}

export default AboutMe;
