import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { Button, Dropdown, Modal, Form, Row, Col } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import '../../../assets/css/Profile/FormBuilder/FormBuilder.css'
import { toast } from 'react-toastify'
import FormModal from '../../Shared/FormModal';
import axios from 'axios';

function FormBuilder() {
  const [questions, setQuestions] = useState([])
  const [services, setServices] = useState([{ id: new Date().getTime(), serviceName: '', amount: 0 }])
  const [showModal, setShowModal] = useState(false)
  const user = useSelector(state => state.auth.user)
  const token = useSelector(state => state.auth.token);

  const addQuestion = useCallback(() => {
    const newQuestion = {
      type: 'text',
      question: '',
      option: [],
    };
    setQuestions(prevQuestions => [...prevQuestions, newQuestion]);
  }, []);


  const addService = useCallback(() => {
    const newService = {
      serviceName: '',
      amount: 0,
    };
    setServices(prevServices => [...prevServices, newService]);
  }, []);


  const updateService = useCallback((id, updatedService) => {
    setServices(prevServices => prevServices.map(service => service.id === id ? updatedService : service))
  }, [])

  const handleChangeService = useCallback((index, e) => {
    const { name, value } = e.target;
    setServices(prevServices => prevServices.map((service, i) => i === index ? { ...service, [name]: value } : service));
  }, []);


  const handleChangeQuestion = useCallback((index, e) => {
    const { value } = e.target;
    setQuestions(prevQuestions => prevQuestions.map((question, i) => i === index ? { ...question, question: value } : question));
  }, []);


  const handleDeleteService = useCallback((index) => {
    setServices(prevServices => prevServices.filter((_, i) => i !== index));
  }, []);


  const handleSave = useCallback(async () => {
    if (services.length === 0) {
      toast.error('Phải có ít nhất 1 dịch vụ');
      return;
    }
  
    // Chuẩn bị dữ liệu theo định dạng API yêu cầu
    const dataSave = {
      questions: questions.map(q => ({
        type: q.type, 
        text: q.question,
        options: q.option.map(opt => opt.text),
      })),
      services: services.map(s => ({
        serviceName: s.serviceName,
        amount: parseFloat(s.amount) || 0,
      })),
    };
  
    try {
      // Gửi dữ liệu lên API
      await axios.put('https://travelmateapp.azurewebsites.net/api/ExtraFormDetails/LocalForm', dataSave, {
        headers: {
          Authorization: `${token}` // Đảm bảo token được gửi đúng định dạng
        }
      });
      toast.success('Lưu thành công');
    } catch (error) {
      console.error('Error saving data:', error);
      toast.error('Lưu thất bại');
    }
  }, [questions, services, token]);

  const deleteQuestion = useCallback((id) => {
    setQuestions(prevQuestions => prevQuestions.filter(question => question.id !== id))
  }, [])

  const deleteAllQuestions = useCallback(() => {
    setQuestions([])
  }, [])

  const deleteAllServices = useCallback(() => {
    setServices([{ id: new Date().getTime(), serviceName: '', amount: 0 }])
  }, [])

  const addOption = useCallback((index) => {
    setQuestions(prevQuestions =>
      prevQuestions.map((question, i) =>
        i === index
          ? { ...question, option: [...question.option, { id: new Date().getTime(), text: '' }] }
          : question
      )
    );
  }, []);


  const handleOptionChange = useCallback((questionIndex, optionIndex, e) => {
    const { value } = e.target;
    setQuestions(prevQuestions =>
      prevQuestions.map((question, i) =>
        i === questionIndex
          ? {
              ...question,
              option: question.option.map((opt, j) =>
                j === optionIndex ? { ...opt, text: value } : opt
              ),
            }
          : question
      )
    );
  }, []);
  

  const updateQuestionType = useCallback((index, type) => {
    setQuestions(prevQuestions => prevQuestions.map((question, i) =>
      i === index
        ? { ...question, type, option: type === 'single' || type === 'multiple' ? [{ id: new Date().getTime(), text: '' }] : [] }
        : question
    ));
  }, []);


  const handleDeleteQuestion = useCallback((index) => {
    setQuestions(prevQuestions => prevQuestions.filter((_, i) => i !== index));
  }, []);

  const handleDeleteOption = useCallback((questionIndex, optionIndex) => {
    setQuestions(prevQuestions =>
      prevQuestions.map((question, i) =>
        i === questionIndex
          ? {
            ...question,
            option: question.option.filter((_, j) => j !== optionIndex),
          }
          : question
      )
    );
  }, []);

  const fetchFormData = useCallback(async () => {
    try {
      const response = await axios.get('https://travelmateapp.azurewebsites.net/api/ExtraFormDetails/LocalForm', {
        headers: {
          Authorization: `${token}`
        }
      });
      console.log(response.data);
      
      const data = response.data;
      setQuestions(data.questions.$values.map(q => ({
        type: q.type,
        question: q.text,
        option: q.options.$values.map(opt => ({ id: new Date().getTime(), text: opt }))
      })));
      setServices(data.services.$values.map(s => ({
        id: new Date().getTime(),
        serviceName: s.serviceName,
        amount: s.amount
      })));
      toast.success('Lấy dữ liệu thành công');
    } catch (error) {
      console.log('Error fetching data:', error);
      
      toast.error('Lấy dữ liệu thất bại');
    }
  }, [token]);
  
  useEffect(() => {
    if (showModal) {
      fetchFormData();
    }
  }, [showModal, fetchFormData]);

  const renderedServices = useMemo(() => services.map((service, index) => (
    <div key={index} className='w-100 d-flex align-items-center gap-2 mb-2'>
      <Form.Control
        type="text"
        name="serviceName"
        value={service.serviceName}
        onChange={(e) => handleChangeService(index, e)}
        placeholder="Tên dịch vụ"
        className='service-name'
      />
      <Form.Control
        type="number"
        name="amount"
        value={service.amount}
        onChange={(e) => handleChangeService(index, e)}
        placeholder="Giá"
        className='service-amount'
      />
      <Button
        size='sm'
        className='bg-transparent text-danger border-0 shadow-none px-1 button-delete-service'
        variant="danger"
        onClick={() => handleDeleteService(index)}
      >
        <ion-icon name="trash-outline" style={{ fontSize: '20px' }}></ion-icon>
      </Button>

    </div>
  )), [services, handleChangeService, handleDeleteService]);


  const renderedQuestions = useMemo(() => questions.map((question, index) => (
    <div key={index} className='question mb-2'>
      <div className='d-flex justify-content-between align-items-center gap-2 mb-2'>
        <Form.Control
          type="text"
          placeholder="Nhập câu hỏi"
          value={question.question}
          onChange={(e) => handleChangeQuestion(index, e)}
        />
        <div className='d-flex gap-2'>
          <Dropdown>
            <Dropdown.Toggle size='sm' variant="success" className=''>
              <ion-icon name="funnel-outline"></ion-icon>
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => updateQuestionType(index, 'text')}>Câu hỏi mở</Dropdown.Item>
              <Dropdown.Item onClick={() => updateQuestionType(index, 'yesno')}>Câu hỏi đóng (Có/Không)</Dropdown.Item>
              <Dropdown.Item onClick={() => updateQuestionType(index, 'single')}>Câu hỏi trắc nghiệm đơn lựa chọn</Dropdown.Item>
              <Dropdown.Item onClick={() => updateQuestionType(index, 'multiple')}>Câu hỏi trắc nghiệm nhiều lựa chọn</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          <Button
            size='sm'
            variant='danger'
            className=''
            onClick={() => handleDeleteQuestion(index)}
          >
            <ion-icon name="trash-outline"></ion-icon>
          </Button>

        </div>
      </div>
      <div>
        {question.type === 'single' || question.type === 'multiple' ? (
          <div className='options'>
            {question.option.map((opt, optIndex) => (
              <div key={optIndex} className='d-flex align-items-center mb-2'>
                <Form.Control
                  type="text"
                  placeholder="Nhập lựa chọn"
                  value={opt.text}
                  onChange={(e) => handleOptionChange(index, optIndex, e)}
                />
                <Button
                  variant="danger"
                  onClick={() => handleDeleteOption(index, optIndex)} // Truyền đúng questionIndex và optionIndex
                >
                  <ion-icon name="trash-outline"></ion-icon>
                </Button>
              </div>
            ))}
            <Button onClick={() => addOption(index)}>Thêm lựa chọn</Button>

          </div>
        ) : null}
      </div>
    </div>
  )), [questions, handleChangeQuestion, updateQuestionType, handleDeleteQuestion, handleOptionChange, handleDeleteOption, addOption]);

  return (
    <div>
      <Button variant='success' className='rounded-5' onClick={() => setShowModal(true)}>Tạo mẫu thông tin</Button>
      <FormModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        title="Tạo mẫu thông tin"
        saveButtonText="Lưu thay đổi"
        handleSave={handleSave}
        isSubmitting={false}
        isSubmitted={false}
      >
        <div className='w-100'>
          <h5>Dịch vụ</h5>
          {renderedServices}
          <Button size='sm' onClick={addService} className='d-flex align-items-center gap-1 rounded-5'>Thêm dịch vụ <ion-icon name="restaurant-outline" style={{ fontSize: '20px' }}></ion-icon></Button>
        </div>

        <div className='w-100'>
          <h5>Câu hỏi</h5>
          {renderedQuestions}
          <Button size='sm' onClick={addQuestion} className='d-flex align-items-center gap-1 rounded-5'>Thêm câu hỏi <ion-icon name="help-circle-outline" style={{ fontSize: '20px' }}></ion-icon></Button>
        </div>
      </FormModal>
    </div>
  )
}

export default FormBuilder