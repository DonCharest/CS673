import React, { Component } from "react";
import { connect } from "react-redux";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import {
  Container,
  ListGroup,
  ListGroupItem,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  Form,
  FormGroup,
  Label,
  Input
} from "reactstrap";
import {
  updateProject,
  getProjects,
  deleteProject,
  viewProject,
  addProjectMembers
} from "../../actions/projectActions";
import NewProjectModal from "./NewProjectModal";
import * as classes from "../../app.css";
import PropTypes from "prop-types";
import axios from "axios";

class ProjectPage extends Component {
  static propTypes = {
    getProjects: PropTypes.func.isRequired,
    project: PropTypes.object.isRequired,
    isAuthenticated: PropTypes.bool,
    user: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      modalDetails: false,
      modalMembers: false,
      _id: "",
      name: "",
      shortCode: "",
      description: "",
      projectMembers: [],
      userID: ""
    };

    this.toggleDetails = this.toggleDetails.bind(this);
    this.toggleMembers = this.toggleMembers.bind(this);
  }

  componentDidMount() {
    this.props.getProjects();
  }

  getProjectById(id) {
    axios.get(`/api/projects/${id}`).then(res => {
      const project = res.data;

      this.setState({
        _id: project._id,
        name: project.name,
        shortCode: project.shortCode,
        description: project.description,
        projectMembers: project.projectMembers,
        userID: project.userID
      });
    });
  }

  // ****** Delete a Project ******
  onDeleteClick = id => {
    if (window.confirm("This project will be permanently deleted!")) {
      this.props.deleteProject(id);
    }
  };

  // ****** Project Details ( View & Update ) ******
  toggleDetails() {
    this.setState(prevState => ({
      modalDetails: !prevState.modalDetails
    }));
  }

  onDetailsClick = id => {
    this.getProjectById(id);

    setTimeout(() => {
      this.toggleDetails();
    }, 500);
  };

  onChangeDetails = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onSubmitDetails = e => {
    e.preventDefault();

    const updatedProject = {
      _id: this.state._id,
      name: this.state.name,
      shortCode: this.state.shortCode,
      effortUnit: this.state.effortUnit,
      description: this.state.description
    };

    // Update Project Details via updateProject action
    this.props.updateProject(updatedProject);

    // Close details modal
    this.toggleDetails();

    // Refresh project page
    setTimeout(() => {
      this.props.getProjects();
    }, 500);
  };

  // ****** ADD Project Members ******
  toggleMembers() {
    this.setState(prevState => ({
      modalMembers: !prevState.modalMembers
    }));
  }

  onAddMembersClick = id => {
    this.getProjectById(id);

    setTimeout(() => {
      this.toggleMembers();
    }, 500);
  };

  onChangeMembers = e => {
    let value = Array.from(e.target.selectedOptions, option => option.value);

    this.setState({
      [e.target.name]: value
    });
  };

  onSubmitProjectMembers = e => {
    e.preventDefault();

    const newProjectMembers = {
      projectID: this.state._id,
      projectMembers: [{ userID: this.state.userID }]
    };

    // Add Project Members via addProjectMembers action
    this.props.addProjectMembers(newProjectMembers);

    // Close modal
    this.toggleMembers();

    // Refresh project page
    setTimeout(() => {
      this.props.getProjects();
    }, 500);
  };

  render() {
    const { projects } = this.props.project;
    const { users } = this.props.user;

    return (
      <Container>
        {/* Main Project Page */}
        <div>
          <h1>Project</h1>
          <hr />
          <NewProjectModal />
        </div>
        <div>
          <ListGroup>
            <h6>
              <b>&nbsp;&nbsp;&nbsp;Project Management:</b>
            </h6>
            <TransitionGroup className="project-list">
              {projects.map(({ _id, name }) => (
                <CSSTransition key={_id} timeout={500} classNames="fade">
                  <ListGroupItem className={classes.listGroupItem}>
                    {<strong>{name}</strong>}
                    <Button
                      className="float-right"
                      color="danger"
                      size="sm"
                      style={{ marginRight: "5px" }}
                      onClick={this.onDeleteClick.bind(this, _id)}
                    >
                      Delete
                    </Button>
                    <Button
                      className="float-right"
                      color="secondary"
                      size="sm"
                      style={{ marginRight: "5px" }}
                      onClick={this.onAddMembersClick.bind(this, _id)}
                    >
                      Add Members
                    </Button>
                    <Button
                      className="float-right"
                      color="info"
                      size="sm"
                      style={{ marginRight: "5px" }}
                      onClick={this.onDetailsClick.bind(this, _id)}
                    >
                      Details
                    </Button>
                  </ListGroupItem>
                </CSSTransition>
              ))}
            </TransitionGroup>
          </ListGroup>

          {/* Details Modal */}
          <Modal
            isOpen={this.state.modalDetails}
            toggle={this.toggleDetails}
            className={this.props.className}
          >
            <ModalHeader toggle={this.toggleDetails}>
              Project Details
            </ModalHeader>
            <ModalBody>
              <Form onSubmit={this.onSubmitDetails}>
                <FormGroup>
                  <Label for="name">Project Name:</Label>
                  <Input
                    type="text"
                    name="name"
                    id="name"
                    defaultValue={this.state.name}
                    onChange={this.onChangeDetails}
                  />
                  <Label for="shortCode">Short Code:</Label>
                  <Input
                    readOnly
                    type="text"
                    name="shortCode"
                    id="shortCode"
                    maxLength="4"
                    defaultValue={this.state.shortCode}
                  />
                  <Label for="description">Description:</Label>
                  <Input
                    type="textarea"
                    name="description"
                    id="description"
                    defaultValue={this.state.description}
                    onChange={this.onChangeDetails}
                  />
                  {/* I would like to list all current project members here */}
                  <Label for="members">Project Members:</Label>
                  <Input
                    readOnly
                    type="textarea"
                    name="members"
                    id="members"
                    value={JSON.stringify(this.state.projectMembers, [
                      "userID"
                    ])}
                  />

                  <Button color="dark" style={{ marginTop: "2rem" }} block>
                    Update Project Details
                  </Button>
                </FormGroup>
              </Form>
            </ModalBody>
          </Modal>

          {/* Add Members Modal */}
          <Modal
            isOpen={this.state.modalMembers}
            toggle={this.toggleMembers}
            className={this.props.className}
          >
            <ModalHeader toggle={this.toggleMembers}>
              Add Project Members
            </ModalHeader>
            <ModalBody>
              <Form onSubmit={this.onSubmitProjectMembers}>
                <FormGroup>
                  <Label for="userID">Select Project Members:</Label>
                  <Input
                    type="select"
                    multiple
                    name="userID"
                    id="userID"
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
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  project: state.project,
  user: state.user,
  isAuthenticated: state.auth.isAuthenticated
});

export default connect(
  mapStateToProps,
  { getProjects, deleteProject, viewProject, updateProject, addProjectMembers }
)(ProjectPage);
