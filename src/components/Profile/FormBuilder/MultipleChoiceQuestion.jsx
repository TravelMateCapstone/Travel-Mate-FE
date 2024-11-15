import React from 'react';
import { Form, FormGroup, FormControl, FormLabel, Button } from 'react-bootstrap';

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
    <Form style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '5px', position: 'relative', width: '100%' }}>
      <FormGroup>
        <FormLabel style={{ color: 'green' }}>Câu hỏi trắc nghiệm</FormLabel>
        <FormControl
          type="text"
          value={question.text || ''}
          onChange={handleQuestionTextChange}
          placeholder="Nhập câu hỏi ..?"
          style={{ width: '100%' }} 
        />
        {question.options.map((option, index) => (
          <FormControl
            key={index}
            type="text"
            value={option}
            onChange={(event) => handleOptionChange(index, event)}
            placeholder="Nhập lựa chọn ..?"
            style={{ width: '100%', marginTop: '10px' }} 
          />
        ))}
        <Button style={{ backgroundColor: 'green', borderColor: 'green', marginTop: '10px' }} onClick={addOption}>Thêm lựa chọn</Button>
      </FormGroup>
      <button 
        type="button" 
        onClick={() => onDelete(question.id)} 
        style={{ position: 'absolute', top: '10px', right: '10px', backgroundColor: 'red', color: 'white', border: 'none', borderRadius: '5px' }}
      >
        Xóa
      </button>
    </Form>
  );
}

export default MultipleChoiceQuestion;