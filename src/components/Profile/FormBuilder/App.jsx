
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import FormBuilder from './FormBuilder';
import AnswerQuestion from './AnswerQuestion';

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/form-builder" component={FormBuilder} />
        <Route path="/answer-question" component={AnswerQuestion} />
      </Switch>
    </Router>
  );
}

export default App;