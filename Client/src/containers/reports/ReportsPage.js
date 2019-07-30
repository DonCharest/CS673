import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Container, Button, Label, Input, FormGroup } from "reactstrap";
import PropTypes from "prop-types";
import Card from "../../components/Card";
import * as classes from "../../app.css";
import * as actions from "../../actions/sprintActions";
import ProjectsDropdown from "../../components/ProjectsDropdown";
import * as activeProjectActions from "../../actions/activeProjectActions";

class ReportsPage extends Component {
  static propTypes = {
    isAuthenticated: PropTypes.bool
  };

  constructor(props) {
    super(props);
    this.state = {
      stage: ""
    };

    this.onChangeProject = this.onChangeProject.bind(this);
    this.onChangeStage = this.onChangeStage.bind(this);
  }

  onChangeProject(e) {
    this.props.actions.updateActiveProject(e.target.value);
    this.props.actions.getCards(e.target.value);
  }

  onChangeStage(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  render() {
    const selectedStage = [
      {
        id: "0",
        value: "backlog",
        label: "Backlog"
      },
      {
        id: "1",
        value: "todo",
        label: "To do"
      },
      {
        id: "2",
        value: "workinprogress",
        label: "Work in Progress"
      },
      {
        id: "3",
        value: "verification",
        label: "Verification"
      },
      {
        id: "4",
        value: "done",
        label: "Complete"
      },
      {
        id: "5",
        value: "accepted",
        label: "Accepted"
      }
    ];

    return (
      <Container>
        <div className={classes.pageHeader}>
          <h1>Reports</h1>
          <hr />

          <ProjectsDropdown
            value={this.props.activeProject}
            name="project"
            onChange={this.onChangeProject}
          />

          <FormGroup>
            <Label for="stage">Stage:</Label>
            <Input
              type="select"
              name="stage"
              id="stage"
              onChange={this.onChangeStage}
            >
              <option key="blank" value="">
                Select
              </option>
              {selectedStage.map(stage => (
                <option key={stage.id} value={stage.value}>
                  {stage.label}
                </option>
              ))}
            </Input>
          </FormGroup>
        </div>

        <div className={classes.allSprintColumns} />

        <div>
          {(() => {
            if (this.state.stage == "backlog") {
              return (
                <div className={classes.columnContainer}>
                  {this.props.sprint.backlog.map((item, index) => (
                    <Card key={index} cardData={item} />
                  ))}
                </div>
              );
            } else if (this.state.stage == "todo") {
              return (
                <div className={classes.columnContainer}>
                  {this.props.sprint.todo.map((item, index) => (
                    <Card key={index} cardData={item} />
                  ))}
                </div>
              );
            } else if (this.state.stage == "workinprogress") {
              return (
                <div className={classes.columnContainer}>
                  {this.props.sprint.workinprogress.map((item, index) => (
                    <Card key={index} cardData={item} />
                  ))}
                </div>
              );
            } else if (this.state.stage == "verification") {
              return (
                <div className={classes.columnContainer}>
                  {this.props.sprint.verification.map((item, index) => (
                    <Card key={index} cardData={item} />
                  ))}
                </div>
              );
            } else if (this.state.stage == "done") {
              return (
                <div className={classes.columnContainer}>
                  {this.props.sprint.done.map((item, index) => (
                    <Card key={index} cardData={item} />
                  ))}
                </div>
              );
            } else if (this.state.stage == "accepted") {
              return (
                <div className={classes.columnContainer}>
                  {this.props.sprint.accepted.map((item, index) => (
                    <Card key={index} cardData={item} />
                  ))}
                </div>
              );
            }
            // else {
            //   return <div>catch all</div>;
            // }
          })()}
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
    activeProject: state.activeProject
  };
};

const mapDispatchToProps = dispatch => {
  return {
    actions: bindActionCreators(
      { ...actions, ...activeProjectActions },
      dispatch
    )
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ReportsPage);
