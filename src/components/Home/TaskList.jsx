import React from 'react';
import { Card, ListGroup, Badge } from 'react-bootstrap';

function TaskList() {
  return (
    <Card className="mb-3">
      <Card.Body>
        <h5>Tasks</h5>
        <ListGroup>
          <ListGroup.Item>
            Task 1 <Badge bg="success">Complete</Badge>
          </ListGroup.Item>
          <ListGroup.Item>
            Task 2 <Badge bg="warning">In Progress</Badge>
          </ListGroup.Item>
        </ListGroup>
      </Card.Body>
    </Card>
  );
}

export default TaskList;
