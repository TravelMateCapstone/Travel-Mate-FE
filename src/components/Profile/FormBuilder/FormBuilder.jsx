import React, { useState, useEffect } from 'react';
import { Modal, Button, Row, FormGroup, Dropdown, DropdownButton } from 'react-bootstrap';
import Question from './Question';
import MultipleChoiceQuestion from './MultipleChoiceQuestion';
import ServiceQuestion from './ServiceQuestion';
import { toast } from 'react-toastify';
import '../../../assets/css/Profile/FormBuilder/FormBuilder.css'
import { useSelector } from 'react-redux';

function FormBuilder() {
    const user = useSelector(state => state.auth.user);
    console.log('User:', user);
    
    const [questions, setQuestions] = useState(() => {
        const savedQuestions = localStorage.getItem('questions');
        const initialQuestions = savedQuestions ? JSON.parse(savedQuestions) : [];
        return initialQuestions.filter(q => q.type !== 'service');
    });

    const [serviceQuestions, setServiceQuestions] = useState(() => {
        const savedQuestions = localStorage.getItem('questions');
        const initialQuestions = savedQuestions ? JSON.parse(savedQuestions) : [];
        if (initialQuestions.length === 0 || !initialQuestions.some(q => q.type === 'service')) {
            initialQuestions.push({
                // id: Date.now(),
                type: 'service',
                serviceName: '',
                amount: ''
            });
        }
        return initialQuestions.filter(q => q.type === 'service');
    });

    const [showModal, setShowModal] = useState(false);

    const addQuestion = (type) => {
        const newQuestion = {
            id: Date.now(),
            type: type,
            options: type === 'multiple-choice' || type === 'checkbox' ? ['Option 1'] : [],
            serviceName: type === 'service' ? '' : undefined,
            amount: type === 'service' ? '' : undefined,
        };
        if (type === 'service') {
            setServiceQuestions([...serviceQuestions, newQuestion]);
        } else {
            setQuestions([...questions, newQuestion]);
        }
    };

    const handleShow = () => setShowModal(true);
    const handleClose = () => setShowModal(false);

    const handleSave = () => {
        const allQuestions = [...questions, ...serviceQuestions];
        const groupedServiceQuestions = allQuestions.filter(q => q.type === 'service');
        const nonServiceQuestions = allQuestions.filter(q => q.type !== 'service');
        const dataToSave = {
            createById: user.id,
            questions: nonServiceQuestions,
            services: groupedServiceQuestions
        };
        localStorage.setItem('questionsAndServices', JSON.stringify(dataToSave));
        console.log('Data saved to localStorage:', dataToSave);
    };

    const handleClearQuestions = () => {
        setQuestions([]);
        setServiceQuestions([{
            id: Date.now(),
            type: 'service',
            serviceName: '',
            amount: ''
        }]);
    };

    const updateQuestion = (updatedQuestion) => {
        if (updatedQuestion.type === 'service') {
            setServiceQuestions(serviceQuestions.map(q => q.id === updatedQuestion.id ? updatedQuestion : q));
        } else {
            setQuestions(questions.map(q => q.id === updatedQuestion.id ? updatedQuestion : q));
        }
    };

    const deleteQuestion = (id) => {
        const remainingQuestions = questions.filter(q => q.id !== id);
        const remainingServiceQuestions = serviceQuestions.filter(q => q.id !== id);
        if (remainingServiceQuestions.length === 0) {
            toast.error('Phải có ít nhất 1 dịch vụ !');
            return;
        }
        setQuestions(remainingQuestions);
        setServiceQuestions(remainingServiceQuestions);
    };

    return (
        <div>
            <Button variant="primary" style={{ backgroundColor: 'green', borderColor: 'green' }} onClick={handleShow}>
                Xem các câu hỏi
            </Button>
            <Modal show={showModal} centered onHide={handleClose} className='form_builder custom-modal-formbuilder'>
                <Modal.Header closeButton>
                    <Modal.Title>Mẫu thông tin local</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ overflowY: 'auto', }}>
                    Dịch vụ
                    {serviceQuestions.map((q) => (
                        <Row key={q.id} className='w-100'>
                            <ServiceQuestion question={q} onUpdate={updateQuestion} onAddService={() => addQuestion('service')} onDelete={deleteQuestion} />
                        </Row>
                    ))}
                    {serviceQuestions.length > 0 && (
                        <div className='w-100'>
                            <Button className='mb-2' onClick={() => addQuestion('service')}>Thêm dịch vụ</Button>
                        </div>
                    )}
                    {questions.map((q) => (
                        <Row key={q.id} className='w-100'>
                            {q.type === 'multiple-choice' ? (
                                <MultipleChoiceQuestion question={q} onUpdate={updateQuestion} onDelete={deleteQuestion} />
                            ) : (
                                <Question question={q} onUpdate={updateQuestion} onDelete={deleteQuestion} />
                            )}
                        </Row>
                    ))}

                </Modal.Body>
                <Modal.Footer>
                    <DropdownButton id="dropdown-basic-button" title="Thêm câu hỏi" style={{ backgroundColor: 'green', borderColor: 'green' }}>
                        <Dropdown.Item onClick={() => addQuestion('text')}>Thêm câu hỏi nhập văn bản</Dropdown.Item>
                        <Dropdown.Item onClick={() => addQuestion('yesno')}>Thêm câu hỏi Yes/No</Dropdown.Item>
                        <Dropdown.Item onClick={() => addQuestion('multiple-choice')}>Thêm câu hỏi trắc nghiệm</Dropdown.Item>
                        <Dropdown.Item onClick={() => addQuestion('checkbox')}>Thêm câu hỏi checkbox</Dropdown.Item>
                    </DropdownButton>
                    <Button variant='secondary' onClick={handleClose}>Đóng</Button>
                    <Button variant="secondary" style={{ backgroundColor: 'green', borderColor: 'green' }} onClick={handleSave}>
                        lưu
                    </Button>
                    <Button variant="danger" onClick={handleClearQuestions}>
                        Xóa hết câu hỏi
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default FormBuilder;