import React, { useState } from 'react';
import CommentPostGroupDetail from './CommentPostGroupDetail';
import { Container, Dropdown } from 'react-bootstrap';
import '../../assets/css/Groups/PostGroupDetail.css';
import FormSubmit from '../Shared/FormSubmit';

function PostGroupDetail({ postDetails }) {
  const [visibleComments, setVisibleComments] = useState(2);

  const handleShowMore = () => {
    setVisibleComments((prev) => prev + 2);
  };
  const handelEditPostDetail = () => {
    console.log('Edit post detail');
  }

  return (
    <div className='mb-5 post-group-detail-container'>
      <div className='d-flex'>
        <div className='w-100 p-2 d-flex gap-3 align-items-center'>
          <img src={postDetails.authorAvatar} alt="" style={{
            width: '72px',
            height: '72px',
            objectFit: 'cover',
            borderRadius: '50%'
          }} />

          <div>
            <strong style={{
              fontWeight: '600',
              fontSize: '20px'
            }}>{postDetails.authorName}</strong>
            <p className='m-0' style={{
              fontWeight: '500',
              fontSize: '16px'
            }}>{postDetails.date}</p>
          </div>
        </div>

        <Dropdown>
          <Dropdown.Toggle variant="link" id="dropdown-basic" className='bg-transparent border-0' style={{ padding: '0', marginLeft: 'auto', color: 'black', }}>
            <ion-icon name="ellipsis-horizontal-outline" style={{ cursor: 'pointer', fontSize: '24px' }}></ion-icon>
          </Dropdown.Toggle>

          <Dropdown.Menu align="end" style={{ zIndex: '1000' }} className='edit-post-detail-dropdown'>
            <Dropdown.Item onClick={() => console.log('Chỉnh sửa bình luận')}>
              <FormSubmit buttonText={'Cập nhật'} title={'Chỉnh sửa bài viết'} openModalText={'Chỉnh sửa'} onButtonClick={handelEditPostDetail}>
                <h4>Địa điểm</h4>
                <input placeholder='Nhập địa điểm' className='w-100 rounded-5 px-3' style={{
                  height: '46px'
                }} />
                <h4>Nội dung</h4>
                <textarea placeholder='Nhập nội dung' className='w-100 rounded-5 p-3' style={{
                  height: '100px'
                }} />
                <h4>Ảnh</h4>
                <div className='rounded-5' style={{
                  border: '1px solid black',
                  display: 'flex',
                  height: '46px',
                  alignItems: 'center',
                }}>
                  <input type='file' className=' rounded-5 px-3' style={{
                    
                  }} />
                </div>
                <div className='mt-3 d-flex gap-4 flex-wrap'>
                  <img src='https://cdn.oneesports.vn/cdn-data/sites/4/2024/01/Zed_38.jpg' alt='' style={{
                    width: '30%',
                    height: '150px',
                    objectFit: 'cover',
                    marginBottom: '10px',
                  }}/>
                   <img src='https://cdn.oneesports.vn/cdn-data/sites/4/2024/01/Zed_38.jpg' alt='' style={{
                    width: '30%',
                    height: '150px',
                    objectFit: 'cover',
                    marginBottom: '10px',
                  }}/>
                   <img src='https://cdn.oneesports.vn/cdn-data/sites/4/2024/01/Zed_38.jpg' alt='' style={{
                    width: '30%',
                    height: '150px',
                    objectFit: 'cover',
                    marginBottom: '10px',
                  }}/>
                   <img src='https://cdn.oneesports.vn/cdn-data/sites/4/2024/01/Zed_38.jpg' alt='' style={{
                    width: '30%',
                    height: '150px',
                    objectFit: 'cover',
                    marginBottom: '10px',
                  }}/>
                   <img src='https://cdn.oneesports.vn/cdn-data/sites/4/2024/01/Zed_38.jpg' alt='' style={{
                    width: '30%',
                    height: '150px',
                    objectFit: 'cover',
                    marginBottom: '10px',
                  }}/>
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
      }}>{postDetails.content}</p>

      <div style={{
        border: '1px solid #D9D9D9',
        display: 'flex',
        justifyContent: 'space-between',
        padding: '18px',
        borderRadius: '10px',
        boxShadow: '4px 4px 4px rgba(0, 0, 0, 0.25)',
      }} className='post-group-detail-img'>
        {postDetails.images.map((img, index) => (
          <img key={index} src={img} alt="địa điểm" style={{
            objectFit: 'cover',
            borderRadius: '20px'
          }} />
        ))}
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
      {postDetails.comments.slice(0, visibleComments).map((comment) => (
        <CommentPostGroupDetail key={comment.id} comment={comment} />
      ))}

      {/* Show "Show More" button if there are more comments to show */}
      {visibleComments < postDetails.comments.length && (
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
