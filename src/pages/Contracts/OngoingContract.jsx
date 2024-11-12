import React from 'react'
import car_mini from '../../assets/images/mini-car.gif'
function OngoingContract() {
  return (
    <div className='rounded-4' style={{
      border: '1px solid #d9d9d9',
      height: '700px',
      padding: '25px',
      display: 'flex',
      justifyContent: 'center',
    }}>
      <div className='d-flex flex-column align-items-center'><img src={car_mini} alt='icon' height={200}/>
      <p>Dành thời gian để trải nghiệm chuyến đi tuyệt vời.</p>
      </div>
  
    </div>
  )
}

export default OngoingContract