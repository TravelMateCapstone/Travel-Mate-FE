import { useEffect, useState } from 'react'
import CreateTour from '../../components/ProfileManagement/CreateTour'
import TourCard from '../../components/ProfileManagement/TourCard'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { useQuery, useQueryClient } from 'react-query'
import { Placeholder, Dropdown, Tabs, Tab, Button } from 'react-bootstrap';

function LocalTripHistory() {
  const [approvalStatus, setApprovalStatus] = useState(1)
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

  const { data: tours, isLoading, refetch } = useQuery(['tours', approvalStatus], fetchTours)

  useEffect(() => {
    refetch()
  }, [approvalStatus, refetch])

  const handleTourUpdated = () => {
    queryClient.invalidateQueries('tours');
  };

  return (
    <div className='mt-3'>
      <div className='mb-4 d-flex justify-content-between align-items-center'>
        <CreateTour onTourCreated={() => queryClient.invalidateQueries('tours')} />
        <div>
          <Tabs
          className='no-border-radius'
            id="approval-status-tabs "
            activeKey={approvalStatus}
            onSelect={(k) => setApprovalStatus(Number(k))}
          >
            <Tab eventKey={0} title="Đang xử lý"></Tab>
            <Tab eventKey={1} title="Đã chấp nhận"></Tab>
            <Tab eventKey={2} title="Từ chối"></Tab>
          </Tabs>
        </div>
      </div>
      <div className="tour-cards-container">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="tour-card d-flex justify-content-between mb-3 rounded-3" style={{ boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)' }}>
              <div className="tour-card-header d-flex gap-3">
                <Placeholder as="div" animation="wave" style={{ width: '274px', height: '174px' }}>
                  <Placeholder className="rounded-3 w-100 h-100" />
                </Placeholder>
                <div className='d-flex flex-column my-3 gap-2'>
                  <div className='d-flex gap-2'>
                    <Placeholder as="h5" animation="wave" className="m-0 fw-medium">
                      <Placeholder xs={6} />
                    </Placeholder>
                    <small style={{ display: 'block', marginTop: '0' }}>
                      <ion-icon style={{ color: 'gray' }} name="checkmark-circle-outline"></ion-icon>
                    </small>
                  </div>
                  <Placeholder as="p" animation="wave" className="m-0 fw-medium">
                    <Placeholder xs={4} />
                  </Placeholder>
                  <Placeholder as="p" animation="wave" className="m-0 fw-medium">
                    <Placeholder xs={3} />
                  </Placeholder>
                  <div className='d-flex gap-2'>
                    <Placeholder as="p" animation="wave" className="fw-medium">
                      <Placeholder xs={2} />
                    </Placeholder>
                    {Array.from({ length: 4 }).map((_, btnIndex) => (
                      <Button key={btnIndex} variant='outline-success'>
                        <Placeholder xs={1} />
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="tour-card-body d-flex gap-4">
                <div className="tour-card-info d-flex align-items-end">
                  <Placeholder as="p" animation="wave" className='fw-medium text-success'>
                    <Placeholder xs={3} />
                  </Placeholder>
                </div>
                <div className="tour-card-actions d-flex align-items-center">
                  <Dropdown>
                    <Dropdown.Toggle variant="" style={{ border: '1px solid #ddd', height: '174px', width: '60px' }}>
                      <ion-icon name="settings-outline" style={{ textAlign: 'center', verticalAlign: 'middle' }}></ion-icon>
                    </Dropdown.Toggle>
                  </Dropdown>
                </div>
              </div>
            </div>
          ))
        ) : (
          tours?.map((tour) => (
            <TourCard key={tour.id} tour={tour} onTourUpdated={handleTourUpdated} approvalStatus={approvalStatus} />
          ))
        )}
      </div>
    </div>
  )
}

export default LocalTripHistory
