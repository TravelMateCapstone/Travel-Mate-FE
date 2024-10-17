import React, { useState } from 'react';
import { Container, Button } from 'react-bootstrap';
import PostGroupDetail from '../Group/PostGroupDetail';

function PastTrips() {
  // State để quản lý số lượng bài viết hiển thị
  const [visiblePosts, setVisiblePosts] = useState(2);

  // Dữ liệu bài viết giả lập (có thể thay thế bằng API thực)
  const posts = [<PostGroupDetail />, <PostGroupDetail />, <PostGroupDetail />, <PostGroupDetail />, <PostGroupDetail />];

  // Hàm xử lý khi nhấn nút "Tải thêm bình luận"
  const loadMorePosts = () => {
    setVisiblePosts(prevVisiblePosts => prevVisiblePosts + 2);
  };

  return (
    <div>
      <textarea
        className="w-100 rounded-5"
        style={{
          border: '1px solid #D9D9D9',
          padding: '20px',
          height: '158px',
          boxShadow: '4px 4px 4px rgba(0, 0, 0, 0.3)',
        }}
      ></textarea>
      <ion-icon name="image-outline" style={{ fontSize: '38px' }}></ion-icon>
      <ion-icon name="location-outline" style={{ fontSize: '38px', marginLeft: '27px' }}></ion-icon>

      <Container className="py-3 px-0 border rounded-5">
        <h2 className="mb-4 text-success fw-bold text-header-profile mt-3">CHUYẾN ĐI</h2>

        <div className="px-5">
          {/* Hiển thị số lượng bài viết dựa trên giá trị của visiblePosts */}
          {posts.slice(0, visiblePosts)}
        </div>

        {/* Nếu số lượng bài viết hiển thị ít hơn tổng số bài viết, hiện nút "Tải thêm bình luận" */}
        {visiblePosts < posts.length && (
          <div className="d-flex justify-content-center">
            <Button
              variant="outline-dark"
              style={{ borderRadius: '20px' }}
              onClick={loadMorePosts}
            >
              Tải thêm bình luận{' '}
              <ion-icon
                name="chevron-down-outline"
                style={{ fontSize: '12px' }}
              ></ion-icon>
            </Button>
          </div>
        )}
      </Container>
    </div>
  );
}

export default PastTrips;
