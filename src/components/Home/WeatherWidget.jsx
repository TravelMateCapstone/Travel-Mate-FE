import React from 'react';
import { Card } from 'react-bootstrap';

function WeatherWidget() {
  return (
    <Card className="mb-3">
      <Card.Body>
        <h5>Ho Chi Minh</h5>
        <p>Weather details go here...</p>
      </Card.Body>
    </Card>
  );
}

export default WeatherWidget;
