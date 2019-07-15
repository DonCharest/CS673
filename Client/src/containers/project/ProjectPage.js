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
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Input
} from "reactstrap";
import {
  updateProject,
  getProjects,
  deleteProject,
  viewProject
} from "../../actions/projectActions";
import NewProjectModal from "./NewProjectModal";
import { effortUnits } from "./effortUnits";
import * as classes from "../../app.css";
import PropTypes from "prop-types";
import axios from "axios";
import { tokenConfig } from "../../actions/authActions";
// import { getUsers } from "../../actions/userActions";
// import UpdateProjectModal from "./UpdateProjectModal";

class ProjectPage extends Component {
  static propTypes = {
    getProjects: PropTypes.func.isRequired,
    project: PropTypes.object.isRequired,
    isAuthenticated: PropTypes.bool,
    user: PropTypes.object.isRequired
    // getUsers: PropTypes.func.isRequired,
    // auth: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      _id: "",
      name: "",
      shortCode: "",
      effortUnit: "",
      description: "",
      projectMembers: [],
      userID: ""
    };

    // this.handleChange = this.onViewClick.bind(this);
    //this.handleSubmit = this.handleSubmit.bind(this);
    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal
    }));
  }

  componentDidMount() {
    this.props.getProjects();
    // this.props.getUsers();
    // this.getProjectById(this.props._id);
  }

  getProjectById(id) {
    axios.get(`/api/projects/${id}`).then(res => {
      const project = res.data;

      this.setState({
        _id: project._id,
        name: project.name,
        shortCode: project.shortCode,
        effortUnit: project.effortUnit,
        description: project.description,
        projectMembers: project.projectMembers
      });
    });
  }

  onDeleteClick = id => {
    if (window.confirm("This project will be permanently deleted!")) {
      this.props.deleteProject(id);
    }
  };

  onViewClick = id => {
    // this.props.viewProject(id);
    this.getProjectById(id);

    setTimeout(() => {
      this.toggle();
    }, 500);
  };

  //  Update values ************************
  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onSubmit = e => {
    e.preventDefault();

    const updatedProject = {
      _id: this.state._id,
      name: this.state.name,
      shortCode: this.state.shortCode,
      effortUnit: this.state.effortUnit,
      description: this.state.description
      // projectMembers: [{ userID: this.state.userID }]
    };

    // Add Project via addProject action
    this.props.updateProject(updatedProject);

    // Close modal
    this.toggle();

    // Refresh project page
    setTimeout(() => {
      this.props.getProjects();
    }, 500);
  };
  // End Update Values **********************

  render() {
    const { projects } = this.props.project;
    const { users } = this.props.user;

    return (
      <Container>
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
                      // outline
                      color="danger"
                      size="sm"
                      style={{ marginRight: "5px" }}
                      onClick={this.onDeleteClick.bind(this, _id)}
                    >
                      Delete
                    </Button>
                    <Button
                      className="float-right"
                      // outline
                      color="primary"
                      size="sm"
                      style={{ marginRight: "5px" }}
                      onClick={this.onViewClick.bind(this, _id)}
                    >
                      Details
                    </Button>
                  </ListGroupItem>
                </CSSTransition>
              ))}
            </TransitionGroup>
          </ListGroup>
          {/* ******************************************** */}

          <Modal
            isOpen={this.state.modal}
            toggle={this.toggle}
            className={this.props.className}
          >
            <ModalHeader toggle={this.toggle}>Project Details</ModalHeader>
            <ModalBody>
              <Form onSubmit={this.onSubmit}>
                <FormGroup>
                  <Label for="name">Project Name:</Label>
                  <Input
                    type="text"
                    name="name"
                    id="name"
                    defaultValue={this.state.name}
                    onChange={this.onChange}
                  />
                  <Label for="shortCode">Short Code:</Label>
                  <Input
                    type="text"
                    name="shortCode"
                    id="shortCode"
                    maxLength="4"
                    defaultValue={this.state.shortCode}
                    // onChange={this.onChange}
                  />
                  {/* <Label for="effortUnit">Effort Units:</Label>
                  <Input
                    type="select"
                    name="effortUnit"
                    id="effortUnit"
                    defaultValue={this.state.effortUnit}
                    onChange={this.onChange}
                  >
                    >
                    {effortUnits.map(effortUnit => (
                      <option key={effortUnit.id} value={effortUnit.value}>
                        {effortUnit.label}
                      </option>
                    ))}
                  </Input> */}
                  <Label for="description">Description:</Label>
                  <Input
                    type="textarea"
                    name="description"
                    id="description"
                    defaultValue={this.state.description}
                    onChange={this.onChange}
                  />
                  {/* <Label for="userID">Select Project Members:</Label>
                  <Input
                    type="select"
                    multiple
                    name="userID"
                    id="userID"
                    defaultValue={this.state.projectMembers}
                    onChange={this.onChange}
                  >
                    >
                    {users.map(({ _id, email }) => (
                      <option key={_id} value={_id}>
                        {email}
                      </option>
                    ))}
                  </Input> */}
                  <Button color="dark" style={{ marginTop: "2rem" }} block>
                    Update Project Details
                  </Button>
                </FormGroup>
              </Form>
            </ModalBody>
            <ModalFooter>
              <Button color="primary">Project Members</Button>
              <Button color="primary">Project Epics</Button>
            </ModalFooter>
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
  // auth: state.auth,
});

export default connect(
  mapStateToProps,
  { getProjects, deleteProject, viewProject, updateProject }
)(ProjectPage);
