import React from 'react'
import contract_glass from '../../assets/images/contact_glass.png'
function Contract() {
  return (
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
      <img src={contract_glass} alt="" />
    </div>
  )
}

export default Contract