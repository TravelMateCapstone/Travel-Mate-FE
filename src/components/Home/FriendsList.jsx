import React from 'react';
import { Card, ListGroup } from 'react-bootstrap';

function FriendsList() {
  return (
    <Card className="mb-3">
      <Card.Body>
        <h5>Friends</h5>
        <ListGroup>
          <ListGroup.Item>Friend 1</ListGroup.Item>
          <ListGroup.Item>Friend 2</ListGroup.Item>
        </ListGroup>
      </Card.Body>
    </Card>
  );
}

export default FriendsList;
