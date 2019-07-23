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
import ErrorModal from "../components/ErrorModal";

class Main extends Component {
  static propTypes = {
    auth: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      isOpen: false
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
      if (user.role == undefined) {
        window.location.reload();
      }
      if (user.role == "admin") {
        adminLink = (
          <Link className="nav-link" to="/Admin">
            Admin
          </Link>
        );
      }
    }

    var projectLink;
    if (user) {
      if (user.role == "project") {
        projectLink = (
          <Link className="nav-link" to="/Project">
            &#128188;Project
          </Link>
        );
      }
    }

    const authLinks = (
      <Fragment>
        {adminLink}
        {projectLink}
        <Link className="nav-link" to="/BackLog">
          &#128220;Backlog
        </Link>
        <Link className="nav-link" to="/Sprint">
          &#127939;Sprint
        </Link>
        <Link className="nav-link" to="/Chat">
          &#128172;Chat
        </Link>

        <NavItem>
          <span className="navbar-text ml-5 mr-3">
            <strong>{user ? `\u{1F64B} ${user.name}` : ""}</strong>
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
      <Container className={classes.container}>
        <ErrorModal />
        <div className={classes.navbarNavbar}>
          <Navbar
            className={classes.navbarCustom}
            color="dark"
            dark
            expand="sm"
          >
            {/* <Navbar color="dark" dark expand="sm" className="mb-0"> */}
            <Link id="navbar-brand" className={classes.navbarBrand} to="/">
              &#9812;TracKing
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
