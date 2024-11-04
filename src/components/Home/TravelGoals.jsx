import React from 'react';
import { Card, ProgressBar } from 'react-bootstrap';

function TravelGoals() {
  return (
    <Card className="mb-3">
      <Card.Body>
        <h5>Travel Goals</h5>
        <ProgressBar now={40} label="40%" />
      </Card.Body>
    </Card>
  );
}

export default TravelGoals;
