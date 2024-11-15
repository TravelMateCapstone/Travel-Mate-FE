import React, { useState, useEffect } from 'react';
import { Form, FormGroup, FormControl, FormLabel, Button } from 'react-bootstrap';

function CheckboxQuestion({ question, onUpdate, onDelete }) {
  const [text, setText] = useState(question.text || '');
  const [options, setOptions] = useState(question.options || []);

  useEffect(() => {
    onUpdate({ ...question, text, options });
  }, [text, options]);

  const addOption = () => {
    setOptions([...options, '']);
  };

  return (
    <Form style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '5px', position: 'relative' }}>
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
              style={{ width: '100%', marginTop: '10px' }} 
            />
          </div>
        ))}
        <Button style={{ backgroundColor: 'green', borderColor: 'green', marginTop: '10px' }} onClick={addOption}>Thêm câu trả lời</Button>
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

export default CheckboxQuestion;
