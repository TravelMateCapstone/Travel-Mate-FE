import React from 'react'

function PaymentContract() {
  return (
    <div className='rounded-4 d-flex flex-column align-items-center' style={{
      padding: '25px',
      border: '1px solid #d9d9d9'
    }}>
      <h5 className='fw-light m-0'>Mã QR chuyển khoản ngân hàng</h5>
      <img src='https://images.viblo.asia/2b174eac-50bd-40c0-91c8-bbecab2093b5.png' className='object-fit-cover' height={460} />
      <h5 className='fw-light mb-3'>Thông tin chuyển khoản ngân hàng</h5>
      <p className='text-danger m-0'>
        Vui lòng chuyển đúng nội dung ACHT17892 để chúng tôi có thể xác nhân thanh toán
      </p>
      <p className='text-danger'>
        Sau khi thanh toán thành công thì trang sẽ tự chuyển hướng
      </p>

      <div className='w-50 d-flex flex-column gap-3'>
        <div className='d-flex justify-content-between'>
          <p className='m-0 fw-medium'>Tên tài khoản</p>
          <p className='m-0 fw-medium'>Tran Thanh Tri</p>
        </div>

        <div className='d-flex justify-content-between'>
          <p className='m-0 fw-medium'>Số tài khoản</p>
          <p className='m-0 fw-medium'>498573928475922</p>
        </div>

        <div className='d-flex justify-content-between'>
          <p className='m-0 fw-medium'>Ngân hàng</p>
          <p className='m-0 fw-medium'>Ngân hàng TMCP Quân đội</p>
        </div>

        <div className='d-flex justify-content-between'>
          <p className='m-0 fw-medium'>Số tiền</p>
          <p className='m-0 fw-medium'>1.350.000 VNĐ</p>
        </div>
      </div>
    </div>
  )
}

export default PaymentContract