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
  viewProject,
  addProjectMembers,
  addEpics,
  deleteEpic,
  deleteMember,
  startSprint
} from "../../actions/projectActions";
import NewProjectModal from "./NewProjectModal";
import * as classes from "../../app.css";
import PropTypes from "prop-types";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "react-datepicker/dist/react-datepicker-cssmodules.css";

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
      modalEpics: false,
      modalSprint: false,

      _id: "",
      name: "",
      shortCode: "",
      description: "",
      projectMembers: [],
      userID: "",
      epics: [],
      epicName: "",

      startDate: new Date(),
      endDate: new Date(),
      capacity: "",
      uom: ""
    };

    this.toggleDetails = this.toggleDetails.bind(this);
    this.toggleMembers = this.toggleMembers.bind(this);
    this.toggleEpics = this.toggleEpics.bind(this);
    this.toggleSprint = this.toggleSprint.bind(this);
    this.handleChangeStartDate = this.handleChangeStartDate.bind(this);
    this.handleChangeEndDate = this.handleChangeEndDate.bind(this);
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
        userID: project.userID,
        epics: project.epics,
        epicName: project.epicName,
        userEmail: project.userEmail,
        startDate: project.startDate,
        endDate: project.endDate,
        capacity: project.capacity,
        uom: project.uom
      });
    });
  }

  // ****** Delete a Project ******
  onDeleteClick = id => {
    if (window.confirm("This project will be permanently deleted!")) {
      this.props.deleteProject(id);
    }
  };
  // ****** End => Delete a Project ******

  // ****** Delete a Project Member ******
  onDeleteMemberClick = id => {
    if (
      window.confirm(
        "This member will be permanently removed from the project!"
      )
    ) {
      // console.log("_id: " + id);
      let projID = this.state._id;
      this.props.deleteMember(id, projID);
      this.toggleDetails();
    }
  };
  // ****** End => Delete  a Project Member ******

  // ****** Delete an Epic ******
  onDeleteEpicClick = id => {
    if (window.confirm("This epic will be permanently deleted!")) {
      // console.log("epic _id: " + id);
      let projID = this.state._id;
      this.props.deleteEpic(id, projID);
      this.toggleDetails();
    }
  };
  // ****** End => Delete an Epic ******

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
  // ****** End => Project Details ( View & Update ) ******

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
  // ****** End => ADD Project Members ******

  // ****** Add Epics to a Project ******
  toggleEpics() {
    this.setState(prevState => ({
      modalEpics: !prevState.modalEpics
    }));
  }

  onAddEpicsClick = id => {
    this.getProjectById(id);

    setTimeout(() => {
      this.toggleEpics();
    }, 500);
  };

  onChangeEpics = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onSubmitEpics = e => {
    e.preventDefault();

    const epic = {
      projectID: this.state._id,
      epics: this.state.epicName
    };

    // Update Project Details via updateProject action
    this.props.addEpics(epic);

    // Close details modal
    this.toggleEpics();

    // Refresh project page
    setTimeout(() => {
      this.props.getProjects();
    }, 500);
  };
  // ****** End => Add Epics to a Project ******

  // ****** Add Sprint to a Project ******
  toggleSprint() {
    this.setState(prevState => ({
      modalSprint: !prevState.modalSprint
    }));
  }

  onAddSprintClick = id => {
    this.getProjectById(id);

    setTimeout(() => {
      this.toggleSprint();
    }, 500);
  };

  onChangeSprint = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleChangeStartDate(date) {
    this.setState({
      startDate: date
    });
  }

  handleChangeEndDate(date) {
    this.setState({
      endDate: date
    });
  }

  onSubmitSprint = e => {
    e.preventDefault();

    const sprint = {
      projectID: this.state._id,
      startDate: this.state.startDate,
      endDate: this.state.endDate,
      capacity: this.state.capacity,
      uom: this.state.uom
    };

    // Start a Sprint via startSprint action
    this.props.startSprint(sprint);

    // Close details modal
    this.toggleSprint();

    // Refresh project page
    setTimeout(() => {
      this.props.getProjects();
    }, 500);
  };
  // ****** End => Add Sprint to a Project ******

  render() {
    const { projects } = this.props.project;
    const { users } = this.props.user;

    return (
      <Container>
        {/********************** Main Project Page ***********************/}
        <div>
          <h1>Project</h1>
          <hr />
          <div className>
            <NewProjectModal />
          </div>
        </div>
        <div>
          <ListGroup>
            <h6>Projects</h6>
            <TransitionGroup className="project-list">
              {projects.map(({ _id, name }) => (
                <CSSTransition key={_id} timeout={500} classNames="fade">
                  <ListGroupItem className={classes.listGroupItem}>
                    {name}
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
                      style={{
                        marginRight: "5px"
                      }}
                      onClick={this.onAddSprintClick.bind(this, _id)}
                    >
                      &#65291; Sprint
                    </Button>

                    <Button
                      className="float-right"
                      color="secondary"
                      size="sm"
                      style={{
                        marginRight: "5px"
                      }}
                      onClick={this.onAddEpicsClick.bind(this, _id)}
                    >
                      &#65291; Epic
                    </Button>

                    <Button
                      className="float-right"
                      color="secondary"
                      size="sm"
                      style={{
                        marginRight: "5px"
                      }}
                      onClick={this.onAddMembersClick.bind(this, _id)}
                    >
                      &#65291; Members
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

          {/**************** Details Modal ***************/}
          <Modal
            scrollable={true}
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

                  <ListGroup>
                    <Label>Project Members:</Label>
                    <TransitionGroup className="members-list">
                      {this.state.projectMembers.map(({ _id, userEmail }) => (
                        <CSSTransition
                          key={_id}
                          timeout={500}
                          classNames="fade"
                        >
                          <ListGroupItem className={classes.listGroupEpicItem}>
                            {userEmail}
                            <Button
                              className="float-right"
                              color="danger"
                              size="sm"
                              style={{ marginRight: "5px" }}
                              onClick={this.onDeleteMemberClick.bind(this, _id)}
                            >
                              Delete
                            </Button>
                          </ListGroupItem>
                        </CSSTransition>
                      ))}
                    </TransitionGroup>
                  </ListGroup>

                  <ListGroup>
                    <Label>Project Epics:</Label>
                    <TransitionGroup className="epic-list">
                      {this.state.epics.map(({ _id, epicName }) => (
                        <CSSTransition
                          key={_id}
                          timeout={500}
                          classNames="fade"
                        >
                          <ListGroupItem className={classes.listGroupEpicItem}>
                            {epicName}
                            <Button
                              className="float-right"
                              color="danger"
                              size="sm"
                              style={{ marginRight: "5px" }}
                              onClick={this.onDeleteEpicClick.bind(this, _id)}
                            >
                              Delete
                            </Button>
                          </ListGroupItem>
                        </CSSTransition>
                      ))}
                    </TransitionGroup>
                  </ListGroup>

                  <Button
                    className={classes.customButtonDark}
                    color="dark"
                    style={{ marginTop: "2rem" }}
                    block
                  >
                    Update Project Details
                  </Button>
                </FormGroup>
              </Form>
            </ModalBody>
          </Modal>

          {/*************** Add Members Modal *******************/}
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
                  <Button
                    className={classes.customButtonDark}
                    color="dark"
                    style={{ marginTop: "2rem" }}
                    block
                  >
                    Add Members
                  </Button>
                </FormGroup>
              </Form>
            </ModalBody>
          </Modal>

          {/************** Add Epics Modal *************/}
          <Modal
            isOpen={this.state.modalEpics}
            toggle={this.toggleEpics}
            className={this.props.className}
          >
            <ModalHeader toggle={this.toggleEpics}>
              Add Epic to Project
            </ModalHeader>
            <ModalBody>
              <Form onSubmit={this.onSubmitEpics}>
                <FormGroup>
                  <Label for="epicName">Epic Name:</Label>
                  <Input
                    type="text"
                    name="epicName"
                    id="epicName"
                    placeholder="Epic Title"
                    onChange={this.onChangeEpics}
                  />

                  <Button
                    className={classes.customButtonDark}
                    color="dark"
                    style={{ marginTop: "2rem" }}
                    block
                  >
                    Add Epic
                  </Button>
                </FormGroup>
              </Form>
            </ModalBody>
          </Modal>

          {/************ Add Sprint Modal **************/}
          <Modal
            isOpen={this.state.modalSprint}
            toggle={this.toggleSprint}
            className={this.props.className}
          >
            <ModalHeader toggle={this.toggleSprint}>
              Sprint Management
            </ModalHeader>
            <ModalBody>
              {/* <Form onSubmit={this.onSubmitSprint}> */}
              <FormGroup>
                <Label for="startDate">Start Date:</Label>
                <br />
                <DatePicker
                  className="float-right"
                  size="sm"
                  // type="dateTime"
                  name="startDate"
                  id="startDate"
                  selected={this.state.startDate}
                  onChange={this.handleChangeStartDate}
                />
              </FormGroup>
              <FormGroup>
                <Label for="endDate">End Date:</Label>
                <br />
                <DatePicker
                  // type="dateTime"
                  name="endDate"
                  id="endDate"
                  selected={this.state.endDate}
                  onChange={this.handleChangeEndDate} //only when value has changed
                />
              </FormGroup>
              <FormGroup>
                <Label for="capacity">Capacity:</Label>
                <Input
                  type="number"
                  name="capacity"
                  id="capacity"
                  min="1"
                  max="50"
                  placeholder="enter a number '1 - 50'"
                  onChange={this.onChangeSprint}
                />
              </FormGroup>

              <FormGroup>
                <Label>Unit of Mesaure:</Label>
                <Input
                  type="select"
                  name="uom"
                  onChange={this.updateField}
                  value={this.state.uom}
                >
                  <option value="points">points</option>
                  <option value="hours">hours</option>
                </Input>
              </FormGroup>

              {/* </Form> */}
            </ModalBody>

            <ModalFooter>
              <Button
                // className={classes.customButtonDark}
                onClick={this.toggleSprint}
                color="secondary"
                style={{ marginTop: "2rem" }}
                block
              >
                Close
              </Button>

              <Button
                className={classes.customButtonDark}
                onClick={this.onSubmitSprint}
                color="dark"
                style={{ marginTop: "2rem" }}
                block
              >
                Start Sprint
              </Button>

              <Button
                className={classes.customButtonDark}
                color="dark"
                style={{ marginTop: "2rem" }}
                block
              >
                Edit Spint
              </Button>

              <Button
                // className={classes.customButtonDark}
                color="danger"
                style={{ marginTop: "2rem" }}
                block
              >
                Stop Sprint
              </Button>
            </ModalFooter>
          </Modal>
          {/* End Sprint Modal */}
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
  {
    getProjects,
    deleteProject,
    viewProject,
    updateProject,
    addProjectMembers,
    addEpics,
    deleteEpic,
    deleteMember,
    startSprint
  }
)(ProjectPage);
