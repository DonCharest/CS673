import React, { Component } from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Input
} from "reactstrap";
import { connect } from "react-redux";
import { addProjectMembers, getProjects } from "../../actions/projectActions";
import { getUsers } from "../../actions/userActions";
import PropTypes from "prop-types";

class ProjectMemberModal extends Component {
  state = {
    modal: false,
    _id: "5d2cfc20c5332941083c25dd",
    projectMemebers: [],
    userID: ""
  };

  static propTypes = {
    isAuthenticated: PropTypes.bool,
    getUsers: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired,
    getProjects: PropTypes.func.isRequired
  };

  componentDidMount() {
    this.props.getUsers();
  }

  toggle = () => {
    this.setState({
      modal: !this.state.modal
    });
  };

  onChangeMembers = e => {
    let value = Array.from(e.target.selectedOptions, option => option.value);

    this.setState({
      [e.target.name]: value
    });
  };

  //   onChange = e => {
  //     this.setState({ [e.target.name]: e.target.value });
  //   };

  onSubmit = e => {
    e.preventDefault();

    const { user } = this.props.auth;

    const newProjectMembers = {
      // projectMembers: [{ userID: this.state.userID }, { userID: user._id }]
      _id: this.state._id,
      projectMembers: [{ userID: this.state.userID }]
    };

    // Add Project via addProject action
    this.props.addProjectMembers(newProjectMembers);

    // Close modal
    this.toggle();

    // Refresh project page
    setTimeout(() => {
      this.props.getProjects();
    }, 500);
  };

  render() {
    const { users } = this.props.user;
    return (
      <div>
        {this.props.isAuthenticated ? (
          <Button
            color="dark"
            style={{ marginBottom: "2rem" }}
            onClick={this.toggle}
          >
            Project Members
          </Button>
        ) : (
          <h4 className="mb-3 ml-4">Please log in to manage projects </h4>
        )}

        <Modal isOpen={this.state.modal} toggle={this.toggle}>
          <ModalHeader toggle={this.toggle}>Add Project Members</ModalHeader>
          <ModalBody>
            <Form onSubmit={this.onSubmit}>
              <FormGroup>
                <Label for="userID">Select Project Members:</Label>
                <Input
                  type="select"
                  multiple
                  name="userID"
                  id="userID"
                  //   onChange={this.onChange}
                  onChange={this.onChangeMembers}
                >
                  >
                  {users.map(({ _id, email }) => (
                    <option key={_id} value={_id}>
                      {email}
                    </option>
                  ))}
                </Input>
                <Button color="dark" style={{ marginTop: "2rem" }} block>
                  Add Members
                </Button>
              </FormGroup>
            </Form>
          </ModalBody>
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user,
  project: state.project,
  isAuthenticated: state.auth.isAuthenticated,
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { addProjectMembers, getUsers, getProjects }
)(ProjectMemberModal);
