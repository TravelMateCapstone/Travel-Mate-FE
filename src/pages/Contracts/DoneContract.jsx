import React from 'react'
import TimeLine from '../../components/Contracts/TimeLine'
function DoneContract() {
  return (

    <div className='d-flex flex-column gap-5'>
      <TimeLine activeStep={4}/>
      <div className='border-1' style={{
        border: '1px solid #d9d9d9',
        height: '700px',
        padding: '25px',
        display: 'flex',
        justifyContent: 'center',
      }}>

        <div className='d-flex flex-column'>
          <h2 className='text-success fw-bold'>
            Bạn đã hoàn thành chuyến đi !
          </h2>
          <p className='text-center'>Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi.</p>
        </div>
      </div>
    </div>
  )
}

export default DoneContract