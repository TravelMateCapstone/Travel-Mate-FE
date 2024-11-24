
import React from 'react'
import { Card, Row, Col, Form, ListGroup } from 'react-bootstrap'

function RequestCard({ request }) {
  return (
    <Card className='mb-4'>
      <Card.Header className='text-center'>Yêu cầu kết nối</Card.Header>
      <Card.Body>
        <h6>Thời gian</h6>
        <Row className='mb-2'>
          <Col>
            <Form.Control type="datetime-local" value={new Date(request.startDate).toISOString().slice(0, 16)} readOnly />
          </Col>
          <Col>
            <Form.Control type="datetime-local" value={new Date(request.endDate).toISOString().slice(0, 16)} readOnly />
          </Col>
        </Row>
        <h6>Dịch vụ</h6>
        <ListGroup className='mb-2'>
          <ListGroup.Item className='d-flex justify-content-between'>
            <span>Dịch vụ cung cấp</span>
            <span>Thành tiền</span>
          </ListGroup.Item>
          {request.services.$values.map(service => (
            <ListGroup.Item key={service.id} className='d-flex justify-content-between'>
              <span>{service.serviceName}</span>
              <span>{service.amount} VNĐ</span>
            </ListGroup.Item>
          ))}
        </ListGroup>
        <h6>Câu hỏi</h6>
        {request.questions.$values.map(question => {
          const answer = request.answeredQuestions.$values.find(aq => aq.questionId === question.id)?.answer.$values;
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
      </Card.Body>
    </Card>
  )
}

export default RequestCard