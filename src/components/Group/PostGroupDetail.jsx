import React, { useState } from 'react';
import CommentPostGroupDetail from './CommentPostGroupDetail';
import { Dropdown } from 'react-bootstrap';
import '../../assets/css/Groups/PostGroupDetail.css';
import FormSubmit from '../Shared/FormSubmit';

const comments = [
  {
    id: 1,
    avatar: 'https://yt3.googleusercontent.com/oN0p3-PD3HUzn2KbMm4fVhvRrKtJhodGlwocI184BBSpybcQIphSeh3Z0i7WBgTq7e12yKxb=s900-c-k-c0x00ffffff-no-rj',
    name: 'Nhơn Trần',
    location: 'Quảng Nam',
    content: 'Đăng là người bạn đồng hành tuyệt vời! Vui vẻ, thân thiện và rất am hiểu về Hội An. Nhờ cậu ấy mà chuyến đi của mình thêm phần thú vị. Rất vui được gặp và đi cùng bạn!',
  },
  {
    id: 2,
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    name: 'Huy Nguyễn',
    location: 'Hà Nội',
    content: 'Một trải nghiệm thật tuyệt vời, mình đã có khoảng thời gian đáng nhớ tại Hội An!',
  },
  {
    id: 3,
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    name: 'Thảo Phạm',
    location: 'Đà Nẵng',
    content: 'Chuyến đi rất tuyệt vời, Hội An đẹp và đồ ăn rất ngon!',
  },
  {
    id: 4,
    avatar: 'https://randomuser.me/api/portraits/men/55.jpg',
    name: 'Minh Tuấn',
    location: 'Hồ Chí Minh',
    content: 'Mình rất thích chuyến đi này, cảm giác yên bình và thư giãn.',
  },
  {
    id: 5,
    avatar: 'https://randomuser.me/api/portraits/women/60.jpg',
    name: 'Lan Phạm',
    location: 'Hải Phòng',
    content: 'Những món ăn ở Hội An thật sự rất tuyệt!',
  },
];

function PostGroupDetail() {
  const [visibleComments, setVisibleComments] = useState(2);

  const handleShowMore = () => {
    setVisibleComments(prev => prev + 2);
  };

  return (
    <div className='mb-5 post-group-detail-container'>
      <div className='d-flex'>
        <div className='w-100 p-2 d-flex gap-3 align-items-center'>
          <img src="https://yt3.googleusercontent.com/oN0p3-PD3HUzn2KbMm4fVhvRrKtJhodGlwocI184BBSpybcQIphSeh3Z0i7WBgTq7e12yKxb=s900-c-k-c0x00ffffff-no-rj" alt="" style={{
            width: '72px',
            height: '72px',
            objectFit: 'cover',
            borderRadius: '50%'
          }} />

          <div>
            <strong style={{
              fontWeight: '600',
              fontSize: '20px'
            }}>Nhơn Trần</strong>
            <p className='m-0' style={{
              fontWeight: '500',
              fontSize: '16px'
            }}>24 tháng 09 lúc 9:01</p>
          </div>
        </div>

        <Dropdown>
          <Dropdown.Toggle variant="link" id="dropdown-basic" className='bg-transparent border-0' style={{ padding: '0', marginLeft: 'auto', color: 'black', }}>
            <ion-icon name="ellipsis-horizontal-outline" style={{ cursor: 'pointer', fontSize: '24px' }}></ion-icon>
          </Dropdown.Toggle>

          <Dropdown.Menu align="end" style={{ zIndex: '1000' }}>
            <Dropdown.Item onClick={() => console.log('Chỉnh sửa bình luận')} className='btn-edit-post'>
              <FormSubmit openModalText={'Chỉnh sửa'} buttonText={'Cập Nhập'} title={'Chiến Đi'}>
                <div>
                  {/* Địa điểm */}
                  <div className="mb-3">
                    <label className="fw-bold">Địa điểm</label>
                    <input type="text" className="form-control" placeholder="Phố cổ Hội An, Quảng Nam" />
                  </div>

                  {/* Nội dung */}
                  <div className="mb-3">
                    <label className="fw-bold">Nội dung</label>
                    <textarea className="form-control" style={{
                    }} rows="6" placeholder="Hội An – phố cổ với những con hẻm nhỏ, đèn lồng lung linh và không khí yên bình. Mỗi góc phố đều mang trong mình dấu ấn thời gian, khiến mình như lạc vào một khung cảnh hoài cổ, thơ mộng. Đêm xuống, phố lên đèn, cảm giác thật bình yên và dịu dàng. Nhất định phải ghé thăm lần nữa! 🌕✨"></textarea>
                  </div>

                  {/* Hình ảnh */}
                  <div className="mb-3">
                    <label className="fw-bold">Ảnh</label>
                    <input type="file" className="form-control mb-3" />

                    {/* Hình ảnh đã chọn */}
                    <div className="d-flex justify-content-between flex-wrap">
                      <div className="position-relative" style={{ flex: '1 1 30%', margin: '5px' }}>
                        <img src="https://tiki.vn/blog/wp-content/uploads/2023/03/cau-rong-da-nang.jpg" alt="Ảnh 1" className="img-fluid rounded" />
                        <button className="btn btn-danger btn-sm position-absolute" style={{ top: '5px', right: '5px' }}>Xóa</button>
                      </div>
                      <div className="position-relative" style={{ flex: '1 1 30%', margin: '5px' }}>
                        <img src="https://tiki.vn/blog/wp-content/uploads/2023/03/cau-rong-da-nang.jpg" alt="Ảnh 2" className="img-fluid rounded" />
                        <button className="btn btn-danger btn-sm position-absolute" style={{ top: '5px', right: '5px' }}>Xóa</button>
                      </div>
                      <div className="position-relative" style={{ flex: '1 1 30%', margin: '5px' }}>
                        <img src="https://tiki.vn/blog/wp-content/uploads/2023/03/cau-rong-da-nang.jpg" alt="Ảnh 3" className="img-fluid rounded" />
                        <button className="btn btn-danger btn-sm position-absolute" style={{ top: '5px', right: '5px' }}>Xóa</button>
                      </div>
                    </div>
                  </div>
                </div>
              </FormSubmit>
            </Dropdown.Item>
            <Dropdown.Item onClick={() => console.log('Xóa bình luận')}>Xóa</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>

      <p style={{
        margin: '14px 0 18px 0',
        fontSize: '16px',
        fontWeight: '500'
      }}>Xin chào mọi người, Hôm nay chúng tôi chia sẻ đến mọi người chuyến đi Đà Nẵng 2 ngày 1 đêm của chúng tôi.</p>

      <div style={{
        border: '1px solid #D9D9D9',
        display: 'flex',
        justifyContent: 'space-between',
        padding: '18px',
        borderRadius: '10px',
        boxShadow: '4px 4px 4px rgba(0, 0, 0, 0.25)',
      }} className='post-group-detail-img'>
        <img src="https://tiki.vn/blog/wp-content/uploads/2023/03/cau-rong-da-nang.jpg" alt="địa điểm" style={{
          objectFit: 'cover',
          borderRadius: '20px'
        }} />
        <img src="https://tiki.vn/blog/wp-content/uploads/2023/03/cau-rong-da-nang.jpg" alt="địa điểm" style={{
          objectFit: 'cover',
          borderRadius: '20px'
        }} />
        <img src="https://tiki.vn/blog/wp-content/uploads/2023/03/cau-rong-da-nang.jpg" alt="địa điểm" style={{
          objectFit: 'cover',
          borderRadius: '20px'
        }} />
      </div>

      <div style={{
        padding: '18px 33px',
        display: 'flex',
        alignItems: 'center',
        gap: '45px'
      }}>
        <ion-icon name="chatbubble-outline" style={{
          fontSize: '36px',
        }}></ion-icon>
        <ion-icon name="share-social-outline" style={{
          fontSize: '36px',
        }}></ion-icon>
      </div>

      {/* Pass visible comments to CommentPostGroupDetail */}
      {comments.slice(0, visibleComments).map((comment) => (
        <CommentPostGroupDetail key={comment.id} comment={comment} />
      ))}

      {/* Show "Show More" button if there are more comments to show */}
      {visibleComments < comments.length && (
        <button onClick={handleShowMore} className='btn btn-outline-dark' style={{
          padding: '10px 20px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
          borderRadius: '20px',
          fontSize: '12px'
        }}>
          Tải thêm các bình luận <ion-icon name="chevron-down-outline"></ion-icon>
        </button>
      )}
    </div>
  );
}

export default PostGroupDetail;
