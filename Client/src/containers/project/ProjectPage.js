import React, { Component } from "react";
import { Container, ListGroup, ListGroupItem, Button } from "reactstrap";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import {
  getProjects,
  deleteProject,
  viewProject
} from "../../actions/projectActions";
import { getUsers } from "../../actions/userActions";
import NewProjectModal from "./NewProjectModal";
import * as classes from "../../app.css";

class ProjectPage extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  static propTypes = {
    getProjects: PropTypes.func.isRequired,
    getUsers: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool,
    project: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired
  };

  componentDidMount() {
    this.props.getProjects();
    this.props.getUsers();
  }

  onDeleteClick = id => {
    this.props.deleteProject(id);
    this.props.getProjects();
  };

  onViewClick = id => {
    this.props.viewProject(id);
    this.props.getProjects();
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
              <b>&nbsp;&nbsp;&nbsp;Project Management</b>
            </h6>
            <TransitionGroup className={classes.projectList}>
              {projects.map(({ _id, name }) => (
                <CSSTransition
                  key={_id}
                  timeout={500}
                  classNames={classes.fade}
                >
                  <ListGroupItem>
                    {this.props.isAuthenticated ? (
                      <Button
                        className="remove-btn"
                        color="danger"
                        size="sm"
                        onClick={this.onDeleteClick.bind(this, _id)}
                      >
                        &times;
                      </Button>
                    ) : null}
                    {"\u00A0\u00A0\u00A0\u00A0" +
                      name +
                      "\u00A0\u00A0\u00A0\u00A0"}
                    <Button
                      className="remove-btn"
                      color="info"
                      size="sm"
                      onClick={this.onViewClick.bind(this, _id)}
                    >
                      &times;
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
  auth: state.auth,
  user: state.user,
  isAuthenticated: state.auth.isAuthenticated
});

export default connect(
  mapStateToProps,
  { getProjects, deleteProject, viewProject, getUsers }
)(ProjectPage);
