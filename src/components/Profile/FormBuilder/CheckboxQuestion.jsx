import React, { useState, useEffect } from "react";
import { Form, FormGroup, FormControl, Button } from "react-bootstrap";

function CheckboxQuestion({ question, onUpdate, onDelete }) {
  const [text, setText] = useState(question.text || "");
  const [options, setOptions] = useState(question.options || []);

  useEffect(() => {
    onUpdate({ ...question, text, options });
  }, [text, options]);

  const addOption = () => {
    setOptions([...options, ""]);
  };

  return (
    <Form style={{ border: "1px solid #ccc", padding: "20px", borderRadius: "20px", position: "relative" }}>
      <FormGroup>
        <div style={{ color: "green" }} className="mb-1 d-flex align-items-center justify-content-between">
          <h6 className="m-0">Câu hỏi nhiều đáp án nhiều lựa chọn</h6>
          <Button variant="" className="p-1 d-flex justify-content-center align-items-center" onClick={() => onDelete(question.id)}>
            <ion-icon name="close-outline" style={{ fontSize: "24px" }}></ion-icon>
          </Button>
        </div>
        <FormControl type="text" placeholder="Nhập câu hỏi..?" value={text} onChange={(e) => setText(e.target.value)} style={{ width: "100%" }} />
        {options.map((option, index) => (
          <div key={index} className="d-flex align-items-center gap-2">
            <FormControl type="text" placeholder="Nhập câu trả lời ..?" value={option} onChange={(e) => {
              const newOptions = [...options];
              newOptions[index] = e.target.value;
              setOptions(newOptions);
            }} style={{ width: "100%", marginTop: "10px" }} />
          </div>
        ))}
        <Button style={{ backgroundColor: "green", borderColor: "green", marginTop: "10px" }} onClick={addOption}>Thêm câu trả lời</Button>
      </FormGroup>
    </Form>
  );
}

export default CheckboxQuestion;
