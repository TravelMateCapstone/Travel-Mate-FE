import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { Col, Form, Row } from 'react-bootstrap'

const DateTimeInput = React.memo(({ placeholder, value, onChange, readOnly }) => (
  <Form.Control type="datetime-local" placeholder={placeholder} value={value} onChange={onChange} readOnly={readOnly} />
));

function formatDateTime(dateTime) {
  const date = new Date(dateTime);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function ViewFormRequest() {
  const token = useSelector(state => state.auth.token)
  const [formData, setFormData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`https://travelmateapp.azurewebsites.net/api/ExtraFormDetails/TravelerForm?localId=8`, {
          headers: {
            Authorization: `${token}`
          }
        })
        setFormData(response.data)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [token])

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className='w-50 p-4 rounded-4' style={{
      background: '#d9d9d9'
    }}>
      <h5 className='text-center'>Yêu cầu kết nối</h5>
      <h6 className='my-3'>Thời gian</h6>
      <Row className='mb-3'>
        <Col><DateTimeInput placeholder='Nhập ngày bắt đầu' value={formatDateTime(formData?.startDate)} readOnly /></Col>
        <Col><DateTimeInput placeholder='Nhập ngày kết thúc' value={formatDateTime(formData?.endDate)} readOnly /></Col>
      </Row>
      <h6>Dịch vụ</h6>
      <div className='border-1 py-2 px-3 rounded-3 bg-white'>
        <div className='d-flex justify-content-between mb-2'>
          <small className='text-success'>Dịch vụ cung cấp</small>
          <small className='text-success'>Thành tiền</small>
        </div>
        {formData?.services.$values.map((service, index) => (
          <div key={index}>
            <div className='d-flex justify-content-between mb-2'>
              <small>{service.serviceName}</small>
              <small>{service.amount} VNĐ</small>
            </div>

          </div>
        ))}
        <div className='d-flex justify-content-between'>
          <small>Tổng tiền</small>
          <small>0 VNĐ</small>
        </div>
      </div>
      <h6 className='my-3'>Câu hỏi</h6>
      {formData?.questions.$values.map((question, index) => (
        <div key={index}>
          <p>{question.text}</p>
          <p>Answer: {question.answer.$values.join(', ')}</p>
        </div>
      ))}
    </div>
  )
}

export default ViewFormRequest