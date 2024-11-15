import React, { useEffect, useState } from 'react';
import { Form, FormGroup, FormControl, FormLabel, Button, Container, Row, Col, Card } from 'react-bootstrap';

function AnswerQuestion() {
  const [questions, setQuestions] = useState([]);
  const [serviceQuestions, setServiceQuestions] = useState([]);
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    const savedData = localStorage.getItem('questionsAndServices');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      setQuestions(parsedData.questions || []);
      setServiceQuestions(parsedData.services || []);
    }
  }, []);

  const handleInputChange = (questionId, value, isCheckbox) => {
    if (isCheckbox) {
      setAnswers((prevAnswers) => {
        const currentAnswers = prevAnswers[questionId] || [];
        if (currentAnswers.includes(value)) {
          return {
            ...prevAnswers,
            [questionId]: currentAnswers.filter((answer) => answer !== value),
          };
        } else {
          return {
            ...prevAnswers,
            [questionId]: [...currentAnswers, value],
          };
        }
      });
    } else {
      setAnswers({
        ...answers,
        [questionId]: value,
      });
    }
  };

  const handleSave = () => {
    const updatedQuestions = questions.map((question) => ({
      ...question,
      answer: answers[question.id] || '',
    }));
    const updatedServiceQuestions = serviceQuestions.map((question) => ({
      ...question,
      answer: answers[question.id] || '',
    }));
    const dataToSave = {
      questions: updatedQuestions,
      services: updatedServiceQuestions
    };
    localStorage.setItem('questionsAndServices', JSON.stringify(dataToSave));
    console.log('Saved questions with answers:', dataToSave);
  };

  const handleDeleteQuestion = (id) => {
    const remainingQuestions = questions.filter((question) => question.id !== id);
    const serviceQuestions = remainingQuestions.filter((question) => question.type === 'service');
    if (serviceQuestions.length === 0) {
      alert('Không thể xóa câu hỏi dịch vụ cuối cùng.');
      return;
    }
    setQuestions(remainingQuestions);
  };

  const calculateTotalAmount = () => {
    return serviceQuestions.reduce((total, question) => {
      if ((answers[question.id] || []).includes(question.serviceName)) {
        const amount = parseFloat(answers[question.id]?.amount || question.amount || 0);
        return total + amount;
      }
      return total;
    }, 0);
  };

  return (
    <Container>
      {serviceQuestions.length > 0 && (
        <div>
          <h5>Dịch vụ</h5>
          <Card className='p-3'>
            <div className='d-flex justify-content-between'>
              <h6 className='text-muted'>Dịch vụ cung cấp</h6>
              <h6 className='text-muted'>Giá tiền</h6>
            </div>
            {serviceQuestions.map((question, index) => (
              <Form key={index}>
                <FormGroup className='d-flex align-items-center gap-2 justify-content-between'>
                  <Form.Check
                    type="checkbox"
                    className='text-success'
                    label={question.serviceName}
                    checked={(answers[question.id] || []).includes(question.serviceName)}
                    onChange={(e) => handleInputChange(question.id, question.serviceName, true)}
                  />
                  <p className='m-0 text-success'>{answers[question.id]?.amount || question.amount} VNĐ</p>
                </FormGroup>
              </Form>
            ))}
             <div className='d-flex justify-content-between'>
              <h6 className='text-muted'>Tổng tiền</h6>
              <h6 className='text-muted'>{calculateTotalAmount()} VNĐ</h6>
            </div>
          </Card>
        </div>
      )}
      <h5>Câu hỏi</h5>
      {questions.map((question) => (
        <Card key={question.id} className="mb-1" style={{ position: 'relative', width: '100%' }}>
          <Card.Body>
            <Form>
              <FormGroup>
                <FormLabel className='text-muted'>{question.text}</FormLabel>
                {question.type === 'text' && (
                  <FormControl
                    type="text"
                    value={answers[question.id] || ''}
                    onChange={(e) => handleInputChange(question.id, e.target.value)}
                    placeholder='Nhập câu trả lời..'
                  />
                )}
                {question.type === 'yesno' && (
                  <div>
                    <Form.Check
                      type="radio"
                      name={question.id}
                      value="yes"
                      label="Yes"
                      checked={answers[question.id] === 'yes'}
                      onChange={() => handleInputChange(question.id, 'yes')}
                    />
                    <Form.Check
                      type="radio"
                      name={question.id}
                      value="no"
                      label="No"
                      checked={answers[question.id] === 'no'}
                      onChange={() => handleInputChange(question.id, 'no')}
                    />
                  </div>
                )}
                {question.type === 'service' && (
                  <div>
                    <FormControl
                      type="text"
                      placeholder="Tên dịch vụ"
                      value={answers[question.id]?.serviceName || ''}
                      onChange={(e) => handleInputChange(question.id, { ...answers[question.id], serviceName: e.target.value })}
                    />
                    <FormControl
                      type="text"
                      placeholder="Số lượng"
                      value={answers[question.id]?.amount || ''}
                      onChange={(e) => handleInputChange(question.id, { ...answers[question.id], amount: e.target.value })}
                    />
                  </div>
                )}
                {question.options && question.options.map((option, index) => (
                  <Form.Check
                    key={index}
                    type={question.type === 'checkbox' ? 'checkbox' : 'radio'}
                    name={question.id}
                    value={option}
                    label={option}
                    checked={question.type === 'checkbox' ? (answers[question.id] || []).includes(option) : answers[question.id] === option}
                    onChange={(e) => handleInputChange(question.id, option, question.type === 'checkbox')}
                  />
                ))}
              </FormGroup>
            </Form>
          </Card.Body>
        </Card>
      ))}
      <Button style={{ backgroundColor: 'green', borderColor: 'green' }} onClick={handleSave}>Lưu</Button>
    </Container>
  );
}

export default AnswerQuestion;