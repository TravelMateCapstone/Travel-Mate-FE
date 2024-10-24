import React, { useEffect, useState } from 'react'
import { Button } from 'react-bootstrap'
import Dropdown from 'react-bootstrap/Dropdown';
import Form from 'react-bootstrap/Form';
import PostGroupDetail from '../../components/Group/PostGroupDetail';
import { useSelector } from 'react-redux';
import '../../assets/css/Groups/GroupDetail.css'
import RoutePath from '../../routes/RoutePath';
import FormSubmit from '../../components/Shared/FormSubmit';
function GroupDetail() {
  const selectedGroup = useSelector(state => state.group.selectedGroup);
  const members = [
    {
      id: 1,
      image: 'https://yt3.googleusercontent.com/oN0p3-PD3HUzn2KbMm4fVhvRrKtJhodGlwocI184BBSpybcQIphSeh3Z0i7WBgTq7e12yKxb=s900-c-k-c0x00ffffff-no-rj',
    },
    {
      id: 2,
      image: 'https://kenh14cdn.com/thumb_w/640/203336854389633024/2024/10/5/hieuthuhai-6-1724922106140134622997-0-0-994-1897-crop-17249221855301721383554-17281064622621203940077.jpg',
    },
    {
      id: 3,
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSp3HUU-eAMPAQL0wpBBY2taVQkWH4EwUWeHw&s',
    }
  ];

  const [isGroupCreate, setIsGroupCreate] = useState(false);

  useEffect(() => {

    if (localStorage.getItem('lastPath') == RoutePath.GROUP_CREATED) {
      setIsGroupCreate(true)
    }
    console.log(isGroupCreate);

  })

  return (
    <div className='join-group-detail-container' style={{
      paddingRight: '85px'
    }}>
      <img src={selectedGroup.img} alt={selectedGroup.title} style={{
        height: '331px',
        objectFit: 'cover',
        borderRadius: '20px',
        marginBottom: '23px',
        width: '100%'
      }} />
      <div className='d-flex justify-content-between'>
        <div className='d-flex gap-4'>
          <p className='group-name-inf' style={{
            fontSize: '40px',
            fontWeight: 'bold',
            margin: '0',
            marginBottom: '10px'
          }}>{selectedGroup.title}</p>

          <div className='group-location-inf' style={{
            fontSize: '20px',
            fontWeight: 'bold',
            marginTop: '15px'
          }}>{selectedGroup.location}</div>
        </div>

        {isGroupCreate ? (
          <>
            <Dropdown>
              <Dropdown.Toggle variant="" id="dropdown-basic" className='bg-transparent border-0'>
                <ion-icon name="settings-outline" style={{
                  fontSize: '25px'
                }}></ion-icon>
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item className='dropdown-edit-group-item'>
                <FormSubmit openModalText={'Chỉnh sửa thông tin'} title={'Chỉnh sửa thông tin nhóm'} buttonText={'Lưu thay đổi'}>
    <h3>Bảng thông tin</h3>
    <small>Thay đổi thông tin chi tiết cho nhóm của bạn</small>
    <Form>
        <Form.Group className="mb-3 mt-3">
            <Form.Label className='fw-bold'>Tên nhóm</Form.Label>
            <Form.Control type="text" placeholder="Nhập tên nhóm" className='rounded-5'/>
        </Form.Group>

        <Form.Group className="mb-3" style={{
          height: '120px'
        }}>
            <Form.Label className='fw-bold'>Miêu tả</Form.Label>
            <textarea
                placeholder="Nhập miêu tả về nhóm của bạn"
                style={{ height: '85%', width: '100%' }} // Điều chỉnh chiều cao của textarea
                className='border-1 rounded-4'
            />
        </Form.Group>

        <Form.Group className="mb-3">
            <Form.Label className='fw-bold'>Địa điểm</Form.Label>
            <Form.Select>
                <option>Chọn địa điểm</option>
                <option value="Da Nang, Viet Nam">Đà Nẵng, Việt Nam</option>
                <option value="Ha Noi, Viet Nam">Hà Nội, Việt Nam</option>
                <option value="Ho Chi Minh City, Viet Nam">Thành phố Hồ Chí Minh, Việt Nam</option>
            </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
            <Form.Label>Ảnh bìa</Form.Label>
            <div>
                <Button variant="secondary" onClick={() => document.getElementById('fileInput').click()}>
                    Nhấn vào đây để upload
                </Button>
                <Form.Control
                    type="file"
                    id="fileInput"
                    onChange={() => {}}
                    style={{ display: 'none' }}
                />
            </div>
        </Form.Group>
    </Form>
</FormSubmit>

                </Dropdown.Item>
                <Dropdown.Item href="#/action-2">Quản lí nhóm</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>

          </>
        ) : (
          <>
            <Form.Select aria-label="Default select example" className='group-dropdown-inf' style={{
              height: '44px',
              width: '200px',
              fontSize: '18px',
              padding: '10px 20px',
              borderRadius: '22px',
              color: 'green',
            }}>
              <option>Đã tham gia</option>
              <option value="Rời khỏi nhóm">Rời khỏi nhóm</option>
            </Form.Select>
          </>
        )}

      </div>

      <p style={{
        padding: '0px',
        fontWeight: '500',
        fontSize: '16px',
        marginBottom: '12px'
      }}>
        {members.map((member, index) => (
          <img
            key={member.id}
            src={member.image}
            alt={`member-${index}`}
            style={{
              width: '24px',
              height: '24px',
              borderRadius: '24px',
              objectFit: 'cover',
              marginRight: index === members.length - 1 ? '10px' : '-10px',
            }}
          />
        ))}
        {selectedGroup.members}
      </p>

      <p className='group-decription'>
        {selectedGroup.text}
      </p>

      <hr style={{ border: '1px solid #7F7F7F' }} />

      <div style={{ padding: '0px 32px' }} className='group-input'>
        <div className='d-flex gap-4 gap-md-2'>
          <img src="https://cdn.oneesports.vn/cdn-data/sites/4/2024/01/Zed_38.jpg" alt="icon" style={{
            width: '72px',
            height: '72px',
            borderRadius: '72px',
            objectFit: 'cover',
          }} className='group-input-avatar' />

          <div className='w-100'>
            <textarea type="text" style={{
              borderRadius: '20px',
              border: '2px solid #D9D9D9',
              width: '100%',
              height: '154px',
              padding: '20px',
              boxShadow: '4px 4px 4px rgba(0, 0, 0, 0.25)'
            }} className='text-post' />

            <div className='d-flex' style={{
              gap: '20px',
              marginTop: '22px'
            }}>
              <ion-icon name="image-outline" style={{ fontSize: '34px' }} ></ion-icon>
              <ion-icon name="location-outline" style={{ fontSize: '34px' }} ></ion-icon>

              <div className='w-100 d-flex flex-row-reverse'>
                <Button style={{
                  backgroundColor: '#409034',
                  border: 0,
                  borderRadius: '20px',
                  padding: '10px 20px',
                }}>Đăng bài</Button>
              </div>
            </div>

          </div>

        </div>
      </div>

      <hr style={{ border: '1px solid #7F7F7F' }} />

      <div style={{ padding: '0px 32px' }} className='group-input'>
        <PostGroupDetail />
        <PostGroupDetail />
      </div>
    </div>
  )
}

export default GroupDetail