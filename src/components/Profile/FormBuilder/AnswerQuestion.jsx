import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { Container, Form, Button, Spinner } from 'react-bootstrap';

function AnswerQuestion() {
  const [formData, setFormData] = useState(null);
  const [answers, setAnswers] = useState({});
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const token = useSelector(state => state.auth.token);

  useEffect(() => {
    axios.get('https://travelmateapp.azurewebsites.net/api/ExtraFormDetails/TravelerForm?localId=9', {
      headers: {
        Authorization: `${token}`
      }
    })
      .then(response => {
        setFormData(response.data);
      })
      .catch(error => {
        console.error('Error fetching form data:', error);
      });
  }, [token]);

  const handleChange = (questionId, value) => {
    setAnswers(prevAnswers => ({
      ...prevAnswers,
      [questionId]: value
    }));
  };

  const handleSubmit = () => {
    const answeredQuestions = Object.keys(answers).map(questionId => ({
      questionId,
      answer: Array.isArray(answers[questionId]) ? answers[questionId] : [answers[questionId]]
    }));

    const payload = {
      startDate,
      endDate,
      answeredQuestions,
      answeredServices: [] // Add services if needed
    };
    console.log('Submitting form data:', payload);
    axios.put('https://travelmateapp.azurewebsites.net/api/ExtraFormDetails/TravelerForm?localId=9', payload, {
      headers: {
        Authorization: `${token}`
      }
    })
      .then(response => {
        toast.success('Gửi yêu cầu thành công.');
        console.log('Form data saved successfully:', response.data);
      })
      .catch(error => {
        console.error('Error saving form data:', error);
      });
  };

  if (!formData) {
    return <Spinner animation="border" />;
  }

  return (
    <Container>
      <Form>
        <Form.Group>
          <Form.Label>Start Date</Form.Label>
          <Form.Control
            type="datetime-local"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>End Date</Form.Label>
          <Form.Control
            type="datetime-local"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </Form.Group>
        {formData.questions.$values.map(question => (
          <Form.Group key={question.id}>
            <Form.Label>{question.text}</Form.Label>
            {question.type === 'multiple-choice' && (
              <div>
                {question.options.$values.map(option => (
                  <Form.Check
                    type="radio"
                    name={question.id}
                    value={option}
                    label={option}
                    onChange={() => handleChange(question.id, option)}
                    key={option}
                  />
                ))}
              </div>
            )}
            {question.type === 'yesno' && (
              <div>
                <Form.Check
                  type="radio"
                  name={question.id}
                  value="yes"
                  label="Yes"
                  onChange={() => handleChange(question.id, 'yes')}
                />
                <Form.Check
                  type="radio"
                  name={question.id}
                  value="no"
                  label="No"
                  onChange={() => handleChange(question.id, 'no')}
                />
              </div>
            )}
            {question.type === 'multiple' && (
              <div>
                {question.options.$values.map(option => (
                  <Form.Check
                    type="checkbox"
                    value={option}
                    label={option}
                    onChange={(e) => {
                      const newAnswers = answers[question.id] || [];
                      if (e.target.checked) {
                        newAnswers.push(option);
                      } else {
                        const index = newAnswers.indexOf(option);
                        if (index > -1) {
                          newAnswers.splice(index, 1);
                        }
                      }
                      handleChange(question.id, newAnswers);
                    }}
                    key={option}
                  />
                ))}
              </div>
            )}
            {question.type === 'text' && (
              <Form.Control
                type="text"
                name={question.id}
                onChange={(e) => handleChange(question.id, e.target.value)}
              />
            )}
            {question.type === 'single' && (
              <div>
                {question.options.$values.map(option => (
                  <Form.Check
                    type="radio"
                    name={question.id}
                    value={option}
                    label={option}
                    onChange={() => handleChange(question.id, option)}
                    key={option}
                  />
                ))}
              </div>
            )}
          </Form.Group>
        ))}
        <Button variant="primary" onClick={handleSubmit}>Lưu thay đổi</Button>
      </Form>
    </Container>
  );
}

export default AnswerQuestion;