import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Container, Button } from "reactstrap";
import CardModal from "../../components/CardModal";
import Card from "../../components/Card";
import * as actions from "../../actions/sprintActions";
import * as activeProjectActions from "../../actions/activeProjectActions";
import * as classes from "../../app.css";
import ProjectsDropdown from "../../components/ProjectsDropdown";

class SprintPage extends Component {
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
    console.log(e);
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
          <h1>Sprint</h1>
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
            <div className={classes.columnHeader}>To Do</div>
            {this.props.sprint.todo.map((item, index) => (
              <Card key={index} cardData={item} />
            ))}
          </div>
          <div className={classes.columnContainer}>
            <div className={classes.columnHeader}>Work in Progress</div>
            {this.props.sprint.workinprogress.map((item, index) => (
              <Card key={index} cardData={item} />
            ))}
          </div>
          <div className={classes.columnContainer}>
            <div className={classes.columnHeader}>Verification</div>
            {this.props.sprint.verification.map((item, index) => (
              <Card key={index} cardData={item} />
            ))}
          </div>
          <div className={classes.columnContainer}>
            <div className={classes.columnHeader}>Complete</div>
            {this.props.sprint.done.map((item, index) => (
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
    activeProject: state.activeProject
  };
};

const mapDispatchToProps = dispatch => {
  return {
    actions: bindActionCreators({ ...actions, ...activeProjectActions }, dispatch)
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SprintPage);
