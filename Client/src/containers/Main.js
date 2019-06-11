import React, {Component} from 'react';
import {Navbar, Nav, Container} from 'react-bootstrap';
import { Route, Link, Redirect }from 'react-router-dom';
import SprintPage from './sprint/SprintPage'
import BacklogPage from './backlog/BacklogPage'
import AdminPage from './admin/AdminPage'
import ChatPage from './chat/ChatPage'

class Main extends Component {

  render() {


  return (
    <div>
      <Container>
        <Navbar bg="light" expand="lg">
          <Navbar.Brand><Link to="/">TracKing</Link></Navbar.Brand>
          <Nav className="mr-auto">
            <Nav.Item><Link to="/sprint">Sprint</Link></Nav.Item>
            <Nav.Item><Link to="/backlog">Backlog</Link></Nav.Item>
            <Nav.Item><Link to="/admin">Administration</Link></Nav.Item>
            <Nav.Item><Link to="/chat">Chat</Link></Nav.Item>
          </Nav>
        </Navbar>

        <div>
          <Route path="/sprint" exact component={SprintPage} />
          <Route path="/backlog" exact component={BacklogPage} />
          <Route path="/admin" exact component={AdminPage} />
          <Route path="/chat" exact component={ChatPage} />
          <Redirect to="/sprint" />
        </div>
      </Container>

    </div>
  )
  }
}

export default Main;