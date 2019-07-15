import React, { Component } from "react";
import {
  Container,
  ListGroup,
  ListGroupItem,
  Button,
  Badge,
  Label,
  Form,
  FormGroup,
  Input
} from "reactstrap";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { connect } from "react-redux";
import {
  getUsers,
  viewUser,
  updateUser,
  deleteUser
} from "../../actions/userActions";
import PropTypes from "prop-types";
import * as classes from "../../app.css";

class AdminPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedUserRole: ""
    };
  }

  static propTypes = {
    getUsers: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
    isAuthenticated: PropTypes.bool
  };

  componentDidMount() {
    this.props.getUsers();
  }

  onUpdateUserClick = id => {
    const data = {
      role: this.state.selectedUserRole
    };

    // send updated role & user ID to Actions
    this.props.updateUser(id, data);
    // refresh user to see role change
    this.props.getUsers();
  };

  onDeleteUserClick = id => {
    if (window.confirm("This project will be permanently deleted!")) {
      this.props.deleteUser(id);
    }
  };

  render() {
    const { users } = this.props.user;
    const userRoles = [
      {
        id: "0",
        value: "user",
        label: "Select Role"
      },
      {
        id: "1",
        value: "user",
        label: "User"
      },
      {
        id: "2",
        value: "project",
        label: "Project"
      },
      {
        id: "3",
        value: "admin",
        label: "Admin"
      }
    ];

    return (
      <Container>
        <div>
          <h1>Admin</h1>
          <hr />
        </div>
        <ListGroup>
          <h6>
            <b>&nbsp;&nbsp;&nbsp;User Management:</b>
          </h6>
          <TransitionGroup className={classes.userList}>
            {users.map(({ _id, email, role, option }) => (
              <CSSTransition key={_id} timeout={500} classNames={classes.fade}>
                <ListGroupItem className={classes.listGroupItem} color="light">
                  <h6>
                    <strong>{email + "\u00A0\u00A0\u00A0\u00A0"}</strong>
                    <Badge pill color="dark">
                      {role}{" "}
                    </Badge>
                  </h6>
                  <br />
                  <Form onSubmit={this.onSubmit}>
                    <FormGroup>
                      <Label for="userRole">Change User Role:</Label>
                      <Input
                        type="select"
                        name="userRole"
                        id="userRole"
                        // multiple
                        onChange={e =>
                          this.setState({ selectedUserRole: e.target.value })
                        }
                      >
                        >
                        {userRoles.map(userRole => (
                          <option key={userRole.id} value={userRole.value}>
                            {userRole.label}
                          </option>
                        ))}
                      </Input>
                    </FormGroup>
                    <Button
                      className={classes.viewBtn}
                      color="primary"
                      size="sm"
                      onClick={this.onUpdateUserClick.bind(this, _id, option)}
                    >
                      Update
                    </Button>

                    <Button
                      className={classes.deleteBtn}
                      color="danger"
                      size="sm"
                      onClick={this.onDeleteUserClick.bind(this, _id, option)}
                    >
                      Delete
                    </Button>
                  </Form>
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
  { getUsers, viewUser, updateUser, deleteUser }
)(AdminPage);
