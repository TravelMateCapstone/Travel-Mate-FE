import React from 'react';
import TextInputQuestion from './TextInputQuestion';
import YesNoQuestion from './YesNoQuestion';
import MultipleChoiceQuestion from './MultipleChoiceQuestion';
import CheckboxQuestion from './CheckboxQuestion';

function Question({ question, onUpdate, onDelete }) {
  switch (question.type) {
    case 'text':
      return <TextInputQuestion question={question} onUpdate={onUpdate} onDelete={onDelete} />;
    case 'yesno':
      return <YesNoQuestion question={question} onUpdate={onUpdate} onDelete={onDelete} />;
    case 'multiple-choice':
      return <MultipleChoiceQuestion question={question} onUpdate={onUpdate} onDelete={onDelete} />;
    case 'checkbox':
      return <CheckboxQuestion question={question} onUpdate={onUpdate} onDelete={onDelete} />;
    default:
      return null;
  }
}

export default Question;
