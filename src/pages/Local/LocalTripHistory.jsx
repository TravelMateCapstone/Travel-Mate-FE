import React, { useEffect, useState } from 'react'
import CreateTour from '../../components/ProfileManagement/CreateTour'
import TourCard from '../../components/ProfileManagement/TourCard'
import axios from 'axios'
import { useSelector } from 'react-redux'
function LocalTripHistory() {
  const [tours, setTours] = useState([])
  const [approvalStatus, setApprovalStatus] = useState(0)
  const token = useSelector(state => state.auth.token)

  useEffect(() => {
    axios.get(`https://travelmateapp.azurewebsites.net/api/Tour/toursStatus/${approvalStatus}`, {
      headers: {
        'Authorization': `${token}`
      }
    }).then((response) => {
      console.log(response.data.$values)
      setTours(response.data.$values)
    });
  }, [approvalStatus])

  return (
    <div>
     <div className='mb-4 d-flex justify-content-between align-items-center'>
        <CreateTour />
        <div>
          <select value={approvalStatus} onChange={(e) => setApprovalStatus(Number(e.target.value))}>
            <option value={0}>Đang xử lí</option>
            <option value={1}>Đã chấp nhận</option>
            <option value={2}>Từ chối</option>
          </select>
        </div>
     </div>
      <div>
        {tours.map((tour) => (
          <TourCard key={tour.id} tour={tour} />
        ))}
      </div>
    </div>
  )
}

export default LocalTripHistory