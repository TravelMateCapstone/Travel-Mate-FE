import React from 'react';
import '../../assets/css/Contracts/CreateContract.css';
import contract_glass from '../../assets/images/contact_glass.png'
import { Button } from 'react-bootstrap';
import TimeLine from '../../components/Contracts/TimeLine';
function CreateContract() {
  return (
    <div>
      <div className='container d-flex justify-content-between'>
        <div>
          <div className='d-flex gap-2'>
            <ion-icon name="document-outline" style={{
              fontSize: '50px',
            }}></ion-icon>
            <p style={{
              fontSize: '30px',
              fontWeight: 'bold',
            }}>Hợp đồng</p>
          </div>
          <p>Hiện tại không có hợp đồng nào được tạo cho chuyến đi.  Hãy tìm và kết nối với người bạn thích hợp để trải nghiệm</p>

        </div>
        <Button style={{
          height: '44px',
        }}
          className='rounded-5 d-flex justify-content-center align-items-center gap-2 fw-medium'
          variant='outline-danger'
        >Hủy hợp đồng <ion-icon name="close-outline" style={{
          fontSize: '20px',
        }}></ion-icon></Button>
      </div>
      <TimeLine activeStep={1} />




    </div>
  );
}

export default CreateContract;
