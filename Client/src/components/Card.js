import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Button, Label, Input, FormGroup } from "reactstrap";
import PropTypes from "prop-types";
import * as classes from "../app.css";
import CardModal from "./CardModal";
import * as actions from "../actions/sprintActions";

class Card extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showCardModal: false
    };

    this.toggleCardModal = this.toggleCardModal.bind(this);
    this.updateStage = this.updateStage.bind(this);
  }

  toggleCardModal() {
    if (this.state.showCardModal) {
      this.setState({ showCardModal: false });
    } else {
      this.setState({ showCardModal: true });
    }
  }

  updateStage(e) {
    this.props.actions.updateStage(this.props.cardData._id, e.target.value);
  }

  render() {
    return (
      <div
        className={
          this.props.cardData.type === "ISSUE"
            ? classes.cardIssue
            : this.props.cardData.type === "TASK"
            ? classes.cardTask
            : classes.card
        }
      >
        <CardModal
          title="Edit Story"
          showCardModal={this.state.showCardModal}
          toggleCardModal={this.toggleCardModal}
          saveCard={this.props.actions.editCard}
          deleteCard={this.props.actions.deleteCard}
          cardData={this.props.cardData}
        />

        <div className={classes.cardDescription}>
          {this.props.cardData.title}
        </div>

        <div className={classes.divInline}>
          <FormGroup>
            {/* <Label>Stage</Label> */}
            <Input
              className={classes.cardSelectDropdown}
              type="select"
              name="stage"
              onChange={this.updateStage}
              value={
                this.props.cardData.currentStage
                  ? this.props.cardData.currentStage.toLowerCase()
                  : this.props.cardData.stage[0].stageName.toLowerCase()
              }
            >
              <option value="backlog">BackLog</option>
              <option value="todo">To Do</option>
              <option value="workinprogress">Work in Progress</option>
              <option value="verification">Verification</option>
              <option value="done">Complete</option>
              <option value="accepted">Accepted</option>
            </Input>
          </FormGroup>

          <Button
            className={classes.cardEditButton}
            onClick={this.toggleCardModal}
            className={classes.customButtonDark2}
            color="dark"
          >
            Edit
          </Button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    sprint: state.sprint,
    auth: state.auth,
    isAuthenticated: state.auth.isAuthenticated
  };
};

const mapDispatchToProps = dispatch => {
  return {
    actions: bindActionCreators({ ...actions }, dispatch)
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Card);
