import React, { useState, useEffect } from 'react';
import { Form, FormGroup, FormControl, FormLabel, Button } from 'react-bootstrap';

function CheckboxQuestion({ question, onUpdate }) {
  const [text, setText] = useState(question.text || '');
  const [options, setOptions] = useState(question.options || []);

  useEffect(() => {
    onUpdate({ ...question, text, options });
  }, [text, options]);

  const addOption = () => {
    setOptions([...options, '']);
  };

  return (
    <Form style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '5px' }}>
      <FormGroup>
        <FormLabel style={{ color: 'green' }}>Câu hỏi nhiều đáp án nhiều lựa chọn</FormLabel>
        <FormControl 
          type="text" 
          placeholder='Nhập câu hỏi..?' 
          value={text} 
          onChange={(e) => setText(e.target.value)} 
          style={{ width: '100%' }} 
        />
        {options.map((option, index) => (
          <div key={index} className='d-flex align-items-center gap-2'>
            <FormControl 
              type="text" 
              placeholder='Nhập câu trả lời ..?' 
              value={option} 
              onChange={(e) => {
                const newOptions = [...options];
                newOptions[index] = e.target.value;
                setOptions(newOptions);
              }} 
              style={{ width: '100%' }} 
            />
          </div>
        ))}
        <Button style={{ backgroundColor: 'green', borderColor: 'green' }} onClick={addOption}>Thêm câu trả lời</Button>
      </FormGroup>
    </Form>
  );
}

export default CheckboxQuestion;
