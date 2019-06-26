import React, { Component, Fragment } from "react";
import { Route, Link, Redirect } from "react-router-dom";
import {
  Container,
  Collapse,
  Navbar,
  NavbarToggler,
  Nav,
  NavItem
} from "reactstrap";
// import { Navbar, Nav, Container } from "react-bootstrap";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import RegisterModal from "./auth/RegisterModal";
import LoginModal from "./auth/LoginModal";
import Logout from "./auth/Logout";
import SprintPage from "./sprint/SprintPage";
import BacklogPage from "./backlog/BacklogPage";
import AdminPage from "./admin/AdminPage";
import ChatPage from "./chat/ChatPage";
import LoginPage from "./login/LoginPage";
//import * as classes from "../app.css";

class Main extends Component {
  state = {
    isOpen: false
  };

  static propTypes = {
    auth: PropTypes.object.isRequired
  };

  toggle = () => {
    this.setState({
      isOpen: !this.state.isOpen
    });
  };

  render() {
    const { isAuthenticated, user } = this.props.auth;

    const authLinks = (
      <Fragment>
        <Link className="nav-link" to="/Admin">
          Admin
        </Link>
        <Link className="nav-link" to="/BackLog">
          Backlog
        </Link>
        <Link className="nav-link" to="/Sprint">
          Sprint
        </Link>
        <Link className="nav-link" to="/Chat">
          Chat
        </Link>

        <NavItem>
          <span className="navbar-text ml-5 mr-3">
            <strong>{user ? `Welcome ${user.name}` : ""}</strong>
          </span>
        </NavItem>
        <NavItem>
          <Logout />
        </NavItem>
      </Fragment>
    );

    const guestLinks = (
      <Fragment>
        <NavItem>
          <RegisterModal />
        </NavItem>
        <NavItem>
          <LoginModal />
        </NavItem>
      </Fragment>
    );

    return (
      <Container>
        <div>
          <Navbar color="dark" dark expand="sm" className="mb-0">
            <Link id="navbar-brand" className="navbar-brand" to="/">
              TracKing
            </Link>
            <NavbarToggler onClick={this.toggle} />
            <Collapse isOpen={this.state.isOpen} navbar>
              <Nav className="ml-auto" navbar>
                {isAuthenticated ? authLinks : guestLinks}
                {/****** Force auth links to be visible until back-end connected ******/}
                {/* {isAuthenticated ? guestLinks : authLinks} */}
              </Nav>
            </Collapse>
          </Navbar>

          {/* <div className="{styles.main}"> */}
          <div id="main" className="main">
            <Route
              path="/sprint"
              exact
              component={SprintPage ? SprintPage : LoginPage}
            />
            <Route
              path="/backlog"
              exact
              component={BacklogPage ? BacklogPage : LoginPage}
            />
            <Route
              path="/admin"
              exact
              component={AdminPage ? AdminPage : LoginPage}
            />
            <Route
              path="/chat"
              exact
              component={ChatPage ? ChatPage : LoginPage}
            />
            <Route
              path="/login"
              exact
              component={LoginPage ? LoginPage : LoginPage}
            />
            <Route path="/" exact component={LoginPage} />
            <Redirect to="/sprint" />
          </div>
        </div>
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  null
)(Main);

/*
class Main extends Component {
  render() {
    return (
      <div>
        <Container>
          <Navbar bg="dark" expand="lg">
            <Navbar.Brand>
              <Link to="/">TracKing</Link>
            </Navbar.Brand>
            <Nav className="mr-auto">
              <Nav.Item>
                <Link to="/sprint">Sprint</Link>
              </Nav.Item>
              <Nav.Item>
                <Link to="/backlog">Backlog</Link>
              </Nav.Item>
              <Nav.Item>
                <Link to="/admin">Administration</Link>
              </Nav.Item>
              <Nav.Item>
                <Link to="/chat">Chat</Link>
              </Nav.Item>
            </Nav>
          </Navbar>

          <div>
            <Route path="/sprint" exact component={SprintPage} />
            <Route path="/backlog" exact component={BacklogPage} />
            <Route path="/admin" exact component={AdminPage} />
            <Route path="/chat" exact component={ChatPage} />
            <Route path="/login" exact component={LoginPage} />
            <Redirect to="/sprint" />
          </div>
        </Container>
      </div>
    );
  }
}

export default Main;
*/
