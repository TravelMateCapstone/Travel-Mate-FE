import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { Button, Dropdown, Modal, Form, Row, Col } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import '../../../assets/css/Profile/FormBuilder/FormBuilder.css'
import { toast } from 'react-toastify'
import FormModal from '../../Shared/FormModal';

function FormBuilder() {
  const [questions, setQuestions] = useState([])
  const [services, setServices] = useState([{ id: new Date().getTime(), serviceName: '', amount: 0 }])
  const [showModal, setShowModal] = useState(false)
  const user = useSelector(state => state.auth.user)

  const addQuestion = useCallback(() => {
    const newQuestion = {
      id: new Date().getTime(),
      type: 'text',
      question: '',
      option: [],
    }
    setQuestions(prevQuestions => [...prevQuestions, newQuestion])
  }, [])

  const addService = useCallback(() => {
    const newService = {
      id: new Date().getTime(),
      serviceName: '',
      amount: 0
    }
    setServices(prevServices => [...prevServices, newService])
  }, [])

  const updateService = useCallback((id, updatedService) => {
    setServices(prevServices => prevServices.map(service => service.id === id ? updatedService : service))
  }, [])

  const handleChangeService = useCallback((id, e) => {
    const { name, value } = e.target
    setServices(prevServices => prevServices.map(service => service.id === id ? { ...service, [name]: value } : service))
  }, [])

  const handleChangeQuestion = useCallback((id, e) => {
    const { value } = e.target;
    setQuestions(prevQuestions => prevQuestions.map(question => question.id === id ? { ...question, question: value } : question));
  }, [])

  const handleDeleteService = useCallback((id) => {
    setServices(prevServices => prevServices.filter(service => service.id !== id))
  }, [])

  const handleSave = useCallback(() => {
    if (services.length === 0) {
      toast.error('Phải có ít nhất 1 dịch vụ')
      return;
    }
    const dataSave = {
      questions: questions,
      services: services,
      createByUser: user.id
    }
    localStorage.setItem('form_data', JSON.stringify(dataSave))
    toast.success('Lưu thành công')
  }, [questions, services, user.id])

  const deleteQuestion = useCallback((id) => {
    setQuestions(prevQuestions => prevQuestions.filter(question => question.id !== id))
  }, [])

  const deleteAllQuestions = useCallback(() => {
    setQuestions([])
  }, [])

  const deleteAllServices = useCallback(() => {
    setServices([{ id: new Date().getTime(), serviceName: '', amount: 0 }])
  }, [])

  const addOption = useCallback((questionId) => {
    setQuestions(prevQuestions => prevQuestions.map(question =>
      question.id === questionId
        ? { ...question, option: [...question.option, { id: new Date().getTime(), text: '' }] }
        : question
    ));
  }, [])

  const handleOptionChange = useCallback((questionId, optionId, e) => {
    const { value } = e.target;
    setQuestions(prevQuestions => prevQuestions.map(question =>
      question.id === questionId
        ? { ...question, option: question.option.map(opt => opt.id === optionId ? { ...opt, text: value } : opt) }
        : question
    ));
  }, [])

  const updateQuestionType = useCallback((id, type) => {
    setQuestions(prevQuestions => prevQuestions.map(question =>
      question.id === id
        ? { ...question, type, option: type === 'single' || type === 'multiple' ? [{ id: new Date().getTime(), text: '' }] : [] }
        : question
    ));
  }, [])

  const handleDeleteQuestion = useCallback((id) => {
    setQuestions(prevQuestions => prevQuestions.filter(question => question.id !== id));
  }, [])

  const handleDeleteOption = useCallback((questionId, optionId) => {
    setQuestions(prevQuestions => prevQuestions.map(question =>
      question.id === questionId
        ? { ...question, option: question.option.filter(opt => opt.id !== optionId) }
        : question
    ));
  }, [])

  const renderedServices = useMemo(() => services.map(service => (
    <div key={service.id} className='w-100 d-flex align-items-center gap-2 mb-2'>
      <Form.Control
        type="text"
        name="serviceName"
        value={service.serviceName}
        onChange={(e) => handleChangeService(service.id, e)}
        placeholder="Tên dịch vụ"
        className='service-name'
      />
      <Form.Control
        type="number"
        name="amount"
        value={service.amount}
        onChange={(e) => handleChangeService(service.id, e)}
        placeholder="Giá"
        className='service-amount'
      />
      <Button size='sm' className='bg-transparent text-danger border-0 shadow-none px-1 button-delete-service' variant="danger" onClick={() => handleDeleteService(service.id)}>
        <ion-icon name="trash-outline" style={{ fontSize: '20px' }}></ion-icon>
      </Button>
    </div>
  )), [services, handleChangeService, handleDeleteService])

  const renderedQuestions = useMemo(() => questions.map(question => (
    <div key={question.id} className='question mb-2'>
      <div className='d-flex justify-content-between align-items-center gap-2 mb-2'>
        <Form.Control
          type="text"
          placeholder="Nhập câu hỏi"
          value={question.question}
          onChange={(e) => handleChangeQuestion(question.id, e)}
        />
        <div className='d-flex gap-2'>
          <Dropdown>
            <Dropdown.Toggle size='sm' variant="success" className=''>
              <ion-icon name="funnel-outline"></ion-icon>
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => updateQuestionType(question.id, 'text')}>Câu hỏi mở</Dropdown.Item>
              <Dropdown.Item onClick={() => updateQuestionType(question.id, 'yesno')}>Câu hỏi đóng (Có/Không)</Dropdown.Item>
              <Dropdown.Item onClick={() => updateQuestionType(question.id, 'single')}>Câu hỏi trắc nghiệm đơn lựa chọn</Dropdown.Item>
              <Dropdown.Item onClick={() => updateQuestionType(question.id, 'multiple')}>Câu hỏi trắc nghiệm nhiều lựa chọn</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          <Button size='sm' variant='danger' className='' onClick={() => handleDeleteQuestion(question.id)}> <ion-icon name="trash-outline"></ion-icon></Button>
        </div>
      </div>
      <div>
        {question.type === 'single' || question.type === 'multiple' ? (
          <div className='options'>
            {question.option.map(opt => (
              <div key={opt.id} className='d-flex align-items-center mb-2'>
                <Form.Control
                  type="text"
                  placeholder="Nhập lựa chọn"
                  value={opt.text}
                  onChange={(e) => handleOptionChange(question.id, opt.id, e)}
                />
                <Button variant="danger" onClick={() => handleDeleteOption(question.id, opt.id)}>
                  <ion-icon name="trash-outline"></ion-icon>
                </Button>
              </div>
            ))}
            <Button onClick={() => addOption(question.id)}>Thêm lựa chọn</Button>
          </div>
        ) : null}
      </div>
    </div>
  )), [questions, handleChangeQuestion, updateQuestionType, handleDeleteQuestion, handleOptionChange, handleDeleteOption, addOption])

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