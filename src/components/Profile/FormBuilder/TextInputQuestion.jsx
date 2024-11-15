import React, { useState, useEffect } from 'react';
import { Form, FormGroup, FormControl, FormLabel } from 'react-bootstrap';

function TextInputQuestion({ question, onUpdate }) {
  const [text, setText] = useState(question.text || '');

  useEffect(() => {
    onUpdate({ ...question, text });
  }, [text]);

  return (
    <Form style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '5px' }}>
      <FormGroup>
        <FormLabel style={{ color: 'green' }}>Câu hỏi nhập văn bản</FormLabel>
        <FormControl 
          type="text" 
          placeholder='Nhập câu hỏi..?' 
          value={text} 
          onChange={(e) => setText(e.target.value)} 
          style={{ width: '100%' }}
        />
      </FormGroup>
    </Form>
  );
}

export default TextInputQuestion;
