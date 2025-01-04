import { useEffect, useState } from 'react'
import CreateTour from '../../components/ProfileManagement/CreateTour'
import TourCard from '../../components/ProfileManagement/TourCard'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { useQuery, useQueryClient } from 'react-query'
import { Table, Placeholder, Dropdown, Tabs, Tab } from 'react-bootstrap';

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
      <Table striped bordered hover>
        <thead>
          <tr style={{ textAlign: 'center', verticalAlign: 'middle' }}>
            <th>Thông tin</th>
            <th>Kinh phí</th>
            <th>Thời gian</th>
            <th>Số lượng tham gia</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            Array.from({ length: 5 }).map((_, index) => (
              <tr key={index}>
                <td className='d-flex gap-3 align-items-center'>
                  <Placeholder as="div" animation="wave" style={{ width: '150px', height: '100px' }}>
                    <Placeholder className="rounded-3 w-100 h-100" />
                  </Placeholder>
                  <div className='d-flex flex-column justify-content-center'>
                    <Placeholder as="h6" animation="wave" className="mb-2">
                      <Placeholder xs={6} />
                    </Placeholder>
                    <Placeholder as="p" animation="wave" className="mb-1">
                      <Placeholder xs={4} />
                    </Placeholder>
                    <Placeholder as="p" animation="wave" className="mb-0">
                      <Placeholder xs={3} />
                    </Placeholder>
                  </div>
                </td>
                <td>
                  <Placeholder as="p" animation="wave" className="m-0">
                    <Placeholder xs={5} />
                  </Placeholder>
                </td>
                <td>
                  <Placeholder as="div" animation="wave" className="d-flex align-items-center gap-5">
                    <div className='d-flex flex-column align-items-center'>
                      <Placeholder xs={4} className="mb-1" />
                      <Placeholder xs={4} />
                    </div>
                  </Placeholder>
                </td>
                <td>
                  <Placeholder as="small" animation="wave">
                    <Placeholder xs={3} />
                  </Placeholder>
                </td>
                <td>
                  <Dropdown>
                    <Dropdown.Toggle variant="success" disabled>
                      <Placeholder as="div" animation="wave" style={{ width: '20px', height: '20px' }}>
                        <Placeholder className="w-100 h-100" />
                      </Placeholder>
                    </Dropdown.Toggle>
                  </Dropdown>
                </td>
              </tr>
            ))
          ) : (
            tours?.map((tour) => (
              <TourCard key={tour.id} tour={tour} onTourUpdated={handleTourUpdated} />
            ))
          )}
        </tbody>
      </Table>
    </div>
  )
}

export default LocalTripHistory
