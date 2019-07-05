import React, { Component } from "react";
import { Container, ListGroup, ListGroupItem } from "reactstrap";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { getProjects, deleteProject } from "../../actions/projectActions";
import NewProjectModal from "./NewProjectModal";
import * as classes from "../../app.css";

class ProjectPage extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  static propTypes = {
    getProjects: PropTypes.func.isRequired,
    // project: PropTypes.object.isRequired,
    isAuthenticated: PropTypes.bool
  };

  componentDidMount() {
    this.props.getProjects();
  }

  render() {
    // const { projects } = this.props.project;

    return (
      <Container>
        <div>
          <h1>Project Management</h1>
          <hr />
        </div>
        <div>
          <NewProjectModal />
        </div>
        <div>
          <h4>Manage Projects:</h4>
          {/* <ListGroup>
            <TransitionGroup className="projectList">
              {projects.map(({ _id, name }) => (
                <CSSTransition key={_id} timeout={500} classNames="fade">
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
                    {name}
                  </ListGroupItem>
                </CSSTransition>
              ))}
            </TransitionGroup>
          </ListGroup> */}
        </div>
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  project: state.project,
  isAuthenticated: state.auth.isAuthenticated
});

export default connect(
  mapStateToProps,
  { getProjects, deleteProject }
)(ProjectPage);
