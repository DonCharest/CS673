import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormGroup,
  Label,
  Input,
  Form
} from "reactstrap";
import * as classes from "../app.css";
import ProjectsDropdown from "./ProjectsDropdown";
import UsersDropdown from "./UsersDropdown";

class CardModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showDeleteWarning: false,
      title: props.cardData ? props.cardData.title : "",
      description: props.cardData ? props.cardData.description : "",
      stage:
        props.cardData && props.cardData.currentStage
          ? props.cardData.currentStage.toLowerCase()
          : /sprint/.test(window.location.hash) ? "todo"
          : "backlog",
      assignedId: props.cardData ? props.cardData.assignedTo : props.loggedInId,
      projectId: props.activeProject,
      priority: props.cardData ? props.cardData.priority : "MEDIUM",
      type: props.cardData ? props.cardData.type : "REQUIREMENT",
      load: props.cardData ? props.cardData.load : 1,
      comment: props.cardData ? props.cardData.comment : "",
      errors: [],
      showValidationModal: false
    };

    this.saveAndClose = this.saveAndClose.bind(this);
    this.updateField = this.updateField.bind(this);
    this.toggleDeleteModal = this.toggleDeleteModal.bind(this)
    this.autoSelectProject = this.autoSelectProject.bind(this);
    this.validateForm = this.validateForm.bind(this)
    this.toggleValidationModal = this.toggleValidationModal.bind(this)
  }

  componentDidMount() {
    this.autoSelectProject();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.projects.length !== this.props.projects.length) {
      this.autoSelectProject();
    } else if (!this.props.cardData && prevProps.showCardModal !== this.props.showCardModal && this.props.showCardModal === false) {
      // reset modal on close
      this.setState({
        showDeleteWarning: false,
        title: this.props.cardData ? this.props.cardData.title : "",
        description: this.props.cardData ? this.props.cardData.description : "",
        stage:
          this.props.cardData && this.props.cardData.currentStage
            ? this.props.cardData.currentStage.toLowerCase()
            : /sprint/.test(window.location.hash) ? "todo"
            : "backlog",
        assignedId: this.props.cardData ? this.props.cardData.assignedTo : this.props.loggedInId,
        projectId: this.props.activeProject,
        priority: this.props.cardData ? this.props.cardData.priority : "MEDIUM",
        type: this.props.cardData ? this.props.cardData.type : "REQUIREMENT",
        load: this.props.cardData ? this.props.cardData.load : 1,
        comment: this.props.cardData ? this.props.cardData.comment : "",
        errors: [],
        showValidationModal: false
      });
    } else if (!this.props.cardData && this.props.activeProject !== prevProps.activeProject) {
      // reset project id on new modal if active project changed
      this.setState({projectId: this.props.activeProject})
    }
  }

  autoSelectProject() {
    if (this.props.projects.length > 0) {
      this.updateField({
        target: { name: "projectId", value: this.props.projects[0]._id }
      });
    }
  }

  updateField(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  toggleDeleteModal() {
    if (this.state.showDeleteWarning) {
      this.setState({showDeleteWarning: false})
    } else {
      this.setState({showDeleteWarning: true})  
    }
    
  }

  toggleValidationModal() {
    if (this.state.showValidationModal) {
      this.setState({showValidationModal: false, errors: []})
    } else {
      this.setState({showValidationModal: true})  
    }
    
  }

  validateForm (cardData, isNew) {
    const requiredFields = [
      'title',
      'description',
      'priority',
      'type',
    ]
    const errors = []
    requiredFields.forEach((field) => {
      if (!cardData[field]) {
        errors.push({name: field, message: 'Field is required'})
      }
    })

    return errors

  }

  saveAndClose(e) {
    e.preventDefault();

    let isNewCard = true

    const baseCardData = {
      title: this.state.title,
      description: this.state.description,
      priority: this.state.priority,
      type: this.state.type,
      load: this.state.load,
      comment: this.state.comment
    };

    let updatedCardData = {};

    // if edit
    if (this.props.cardData) {
      let isNewCard = false
      updatedCardData = {
        ...baseCardData,
        id: this.props.cardData._id,
        assignedTo: this.state.assignedId
        // sprint:
        // epic:
      };
    } else {
      // if new
      updatedCardData = {
        ...baseCardData,
        stageName: this.state.stage,
        project: this.state.projectId,
        createdBy: this.props.loggedInId
      };
    }

    const errors = this.validateForm(updatedCardData, isNewCard)

    if (errors.length === 0 ) {
      this.props.saveCard(updatedCardData, this.props.toggleCardModal);
    } else {
      this.setState({errors, showValidationModal: true})
    }

    
  }

  render() {

    return (
      <div>
        

        <Modal
          isOpen={this.state.showValidationModal}
          toggle={this.toggleValidationModal}
        >
          <ModalHeader toggle={this.toggleValidationModal}>
            Error with Story
          </ModalHeader>
          <ModalBody>
            The following field(s) are invalid:
            <ol>
            {
              this.state.errors.map((error, i) => {
                return (
                  <li key={i}>
                    <span>{error.name}:</span> <span>{error.message}</span>
                  </li>
                )
              })

            }
            </ol>
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={this.toggleValidationModal}>
              Close
            </Button>
          </ModalFooter>
        </Modal>



        <Modal
          isOpen={this.state.showDeleteWarning}
          toggle={this.toggleDeleteModal}
        >
          <ModalHeader toggle={this.toggleCardModal}>
            Warning
          </ModalHeader>
          <ModalBody>
            {`Are you sure you want to delete the story "${this.state.title}"?`}
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={this.toggleDeleteModal}>
              Cancel
            </Button>
            <Button
              type="submit"
              className={classes.customButtonDark}
              color="danger"
              onClick={() => this.props.deleteCard(
                  this.props.cardData._id,
                  this.props.toggleCardModal
                )}
            >
              Yes, Delete
            </Button>
          </ModalFooter>
        </Modal>



        <Modal
          isOpen={this.props.showCardModal}
          toggle={this.props.toggleCardModal}
        >
          <ModalHeader toggle={this.props.toggleCardModal}>
            {this.props.title}
          </ModalHeader>
          <Form onSubmit={this.saveAndClose}>
            <ModalBody>
              <FormGroup>
                <Label>Title</Label>
                <Input
                  value={this.state.title}
                  onChange={this.updateField}
                  name="title"
                  type="text"
                  placeholder="story name"
                />
              </FormGroup>
              <FormGroup>
                <Label>Description</Label>
                <Input
                  value={this.state.description}
                  onChange={this.updateField}
                  name="description"
                  type="textarea"
                  placeholder=""
                />
              </FormGroup>

              <FormGroup>
                <Label>Priority</Label>
                <Input
                  type="select"
                  name="priority"
                  onChange={this.updateField}
                  value={this.state.priority}
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                </Input>
              </FormGroup>

              <FormGroup>
                <Label>Type</Label>
                <Input
                  type="select"
                  name="type"
                  onChange={this.updateField}
                  value={this.state.type}
                >
                  <option value="“REQUIREMENT”">Requirement</option>
                  <option value="TASK">Task</option>
                  <option value="ISSUE">Issue</option>
                </Input>
              </FormGroup>

              <FormGroup>
                <Label>Load</Label>
                <Input
                  value={this.state.load}
                  onChange={this.updateField}
                  name="load"
                  type="number"
                  min="0"
                  max="50"
                  placeholder="project load"
                />
              </FormGroup>

              {!this.props.cardData ? (
                <div>
                  <FormGroup>
                    <Label>Stage</Label>
                    <Input
                      type="select"
                      name="stage"
                      onChange={this.updateField}
                      value={this.state.stage}
                    >
                      <option value="backlog">Backlog</option>
                      <option value="todo">To Do</option>
                      <option value="workinprogress">Work in Progress</option>
                      <option value="verification">Verification</option>
                      <option value="done">Complete</option>
                      {/* <option value="accepted">Accepted</option> */}
                    </Input>
                  </FormGroup>
                  <ProjectsDropdown
                    value={this.state.projectId}
                    name="projectId"
                    onChange={this.updateField}
                    dropdownId="projectsDropdownNewCard"
                  />
                </div>
              ) : null}
              {this.props.cardData ? (
                <div>
                  <UsersDropdown
                    value={this.state.assignedId}
                    name="assignedId"
                    onChange={this.updateField}
                  />
                  <FormGroup>
                  <Label>Comments</Label>
                  <Input
                    value={this.state.comment}
                    onChange={this.updateField}
                    name="comment"
                    type="textarea"
                    placeholder=""
                  />
                </FormGroup>
                </div>
              ) : null}
            </ModalBody>

            <ModalFooter>
              <Button color="secondary" onClick={this.props.toggleCardModal}>
                Close
              </Button>
              {this.props.cardData ? (
                <Button
                  color="danger"
                  onClick={this.toggleDeleteModal}
                >
                  Delete
                </Button>
              ) : null}
              <Button
                type="submit"
                className={classes.customButtonDark}
                color="primary"
                onClick={this.saveAndClose}
              >
                Save changes
              </Button>
            </ModalFooter>
          </Form>
        </Modal>
        
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    loggedInId: state.auth.user._id,
    projects: state.project.projects,
    activeProject: state.activeProject
  };
};

export default connect(
  mapStateToProps,
  null
)(CardModal);
