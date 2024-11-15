import React, { useState, useEffect } from 'react';
import { Modal, Button, Row, FormGroup, Dropdown, DropdownButton } from 'react-bootstrap';
import FormSubmit from '../../Shared/FormSubmit';
import Question from './Question';
import MultipleChoiceQuestion from './MultipleChoiceQuestion';

function FormBuilder() {
    const [questions, setQuestions] = useState(() => {
        const savedQuestions = localStorage.getItem('questions');
        return savedQuestions ? JSON.parse(savedQuestions) : [];
    });
    const [showModal, setShowModal] = useState(false);

    const addQuestion = (type) => {
        const newQuestion = {
            id: Date.now(),
            type: type,
            options: type === 'multiple-choice' || type === 'checkbox' ? ['Option 1'] : [],
        };
        setQuestions([...questions, newQuestion]);
    };

    const handleShow = () => setShowModal(true);
    const handleClose = () => setShowModal(false);

    const handleSave = () => {
        localStorage.setItem('questions', JSON.stringify(questions));
        console.log('Questions saved to localStorage:', questions);
    };

    const updateQuestion = (updatedQuestion) => {
        setQuestions(questions.map(q => q.id === updatedQuestion.id ? updatedQuestion : q));
    };

    return (
        <div>
            <Button variant="primary" style={{ backgroundColor: 'green', borderColor: 'green' }} onClick={handleShow}>
                Xem các câu hỏi
            </Button>
            <Modal show={showModal} centered onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Các câu hỏi</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ maxHeight: '400px', overflowY: 'auto' }}>
                    {questions.map((q) => (
                        <Row key={q.id}>
                            {q.type === 'multiple-choice' ? (
                                <MultipleChoiceQuestion question={q} onUpdate={updateQuestion} />
                            ) : (
                                <Question question={q} onUpdate={updateQuestion} />
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
                    <Button variant='secondary'>Đóng</Button>

                    <Button variant="secondary" style={{ backgroundColor: 'green', borderColor: 'green' }} onClick={handleSave}>
                        lưu
                    </Button>


                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default FormBuilder;