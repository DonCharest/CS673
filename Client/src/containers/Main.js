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
import { bindActionCreators } from "redux";
import PropTypes from "prop-types";
import * as actions from "../actions/authActions";
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
  static propTypes = {
    auth: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      isOpen: false,
      role: ""
    };
  }

  componentDidMount() {
    this.props.actions.loadUser();
  }

  toggle = () => {
    this.setState({
      isOpen: !this.state.isOpen
    });
  };

  render() {
    const { isAuthenticated, user } = this.props.auth;

    var adminLink;
    if (user) {
      console.log("AL - " + user.role);
      if (user.role == "admin") {
        console.log("AL - true");
        adminLink = (
          <Link className="nav-link" to="/Admin">
            Admin
          </Link>
        );
      } else {
        console.log("AL - false");
      }
    } else {
      console.log("AL - User not found");
    }

    var projectLink;
    if (user) {
      console.log("PL - " + user.role);
      if (user.role == "project") {
        console.log("PL - true");
        projectLink = (
          <Link className="nav-link" to="/Project">
            Project
          </Link>
        );
      } else {
        console.log("PL - false");
      }
    } else {
      console.log("PL - User not found");
    }

    const authLinks = (
      <Fragment>
        {adminLink}
        {projectLink}
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

const mapDispatchToProps = dispatch => {
  return {
    actions: bindActionCreators({ ...actions }, dispatch)
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Main);
