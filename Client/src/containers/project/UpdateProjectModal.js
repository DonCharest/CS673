import React, { Component } from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  Form,
  FormGroup,
  Label,
  Input
} from "reactstrap";
import { connect } from "react-redux";
import { addProject, getProjects } from "../../actions/projectActions";
import { getUsers } from "../../actions/userActions";
import PropTypes from "prop-types";

class UpdateProjectModal extends Component {
  state = {
    modal: false,
    name: "",
    shortCode: "",
    effortUnit: "",
    description: "",
    projectMemebers: [],
    userID: "",
    epics: [],
    epic: ""
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

  //   onChangeMembers = e => {
  //     let value = Array.from(e.target.selectedOptions, option => option.value);

  //     this.setState({
  //       [e.target.name]: value
  //     });
  //   };

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onSubmit = e => {
    e.preventDefault();

    const { user } = this.props.auth;

    const newProject = {
      name: this.state.name,
      shortCode: this.state.shortCode,
      effortUnit: this.state.effortUnit,
      description: this.state.description,
      projectMembers: [{ userID: this.state.userID }, { userID: user._id }]
    };

    // Add Project via addProject action
    this.props.addProject(newProject);

    // Close modal
    this.toggle();

    // Refresh project page
    setTimeout(() => {
      this.props.getProjects();
    }, 500);
  };

  render() {
    const { users } = this.props.user;

    const effortUnits = [
      {
        id: "0",
        value: "Select Effort Units",
        label: "Select Effort Units"
      },
      {
        id: "1",
        value: "points",
        label: "points"
      },
      {
        id: "2",
        value: "hours",
        label: "hours"
      }
    ];

    return (
      <div>
        {this.props.isAuthenticated ? (
          <Button
            color="dark"
            style={{ marginBottom: "2rem" }}
            onClick={this.toggle}
          >
            New Project
          </Button>
        ) : (
          <h4 className="mb-3 ml-4">Please log in to manage projects </h4>
        )}

        <Modal isOpen={this.state.modal} toggle={this.toggle}>
          <ModalHeader toggle={this.toggle}>Create a New Project</ModalHeader>
          <ModalBody>
            <Form onSubmit={this.onSubmit}>
              <FormGroup>
                <Label for="name">Project Name:</Label>
                <Input
                  type="text"
                  name="name"
                  id="name"
                  placeholder="e.g. 'TracKing"
                  onChange={this.onChange}
                />
                <Label for="shortCode">Short Code:</Label>
                <Input
                  type="text"
                  name="shortCode"
                  id="shortCode"
                  placeholder="e.g. 'TRKG'"
                  maxLength="4"
                  onChange={this.onChange}
                />
                <Label for="effortUnit">Effort Units:</Label>
                <Input
                  type="select"
                  name="effortUnit"
                  id="effortUnit"
                  onChange={this.onChange}
                >
                  >
                  {effortUnits.map(effortUnit => (
                    <option key={effortUnit.id} value={effortUnit.value}>
                      {effortUnit.label}
                    </option>
                  ))}
                </Input>
                <Label for="description">Description:</Label>
                <Input
                  type="textarea"
                  name="description"
                  id="description"
                  placeholder="e.g. 'Create an Agile project management software application'"
                  onChange={this.onChange}
                />
                <Label for="userID">Select Project Members:</Label>
                <Input
                  type="select"
                  //multiple
                  name="userID"
                  id="userID"
                  onChange={this.onChange}
                  //onChange={this.onChangeMembers}
                >
                  >
                  {users.map(({ _id, email }) => (
                    <option key={_id} value={_id}>
                      {email}
                    </option>
                  ))}
                </Input>
                <Button color="dark" style={{ marginTop: "2rem" }} block>
                  New Project
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
  { addProject, getUsers, getProjects }
)(UpdateProjectModal);
