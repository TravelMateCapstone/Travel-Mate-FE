import React from 'react';
import TextInputQuestion from './TextInputQuestion';
import YesNoQuestion from './YesNoQuestion';
import MultipleChoiceQuestion from './MultipleChoiceQuestion';
import CheckboxQuestion from './CheckboxQuestion';

function Question({ question, onUpdate }) {
  switch (question.type) {
    case 'text':
      return <TextInputQuestion question={question} onUpdate={onUpdate} />;
    case 'yesno':
      return <YesNoQuestion question={question} onUpdate={onUpdate} />;
    case 'multiple-choice':
      return <MultipleChoiceQuestion question={question} onUpdate={onUpdate} />;
    case 'checkbox':
      return <CheckboxQuestion question={question} onUpdate={onUpdate} />;
    default:
      return null;
  }
}

export default Question;
