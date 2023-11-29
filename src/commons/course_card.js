import React from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

function CourseCard(props) {
  return (
    <Card style={{ width: '18rem', margin: '1rem' }}>
      <Card.Body>
        <Card.Title>{props.title}</Card.Title>
        <Card.Text>
          {props.description}
        </Card.Text>
        <Button variant="primary">{props.primaryButton}</Button>
      </Card.Body>
      <Card.Footer className="text-muted">{props.deadline}</Card.Footer>
    </Card>
  );
}

export default CourseCard;
