import React from 'react'
import reption from '../../assets/images/receipt.png'
function FailContract() {
    
  return (
    <div className='rounded-4' style={{
        border: '1px solid #d9d9d9',
        height: '700px',
        padding: '25px',
        display: 'flex',
        justifyContent: 'center',
      }}>
        <div className='d-flex flex-column align-items-center'>
        <img src={reption} alt="" width={150}/>
        <p className='mt-5'>Thanh toán chuyến đi thất bại !</p>
        </div>
    
      </div>
  )
}

export default FailContract