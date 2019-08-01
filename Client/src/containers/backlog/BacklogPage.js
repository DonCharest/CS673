import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Container, Button } from "reactstrap";
import PropTypes from "prop-types";
import CardModal from "../../components/CardModal";
import Card from "../../components/Card";
import * as classes from "../../app.css";
import * as actions from "../../actions/sprintActions";
import ProjectsDropdown from "../../components/ProjectsDropdown";
import * as activeProjectActions from "../../actions/activeProjectActions";
import * as userActions from '../../actions/userActions';

class BacklogPage extends Component {
  static propTypes = {
    isAuthenticated: PropTypes.bool
  };

  componentDidMount() {
    if (this.props.users.length === 0) {
      this.props.actions.getUsers()  
    }
    
  }


  constructor(props) {
    super(props);

    this.state = {
      showCardModal: false,
    };

    this.onChangeProject = this.onChangeProject.bind(this);
    this.toggleCardModal = this.toggleCardModal.bind(this);
  }

  toggleCardModal() {
    if (this.state.showCardModal) {
      this.setState({ showCardModal: false });
    } else {
      this.setState({ showCardModal: true });
    }
  }

  onChangeProject(e) {
    this.props.actions.updateActiveProject(e.target.value)
    this.props.actions.getCards(e.target.value);
  }

  render() {
    return (
      <Container>
        <div className={classes.pageHeader}>
          <CardModal
            title="Add New Story"
            showCardModal={this.state.showCardModal}
            toggleCardModal={this.toggleCardModal}
            saveCard={this.props.actions.addNewCard}
          />
          <h1>Backlog</h1>
          <hr />
          <Button
            onClick={this.toggleCardModal}
            className={classes.customButtonDark}
            color="dark"
          >
            Add Story
          </Button>
          <ProjectsDropdown
            value={this.props.activeProject}
            name="project"
            onChange={this.onChangeProject}
          />
        </div>
        <div className={classes.allSprintColumns}>
          <div className={classes.columnContainer}>
            {this.props.sprint.backlog.map((item, index) => (
              <Card key={index} cardData={item} />
            ))}
          </div>
        </div>
      </Container>
    );
  }
}

const mapStateToProps = state => {
  return {
    sprint: state.sprint,
    auth: state.auth,
    isAuthenticated: state.auth.isAuthenticated,
    activeProject: state.activeProject,
    users: state.user.users,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    actions: bindActionCreators({ ...actions, ...activeProjectActions, ...userActions }, dispatch)
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BacklogPage);
