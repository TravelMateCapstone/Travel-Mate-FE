import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import axios from 'axios'

function AnswerQuestion() {
  const token = useSelector(state => state.auth.token)
  const [data, setData] = useState();
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    questions: [],
    services: []
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://travelmateapp.azurewebsites.net/api/ExtraFormDetails/TravelerForm?localId=8', {
          headers: {
            Authorization: `${token}`
          }
        })
        console.log(response.data);
        setData(response.data)
        setFormData({
          startDate: response.data.startDate,
          endDate: response.data.endDate,
          questions: response.data.questions.$values,
          services: response.data.services.$values
        })
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
  }, [token])

  const handleInputChange = (e, index, type) => {
    const { name, value, checked } = e.target;
    const updatedQuestions = [...formData.questions];

    if (type === 'text') {
      updatedQuestions[index].answer.$values = [value];
    } else if (type === 'yesno') {
      updatedQuestions[index].answer.$values = [value];
    } else if (type === 'multiple-choice') {
      updatedQuestions[index].answer.$values = [value];
    } else if (type === 'checkbox') {
      if (checked) {
        updatedQuestions[index].answer.$values.push(value);
      } else {
        updatedQuestions[index].answer.$values = updatedQuestions[index].answer.$values.filter(ans => ans !== value);
      }
    }

    setFormData({ ...formData, questions: updatedQuestions });
  }

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  }

  const handleSubmit = async () => {
    try {
      console.log(formData);
      await axios.put('https://travelmateapp.azurewebsites.net/api/ExtraFormDetails/TravelerForm?localId=8', formData, {
        headers: {
          Authorization: `${token}`
        }
      });
      alert('Data saved successfully');
    } catch (error) {
      console.error('Error saving data:', error);
    }
  }

  return (
    <div>
      <h6>Thời gian</h6>
      <div className='d-flex justify-content-between'>
        <input type="datetime-local" name="startDate" value={formData.startDate} onChange={handleDateChange} />
        <input type="datetime-local" name="endDate" value={formData.endDate} onChange={handleDateChange} />
      </div>
      <h6>Dịch vụ</h6>
      {data?.services?.$values?.map((service, index) => (
        <div key={index} className='d-flex justify-content-between'>
          <div className='d-flex align-items-center gap-2 mb-2'>
            <input type="checkbox" />
            <small>{service.serviceName}</small>
          </div>
          <small>{service.amount} VNĐ</small>
        </div>
      ))}
      <h6>Câu hỏi</h6>
      {data?.questions?.$values?.map((question, index) => (
        <div key={index}>
          {question.type == 'text' && (
            <div key={index}>
              <p>{question.text}</p>
              <input type="text" value={formData.questions[index]?.answer?.$values?.join(', ')} onChange={(e) => handleInputChange(e, index, 'text')} />
            </div>
          )}
          {question.type == 'yesno' && (
            <div key={index}>
              <p>{question.text}</p>
              <div className='d-flex gap-2'>
                <input type="radio" name={`yesno-${index}`} value='yes' checked={formData.questions[index]?.answer?.$values?.includes('yes')} onChange={(e) => handleInputChange(e, index, 'yesno')} />
                <small>Có</small>
                <input type="radio" name={`yesno-${index}`} value='no' checked={formData.questions[index]?.answer?.$values?.includes('no')} onChange={(e) => handleInputChange(e, index, 'yesno')} />
                <small>Không</small>
              </div>
            </div>
          )}
          {question.type == 'multiple-choice' && (
            <div key={index}>
              <p>{question.text}</p>
              {question.options.$values.map((option, optIndex) => (
                <div key={optIndex} className='d-flex gap-2'>
                  <input type="radio" name={`multiple-choice-${index}`} value={option} checked={formData.questions[index]?.answer?.$values?.includes(option)} onChange={(e) => handleInputChange(e, index, 'multiple-choice')} />
                  <small>{option}</small>
                </div>
              ))}
            </div>
          )}
          {question.type == 'checkbox' && (
            <div key={index}>
              <p>{question.text}</p>
              {question.options.$values.map((option, optIndex) => (
                <div key={optIndex} className='d-flex gap-2'>
                  <input type="checkbox" value={option} checked={formData.questions[index]?.answer?.$values?.includes(option)} onChange={(e) => handleInputChange(e, index, 'checkbox')} />
                  <small>{option}</small>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
      <button onClick={handleSubmit}>Lưu thay đổi</button>
    </div>
  )
}

export default AnswerQuestion