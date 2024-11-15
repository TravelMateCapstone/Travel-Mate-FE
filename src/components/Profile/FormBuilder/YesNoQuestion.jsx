import React, { useState, useEffect } from 'react';
import { Form, FormGroup, FormControl, FormLabel } from 'react-bootstrap';

function YesNoQuestion({ question, onUpdate, onDelete }) {
  const [text, setText] = useState(question.text || '');

  useEffect(() => {
    onUpdate({ ...question, text });
  }, [text]);

  return (
    <Form style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '5px', position: 'relative', width: '100%' }}>
      <FormGroup>
        <FormLabel style={{ color: 'green' }}>Câu hỏi Yes/No</FormLabel>
        <FormControl 
          type="text" 
          placeholder='Nhập câu hỏi ..?' 
          value={text} 
          onChange={(e) => setText(e.target.value)} 
        />
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

export default YesNoQuestion;
