import React, { Component } from "react";
import {
  Container,
  ListGroup,
  ListGroupItem,
  Button,
  Badge,
  pill
} from "reactstrap";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { connect } from "react-redux";
import { getUsers, deleteUser } from "../../actions/userActions";
import PropTypes from "prop-types";
import UserModel from "../admin/UserModal";

class AdminPage extends Component {
  static propTypes = {
    getUsers: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
    isAuthenticated: PropTypes.bool
  };

  componentDidMount() {
    this.props.getUsers();
  }

  onDeleteClick = id => {
    this.props.deleteUser(id);
  };

  render() {
    const { users } = this.props.user;
    return (
      <Container>
        <div>
          <h1>Admin</h1>
          <hr />
        </div>
        <UserModel />
        <ListGroup>
          <h6>
            <b>&nbsp;&nbsp;&nbsp;User Management</b>
          </h6>
          <TransitionGroup className="userList">
            {users.map(({ _id, email, role }) => (
              <CSSTransition key={_id} timeout={500} classNames="fade">
                <ListGroupItem className="justify-content-between" width="25px">
                  {this.props.isAuthenticated ? (
                    <Button
                      className="remove-btn"
                      color="warning"
                      size="sm"
                      onClick={this.onDeleteClick.bind(this, _id)}
                    >
                      Details
                    </Button>
                  ) : null}
                  {email + "\u00A0\u00A0\u00A0\u00A0"}
                  <Badge pill>{role}</Badge>
                </ListGroupItem>
              </CSSTransition>
            ))}
          </TransitionGroup>
        </ListGroup>
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user,
  isAuthenticated: state.auth.isAuthenticated
});

export default connect(
  mapStateToProps,
  { getUsers, deleteUser }
)(AdminPage);
