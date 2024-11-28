import React from 'react'
import axios from 'axios';
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import Row from 'react-bootstrap/Row';
import Tab from 'react-bootstrap/Tab';
import { Container } from 'react-bootstrap';
import SettingAccount from './SettingAccount';
import SettingNotification from './SettingNotification';
import SettingRegisterMember from './SettingRegisterMember';
function Setting() {
  

  return (
    <Container>
      <Tab.Container id="left-tabs-example" defaultActiveKey="first">
        <Row>
          <Col sm={3}>
            <Nav variant="pills" className="flex-column">
              <Nav.Item>
                <Nav.Link eventKey="first">Tài khoản</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="second">Thông báo</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="third">Đăng kí thành viên</Nav.Link>
              </Nav.Item>
            </Nav>
          </Col>
          <Col sm={9}>
            <Tab.Content>
              <Tab.Pane eventKey="first">
                <SettingAccount />
              </Tab.Pane>
              <Tab.Pane eventKey="second">
                <SettingNotification />
              </Tab.Pane>
              <Tab.Pane eventKey="third">
                <SettingRegisterMember />
              </Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    
    </Container>
  );
}

export default Setting