import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

function AnswerQuestion() {
  const [formData, setFormData] = useState(null);
  const [answers, setAnswers] = useState({});
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
      startDate: "2024-11-23T07:30:00Z",
      endDate: "2024-11-30T07:30:00Z",
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
    return <div>Loading...</div>;
  }

  return (
    <div>
      {formData.questions.$values.map(question => (
        <div key={question.id}>
          <p>{question.text}</p>
          {question.type === 'multiple-choice' && (
            <div>
              {question.options.$values.map(option => (
                <label key={option}>
                  <input
                    type="radio"
                    name={question.id}
                    value={option}
                    onChange={() => handleChange(question.id, option)}
                  /> {option}
                </label>
              ))}
            </div>
          )}
          {question.type === 'yesno' && (
            <div>
              <label>
                <input
                  type="radio"
                  name={question.id}
                  value="yes"
                  onChange={() => handleChange(question.id, 'yes')}
                /> Yes
              </label>
              <label>
                <input
                  type="radio"
                  name={question.id}
                  value="no"
                  onChange={() => handleChange(question.id, 'no')}
                /> No
              </label>
            </div>
          )}
          {question.type === 'multiple' && (
            <div>
              {question.options.$values.map(option => (
                <label key={option}>
                  <input
                    type="checkbox"
                    value={option}
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
                  /> {option}
                </label>
              ))}
            </div>
          )}
          {question.type === 'text' && (
            <div>
              <input
                type="text"
                name={question.id}
                onChange={(e) => handleChange(question.id, e.target.value)}
              />
            </div>
          )}
          {question.type === 'single' && (
            <div>
              {question.options.$values.map(option => (
                <label key={option}>
                  <input
                    type="radio"
                    name={question.id}
                    value={option}
                    onChange={() => handleChange(question.id, option)}
                  /> {option}
                </label>
              ))}
            </div>
          )}
        </div>
      ))}
      <button onClick={handleSubmit}>Save</button>
    </div>
  );
}

export default AnswerQuestion;