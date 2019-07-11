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
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      name: "",
      shortCode: "",
      effortUnit: "",
      description: "",
      projectMembers: ""
    };

    this.handleChange = this.onViewClick.bind(this);
    //this.handleSubmit = this.handleSubmit.bind(this);

    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal
    }));
  }

  static propTypes = {
    getProjects: PropTypes.func.isRequired,
    project: PropTypes.object.isRequired,
    isAuthenticated: PropTypes.bool,
    user: PropTypes.object.isRequired
    // getUsers: PropTypes.func.isRequired,
    // auth: PropTypes.object.isRequired
  };

  componentDidMount() {
    this.props.getProjects();
    // this.props.getUsers();
    // this.getProjectById(this.props._id);
  }

  getProjectById(id) {
    axios.get(`/api/projects/${id}`).then(res => {
      const project = res.data;
      console.log(project);
      this.setState({
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
    this.props.viewProject(id);
    this.toggle();
    this.getProjectById(id);
  };

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
                      outline
                      color="danger"
                      size="sm"
                      style={{ marginRight: "5px" }}
                      onClick={this.onDeleteClick.bind(this, _id)}
                    >
                      Delete
                    </Button>
                    <Button
                      className="float-right"
                      outline
                      color="info"
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
                    onChange={this.handleChange.bind(this, "name")}
                  />
                  <Label for="shortCode">Short Code:</Label>
                  <Input
                    type="text"
                    name="shortCode"
                    id="shortCode"
                    maxLength="4"
                    defaultValue={this.state.shortCode}
                    onChange={this.handleChange.bind(this, "shortCode")}
                  />
                  <Label for="effortUnit">Effort Units:</Label>
                  <Input
                    type="text"
                    name="effortUnit"
                    id="effortUnit"
                    defaultValue={this.state.effortUnit}
                    onChange={this.handleChange.bind(this, "effortUnit")}
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
                    defaultValue={this.state.description}
                    onChange={this.handleChange.bind(this, "description")}
                  />
                  <Label for="userID">Select Project Members:</Label>
                  <Input
                    type="select"
                    multiple
                    name="userID"
                    id="userID"
                    defaultValue={this.state.projectMembers}
                    onChange={this.handleChange.bind(this, "projectMembers")}
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
            <ModalFooter>
              <Button color="primary" onClick={this.toggle}>
                Update
              </Button>{" "}
              <Button color="secondary" onClick={this.toggle}>
                Cancel
              </Button>
            </ModalFooter>
          </Modal>
          {/* ********************************************* */}
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
  { getProjects, deleteProject, viewProject }
)(ProjectPage);
