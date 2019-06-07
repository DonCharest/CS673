import React, {Component} from 'react';
import {Navbar, Nav} from 'react-bootstrap';
import Sprint from './sprint/Sprint'

class Main extends Component {

  render() {


  return (
    <div>
      <Navbar bg="light" expand="lg">
        <Navbar.Brand href="#home">TracKing</Navbar.Brand>
        <Nav.Link href="#sprint">Sprint</Nav.Link>
        <Nav.Link href="#sprint">Backlog</Nav.Link>
        <Nav.Link href="#sprint">Administration</Nav.Link>
        <Nav.Link href="#sprint">Chat</Nav.Link>
      </Navbar>



      <div>
        <Sprint />
      </div>
    </div>
  )
  }
}

export default Main;