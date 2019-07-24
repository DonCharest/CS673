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
import ProjectsDropdown from "../../components/ProjectsDropdown";
import * as classes from "../../app.css";
import PropTypes from "prop-types";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "react-datepicker/dist/react-datepicker-cssmodules.css";

class NewSprintModal extends Component {
  static propTypes = {
    isAuthenticated: PropTypes.bool,
    getUsers: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired,
    getProjects: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      modal: false,
      startDate: "",
      endDate: "",
      capacity: "",
      projectId: []
    };

    this.autoSelectProject = this.autoSelectProject.bind(this);
  }

  componentDidMount() {
    this.autoSelectProject();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.projects.length !== this.props.projects.length) {
      this.autoSelectProject();
    }
  }

  autoSelectProject() {
    if (this.props.projects.length > 0) {
      this.onChange({
        target: { name: "projectId", value: this.props.projects[0]._id }
      });
    }
  }

  toggle = () => {
    this.setState({
      modal: !this.state.modal
    });
  };

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onSubmit = e => {
    e.preventDefault();

    const { user } = this.props.auth;

    const newProject = {
      name: this.state.name,
      shortCode: this.state.shortCode,
      description: this.state.description,
      projectMembers: [{ userID: user._id }]
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
    return (
      <div>
        {this.props.isAuthenticated ? (
          <Button
            color="dark"
            style={{ marginBottom: "2rem" }}
            onClick={this.toggle}
          >
            New Sprint
          </Button>
        ) : (
          <h4 className="mb-3 ml-4">Please log in to manage projects </h4>
        )}

        <Modal isOpen={this.state.modal} toggle={this.toggle}>
          <ModalHeader toggle={this.toggle}>Create a New Sprint</ModalHeader>
          <ModalBody>
            <Form onSubmit={this.onSubmit}>
              <FormGroup>
                <Label for="startDate">Start Date:</Label>
                <DatePicker
                  type="dateTime"
                  name="startDate"
                  id="startDate"
                  style={{ marginBottom: "20px" }}
                  onChange={this.onChange}
                />

                <Label for="endDate">End Date:</Label>
                <DatePicker
                  type="dateTime"
                  name="endDate"
                  id="endDate"
                  style={{ marginBottom: "20px" }}
                  onChange={this.onChange}
                />
                <Label for="capacity">Capacity:</Label>
                <Input
                  type="number"
                  name="capacity"
                  id="capacity"
                  min="1"
                  max="100"
                  placeholder="e.g. '1, 3, 5'"
                  onChange={this.onChange}
                />

                <ProjectsDropdown
                  value={this.state.projectId}
                  name="projectId"
                  onChange={this.onChange}
                  dropdownId="projectsDropdownNewSprint"
                />

                <Button color="dark" style={{ marginTop: "2rem" }} block>
                  New Sprint
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
  projects: state.project.projects,
  user: state.user,
  project: state.project,
  isAuthenticated: state.auth.isAuthenticated,
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { addProject, getUsers, getProjects }
)(NewSprintModal);
