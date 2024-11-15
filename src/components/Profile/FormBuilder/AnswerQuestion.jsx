import React, { useEffect, useState } from 'react';
import { Form, FormGroup, FormControl, FormLabel, Button, Container, Row, Col, Card } from 'react-bootstrap';

function AnswerQuestion() {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    const savedQuestions = localStorage.getItem('questions');
    if (savedQuestions) {
      setQuestions(JSON.parse(savedQuestions));
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
    localStorage.setItem('questions', JSON.stringify(updatedQuestions));
    console.log('Saved questions with answers:', updatedQuestions);
  };

  return (
    <Container>
      {questions.map((question) => (
        <Card key={question.id} className="mb-1">
          <Card.Body>
            <Form>
              <FormGroup>
                <FormLabel>{question.text}</FormLabel>
                {question.type === 'text' && (
                  <FormControl
                    type="text"
                    value={answers[question.id] || ''}
                    onChange={(e) => handleInputChange(question.id, e.target.value)}
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