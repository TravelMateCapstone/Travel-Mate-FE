import React, { useEffect, useState } from 'react'
import TextareaAutosize from 'react-textarea-autosize';
import { Form, Row, Col, Container } from 'react-bootstrap';

const DateTimeInput = React.memo(({ placeholder }) => (
  <Form.Control type="datetime-local" placeholder={placeholder} />
));

const ServiceRow = React.memo(({ service }) => (
  <Row key={service.id} className='d-flex mb-2'>
    <Form.Check type="checkbox" />
    <div className='d-flex gap-2'>
      <p className='m-0'>{service.serviceName}</p>
      <p className='m-0'>{service.amount}</p>
    </div>
  </Row>
));

const Question = React.memo(({ question }) => (
  <div key={question.id} className='mb-3 p-3 border rounded-4'>
    <p>{question.question}</p>
    {question.type === 'text' && (
      <TextareaAutosize type="text" className='w-100 rounded-3 border-0' placeholder="Nhập câu trả lời của bạn" />
    )}
    {question.type === 'yesno' && (
      <div className='d-flex gap-2'>
        <Form.Check type="radio" name={`question-${question.id}`} value="yes" label="Có" />
        <Form.Check type="radio" name={`question-${question.id}`} value="no" label="Không" />
      </div>
    )}
    {(question.type === 'single' || question.type === 'multiple') && (
      <div className='px-3'>
        {question.option.map(opt => (
          <div key={opt.id} className='mb-2'>
            <Form.Check type={question.type === 'single' ? 'radio' : 'checkbox'} name={`question-${question.id}`} />
            <p className='m-0'>{opt.text}</p>
          </div>
        ))}
      </div>
    )}
  </div>
));

function AnswerQuestion() {
  const [questions, setQuestions] = useState([]);
  const [services, setServices] = useState([]);
  
  useEffect(() => {
    const savedData = localStorage.getItem('form_data');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setQuestions(parsedData.questions);
        setServices(parsedData.services);
      } catch (error) {
        console.error('Error parsing form_data from localStorage', error);
      }
    }
  }, []);

  return (
    <Container>
      <h5>Thời gian</h5>
      <Row className='mb-3'>
        <Col><DateTimeInput placeholder='Nhập ngày bắt đầu' /></Col>
        <Col><DateTimeInput placeholder='Nhập ngày kết thúc' /></Col>
      </Row>
      <h5>Dịch vụ</h5>
      <div className='px-4'>
        {services.map(service => <ServiceRow key={service.id} service={service} />)}
      </div>
      <h5>Câu hỏi</h5>
      <div>
        {questions.map(question => <Question key={question.id} question={question} />)}
      </div>
    </Container>
  )
}

export default AnswerQuestion