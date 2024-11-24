import React from 'react'
import { Card, Row, Col, Form, ListGroup, Button } from 'react-bootstrap'
import axios from 'axios'
import { useSelector } from 'react-redux'

function RequestCard({ request }) {
  const token = useSelector(state => state.auth.token);

  console.log(request);


  const handleAccept = async () => {
    try {
      await axios.post(
        `https://travelmateapp.azurewebsites.net/api/ExtraFormDetails/AcceptRequest?travelerId=${request.travelerId}`,
        {},
        { headers: { Authorization: `${token}` } }
      );
      alert('Request accepted successfully');
    } catch (error) {
      console.error('Error accepting request:', error);
      alert('Failed to accept request');
    }
  };

  const handleReject = async () => {
    try {
      await axios.post(
        `https://travelmateapp.azurewebsites.net/api/ExtraFormDetails/RejectRequest?travelerId=${request.travelerId}`,
        {},
        { headers: { Authorization: `${token}` } }
      );
      alert('Request rejected successfully');
    } catch (error) {
      console.error('Error rejecting request:', error);
      alert('Failed to reject request');
    }
  };

  return (
    <Card className='mb-4' style={{ width: '500px' }}>
      <Card.Header className='text-center'>Yêu cầu kết nối</Card.Header>
      <Card.Body>
        <h6>Thời gian</h6>
        <Row className='mb-2'>
          <Col>
            <Form.Control
              type="datetime-local"
              value={request?.startDate ? new Date(request.startDate).toISOString().slice(0, 16) : ''}
              readOnly
            />
          </Col>
          <Col>
            <Form.Control
              type="datetime-local"
              value={request?.endDate ? new Date(request.endDate).toISOString().slice(0, 16) : ''}
              readOnly
            />
          </Col>
        </Row>
        <h6>Dịch vụ</h6>
        <ListGroup className='mb-2'>
          <ListGroup.Item className='d-flex justify-content-between'>
            <span>Dịch vụ cung cấp</span>
            <span>Thành tiền</span>
          </ListGroup.Item>
          {request?.services?.$values?.map(service => (
            <ListGroup.Item key={service.id} className='d-flex justify-content-between'>
              <span>{service.serviceName}</span>
              <span>{service.amount} VNĐ</span>
            </ListGroup.Item>
          ))}
        </ListGroup>
        <h6>Câu hỏi</h6>
        {request?.questions?.$values?.map(question => {
          const answer = request?.answeredQuestions?.$values?.find(aq => aq.questionId === question.id)?.answer.$values;
          return (
            <Card key={question.id} className='mb-2'>
              <Card.Body>
                <Card.Title>{question.text}</Card.Title>
                {question.type == 'text' && (
                  <Form.Control as="textarea" value={answer?.[0]} readOnly />
                )}
                {question.type == 'single' && (
                  <div>
                    {question.options.$values.map(option => (
                      <Form.Check
                        key={option}
                        type='radio'
                        label={option}
                        checked={answer?.includes(option)}
                        readOnly
                      />
                    ))}
                  </div>
                )}
                {question.type == 'multiple' && (
                  <div>
                    {question.options.$values.map(option => (
                      <Form.Check
                        key={option}
                        type='checkbox'
                        label={option}
                        checked={answer?.includes(option)}
                        readOnly
                      />
                    ))}
                  </div>
                )}
                {question.type == 'yesno' && (
                  <div>
                    {['yes', 'no'].map(option => (
                      <Form.Check
                        key={option}
                        type='radio'
                        label={option}
                        checked={answer?.includes(option)}
                        readOnly
                      />
                    ))}
                  </div>
                )}
              </Card.Body>
            </Card>
          );
        })}

        <div className='d-flex justify-content-between mt-3'>
          <Button variant='success' onClick={handleAccept}>Chấp nhận</Button>
          <Button variant='danger' onClick={handleReject}>Từ chối</Button>
        </div>
      </Card.Body>
    </Card>
  )
}

export default RequestCard