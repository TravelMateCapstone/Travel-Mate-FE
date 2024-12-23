import React from 'react'
import car_mini from '../../assets/images/mini-car.gif'
import { Button } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import RoutePath from '../../routes/RoutePath'
import TimeLine from '../../components/Contracts/TimeLine'
function OngoingContract() {
  const navigate = useNavigate()
  return (
    <div>
      <TimeLine activeStep={3} />
      <div className='rounded-4' style={{
        border: '1px solid #d9d9d9',
        height: '700px',
        padding: '25px',
        display: 'flex',
        justifyContent: 'center',
      }}>

        <div className='d-flex flex-column'>
          <div className='d-flex flex-column align-items-center'><img src={car_mini} alt='icon' height={200} />
            <p>Dành thời gian để trải nghiệm chuyến đi tuyệt vời.</p>
          </div>
          <Button variant='outline-success' onClick={() => {
            console.log(localStorage.getItem('isLocal'))
            if (localStorage.getItem('isLocal') === 'local') {
              navigate(RoutePath.FINISH_CONTRACT_LOCAL)
            }
            else {
              navigate(RoutePath.FINISH_CONTRACT_TRAVELLER)
            }
          }}>
            Đánh giá sau khi hoàn thành chuyến đi
          </Button>
        </div>
      </div>
    </div>
  )
}

export default OngoingContract