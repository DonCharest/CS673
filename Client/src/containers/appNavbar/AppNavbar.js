import React, { Component, Fragment } from "react";
import { BrowserRouter as Router, Link, Route } from "react-router-dom";
import { Collapse, Navbar, NavbarToggler, Nav, NavItem } from "reactstrap";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import RegisterModal from "../auth/RegisterModal";
import LoginModal from "../auth/LoginModal";
import Logout from "../auth/Logout";
import Home from "../home/Home";
import Admin from "../admin/Admin";
import BackLog from "../backlog/BackLog";
import Sprint from "../sprint/Sprint";
import Chat from "../chat/Chat";

class AppNavbar extends Component {
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
        {/* <NavItem> */}
        {/* <RegisterModal /> */}
        {/* </NavItem> */}
        <NavItem>
          <LoginModal />
        </NavItem>
      </Fragment>
    );

    return (
      <Router>
        <div>
          <Navbar color="dark" dark expand="sm" className="mb-0">
            <Link className="navbar-brand" to="/">
              TracKing
            </Link>
            <NavbarToggler onClick={this.toggle} />
            <Collapse isOpen={this.state.isOpen} navbar>
              <Nav className="ml-auto" navbar>
                {isAuthenticated ? authLinks : guestLinks}
              </Nav>
            </Collapse>
          </Navbar>

          <div className="main">
            <Route exact path="/" component={Home} />

            <Route
              exact
              path="/Admin"
              component={isAuthenticated ? Admin : Admin}
              // need to set conditional back to home once admin register new user worked out
            />
            <Route
              exact
              path="/BackLog"
              component={isAuthenticated ? BackLog : Home}
            />
            <Route
              exact
              path="/Sprint"
              component={isAuthenticated ? Sprint : Home}
            />
            <Route
              exact
              path="/Chat"
              component={isAuthenticated ? Chat : Home}
            />
          </div>
        </div>
      </Router>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  null
)(AppNavbar);
