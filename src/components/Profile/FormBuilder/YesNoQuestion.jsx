import React, { useState, useEffect } from 'react';
import { Form, FormGroup, FormControl, FormLabel } from 'react-bootstrap';

function YesNoQuestion({ question, onUpdate }) {
  const [text, setText] = useState(question.text || '');

  useEffect(() => {
    onUpdate({ ...question, text });
  }, [text]);

  return (
    <Form style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '5px' }}>
      <FormGroup>
        <FormLabel style={{ color: 'green' }}>Câu hỏi Yes/No</FormLabel>
        <FormControl 
          type="text" 
          placeholder='Nhập câu hỏi ..?' 
          value={text} 
          onChange={(e) => setText(e.target.value)} 
        />
      </FormGroup>
    </Form>
  );
}

export default YesNoQuestion;
