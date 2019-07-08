import React, { Component } from "react";
import { Container, ListGroup, ListGroupItem, Button } from "reactstrap";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { connect } from "react-redux";
import NewProjectModal from "./NewProjectModal";
import UpdateProjectModal from "./UpdateProjectModal";
import {
  getProjects,
  deleteProject,
  viewProject
} from "../../actions/projectActions";
import PropTypes from "prop-types";
// import { getUsers } from "../../actions/userActions";
import * as classes from "../../app.css";

class ProjectPage extends Component {
  static propTypes = {
    getProjects: PropTypes.func.isRequired,
    project: PropTypes.object.isRequired,
    isAuthenticated: PropTypes.bool
    // getUsers: PropTypes.func.isRequired,
    // user: PropTypes.object.isRequired,
    // auth: PropTypes.object.isRequired
  };

  componentDidMount() {
    this.props.getProjects();
    // this.props.getUsers();
  }

  onDeleteClick = id => {
    if (window.confirm("This project will be permanently deleted!")) {
      this.props.deleteProject(id);
    }
  };

  onViewClick = id => {
    this.props.viewProject(id);
    // <UpateProjectModal />;
    //this.state.show;
  };

  render() {
    const { projects } = this.props.project;
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
        </div>
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  project: state.project,
  // auth: state.auth,
  // user: state.user,
  isAuthenticated: state.auth.isAuthenticated
});

export default connect(
  mapStateToProps,
  { getProjects, deleteProject, viewProject }
)(ProjectPage);
