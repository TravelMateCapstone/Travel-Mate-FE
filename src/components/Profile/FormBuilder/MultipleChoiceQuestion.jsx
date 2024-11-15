import React from 'react';
import { Form, FormGroup, FormControl, FormLabel, Button } from 'react-bootstrap';

function MultipleChoiceQuestion({ question, onUpdate }) {
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
    <Form style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '5px' }}>
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
            style={{ width: '100%' }} 
          />
        ))}
        <Button style={{ backgroundColor: 'green', borderColor: 'green' }} onClick={addOption}>Thêm lựa chọn</Button>
      </FormGroup>
    </Form>
  );
}

export default MultipleChoiceQuestion;