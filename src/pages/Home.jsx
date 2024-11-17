import React from 'react';
import { Container, Row, Col, Card, ProgressBar } from 'react-bootstrap';
import ToolBar from '../components/Shared/ToolBar';
import AnswerQuestion from '../components/Profile/FormBuilder/AnswerQuestion';
import AutoSuggestInput from '../components/Shared/AutoSuggestInput';

function Home() {
  return (
    <div>
      <ToolBar />
      <Container fluid className='mt-4' style={{
        padding: '0 85px'
      }}>
        <Row>
          {/* Left Sidebar */}
          <Col md={2} className="">
            sidebar
          </Col>
          {/* Main Content */}
          <Col md={8}>
            <AnswerQuestion/>
            <AutoSuggestInput/>
          </Col>
          {/* Right Sidebar */}
          <Col md={2}>
            right
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Home;
