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
import ProjectPage from "./project/ProjectPage";
import * as classes from "../app.css";

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
        <Link className="nav-link" to="/Project">
          Project
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
            <Link id="navbar-brand" className={classes.navbarBrand} to="/">
              TracKing
            </Link>
            <NavbarToggler onClick={this.toggle} />
            <Collapse isOpen={this.state.isOpen} navbar>
              <Nav className="ml-auto" navbar>
                {isAuthenticated ? authLinks : guestLinks}
              </Nav>
            </Collapse>
          </Navbar>

          <div id="main" className={classes.main}>
            <Route
              path="/sprint"
              exact
              component={isAuthenticated ? SprintPage : LoginPage}
            />
            <Route
              path="/backlog"
              exact
              component={isAuthenticated ? BacklogPage : LoginPage}
            />
            <Route
              path="/admin"
              exact
              component={isAuthenticated ? AdminPage : LoginPage}
            />
            <Route
              path="/chat"
              exact
              component={isAuthenticated ? ChatPage : LoginPage}
            />
            <Route
              path="/login"
              exact
              component={isAuthenticated ? SprintPage : LoginPage}
            />
            <Route
              path="/project"
              exact
              component={isAuthenticated ? ProjectPage : LoginPage}
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
