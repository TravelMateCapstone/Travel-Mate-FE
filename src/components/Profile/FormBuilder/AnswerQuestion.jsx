import React, { useEffect, useState } from 'react'
import TextareaAutosize from 'react-textarea-autosize';
import { Form, Row, Col, Container, Button } from 'react-bootstrap';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const DateTimeInput = React.memo(({ placeholder, value, onChange }) => (
  <Form.Control type="datetime-local" placeholder={placeholder} value={value} onChange={onChange} />
));

const ServiceRow = React.memo(({ service, index, onChange }) => (
  <Row key={index} className='d-flex mb-2'>
    <Form.Check type="checkbox" checked={service.checked} onChange={() => onChange(index)} />
    <div className='d-flex gap-2'>
      <p className='m-0'>{service.serviceName}</p>
      <p className='m-0'>{service.amount}</p>
    </div>
  </Row>
));

const Question = React.memo(({ question, index, onChange }) => (
  <div key={index} className='mb-3 p-3 border rounded-4'>
    <p>{question.text}</p>
    {question.type === 'text' && (
      <TextareaAutosize type="text" className='w-100 rounded-3 border-0' placeholder="Nhập câu trả lời của bạn" value={question.answer[0]} onChange={(e) => onChange(index, e.target.value)} />
    )}
    {question.type === 'yesno' && (
      <div className='d-flex gap-2'>
        <Form.Check type="radio" name={`question-${index}`} value="Yes" label="Có" checked={question.answer[0] === 'Yes'} onChange={() => onChange(index, 'Yes')} />
        <Form.Check type="radio" name={`question-${index}`} value="No" label="Không" checked={question.answer[0] === 'No'} onChange={() => onChange(index, 'No')} />
      </div>
    )}
    {(question.type === 'multiple-choice' || question.type === 'checkbox') && (
      <div className='px-3'>
        {question.options.map((opt, optIndex) => (
          <div key={optIndex} className='mb-2'>
            <Form.Check type={question.type === 'multiple-choice' ? 'radio' : 'checkbox'} name={`question-${index}`} checked={question.answer.includes(opt)} onChange={() => onChange(index, opt)} />
            <p className='m-0'>{opt}</p>
          </div>
        ))}
      </div>
    )}
  </div>
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

function AnswerQuestion() {
  const [questions, setQuestions] = useState([]);
  const [services, setServices] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const token = useSelector(state => state.auth.token);

  const handleSave = () => {
    const payload = {
      startDate,
      endDate,
      questions: questions.map(q => ({
        type: q.type,
        text: q.text,
        options: q.options,
        answer: q.answer
      })),
      services: services.map(s => ({
        serviceName: s.serviceName,
        amount: s.amount,
        total: s.total
      }))
    };

    console.log('Payload:', payload); // Debugging line

    axios.put('https://travelmateapp.azurewebsites.net/api/ExtraFormDetails/TravelerForm?localId=8', payload, {
      headers: {
        Authorization: `${token}`,
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        toast.success('Cập nhật thông tin thành công');
        console.log('Data saved successfully', response);
      })
      .catch(error => {
        toast.error('Có lỗi xảy ra khi cập nhật thông tin');
        console.error('Error saving data', error);
        console.log('Response:', error.response); // Debugging line
      });
  };

  const handleQuestionChange = (index, value) => {
    setQuestions(prevQuestions => {
      const updatedQuestions = [...prevQuestions];
      if (updatedQuestions[index].type === 'checkbox') {
        if (updatedQuestions[index].answer.includes(value)) {
          updatedQuestions[index].answer = updatedQuestions[index].answer.filter(ans => ans !== value);
        } else {
          updatedQuestions[index].answer.push(value);
        }
      } else {
        updatedQuestions[index].answer = [value];
      }
      return updatedQuestions;
    });
  };

  const handleServiceChange = (index) => {
    setServices(prevServices => {
      const updatedServices = [...prevServices];
      updatedServices[index].checked = !updatedServices[index].checked;
      return updatedServices;
    });
  };

  useEffect(() => {
    axios.get('https://travelmateapp.azurewebsites.net/api/ExtraFormDetails/TravelerForm?localId=8', {
      headers: {
        Authorization: `${token}`
      }
    })
      .then(response => {
        const data = response.data;
        setQuestions(data.questions.$values.map(q => ({
          ...q,
          options: q.options.$values,
          answer: q.answer.$values
        })));
        setServices(data.services.$values.map(s => ({
          ...s,
          checked: true
        })));
        setStartDate(formatDateTime(data.startDate));
        setEndDate(formatDateTime(data.endDate));
      })
      .catch(error => {
        console.error('Error fetching data from API', error);
      });
  }, []);

  return (
    <Container>
      <h5>Thời gian</h5>
      <Row className='mb-3'>
        <Col><DateTimeInput placeholder='Nhập ngày bắt đầu' value={startDate} onChange={(e) => setStartDate(e.target.value)} /></Col>
        <Col><DateTimeInput placeholder='Nhập ngày kết thúc' value={endDate} onChange={(e) => setEndDate(e.target.value)} /></Col>
      </Row>
      <h5>Dịch vụ</h5>
      <div className='px-4'>
        {services.map((service, index) => <ServiceRow key={index} service={service} index={index} onChange={handleServiceChange} />)}
      </div>
      <h5>Câu hỏi</h5>
      <div>
        {questions.map((question, index) => <Question key={index} question={question} index={index} onChange={handleQuestionChange} />)}
      </div>
      <Button onClick={handleSave}>Lưu thông tin</Button>
    </Container>
  )
}

export default AnswerQuestion