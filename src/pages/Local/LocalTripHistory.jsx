import React, { useEffect, useState } from 'react'
import CreateTour from '../../components/ProfileManagement/CreateTour'
import TourCard from '../../components/ProfileManagement/TourCard'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { useQuery, useQueryClient } from 'react-query'
import { Form } from 'react-bootstrap'

function LocalTripHistory() {
  const [approvalStatus, setApprovalStatus] = useState(0)
  const token = useSelector(state => state.auth.token)
  const queryClient = useQueryClient()

  const fetchTours = async () => {
    const response = await axios.get(`https://travelmateapp.azurewebsites.net/api/Tour/toursStatus/${approvalStatus}`, {
      headers: {
        'Authorization': `${token}`
      }
    })
    return response.data.$values
  }

  const { data: tours, refetch } = useQuery(['tours', approvalStatus], fetchTours)

  useEffect(() => {
    refetch()
  }, [approvalStatus, refetch])

  const handleTourUpdated = () => {
    queryClient.invalidateQueries('tours');
  };

  return (
    <div>
      <div className='mb-4 d-flex justify-content-between align-items-center'>
        <CreateTour onTourCreated={() => queryClient.invalidateQueries('tours')} />
        <div>
          <Form.Select  value={approvalStatus} onChange={(e) => setApprovalStatus(Number(e.target.value))}>
            <option value={0}>Đang xử lí</option>
            <option value={1}>Đã chấp nhận</option>
            <option value={2}>Từ chối</option>
          </Form.Select>
        </div>
      </div>
      <div>
        {tours?.map((tour) => (
          <TourCard key={tour.id} tour={tour} onTourUpdated={handleTourUpdated} />
        ))}
      </div>
    </div>
  )
}

export default LocalTripHistory