import React from 'react';
import { Form, FormGroup, FormControl, Button } from 'react-bootstrap';

function MultipleChoiceQuestion({ question, onUpdate, onDelete }) {
  const handleQuestionTextChange = (event) => {
    onUpdate({ ...question, text: event.target.value });
  };

  const handleOptionChange = (index, event) => {
    const newOptions = [...question.options];
    newOptions[index] = event.target.value;
    onUpdate({ ...question, options: newOptions });
  };

  const addOption = () => {
    onUpdate({ ...question, options: [...question.options, ''] });
  };

  return (
    <Form style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '20px', position: 'relative', width: '100%' }}>
      <FormGroup>
        <div style={{ color: 'green' }} className="mb-1 d-flex align-items-center justify-content-between">
          <h6 className="m-0">Câu hỏi trắc nghiệm</h6>
          <Button variant="" className="p-1 d-flex justify-content-center align-items-center" onClick={() => onDelete(question.id)}>
            <ion-icon name="close-outline" style={{ fontSize: '24px' }}></ion-icon>
          </Button>
        </div>
        <FormControl type="text" value={question.text || ''} onChange={handleQuestionTextChange} placeholder="Nhập câu hỏi ..?" style={{ width: '100%' }} />
        {question.options.map((option, index) => (
          <FormControl key={index} type="text" value={option} onChange={(event) => handleOptionChange(index, event)} placeholder="Nhập lựa chọn ..?" style={{ width: '100%', marginTop: '10px' }} />
        ))}
        <Button style={{ backgroundColor: 'green', borderColor: 'green', marginTop: '10px' }} onClick={addOption}>Thêm lựa chọn</Button>
      </FormGroup>
    </Form>
  );
}

export default MultipleChoiceQuestion;