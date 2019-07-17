import React, {Component} from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import {Button, 
  Modal, 
  ModalHeader, 
  ModalBody, 
  ModalFooter,
  FormGroup,
  Label,
  Input,
  Form} from 'reactstrap';
import * as classes from "../app.css";
import ProjectsDropdown from './ProjectsDropdown'
import UsersDropdown from './UsersDropdown'

class CardModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      title: props.cardData ? props.cardData.title : '',
      description: props.cardData ? props.cardData.description : '',
      stage: props.cardData && props.cardData.currentStage ? props.cardData.currentStage.toLowerCase() : 'backlog',
      assignedId: props.cardData ?  props.cardData.assignedTo : props.loggedInId,
      projectId: '',
      priority: props.cardData ?  props.cardData.priority : 'MEDIUM',
      type: props.cardData ? props.cardData.type : 'REQUIREMENT',
      load: props.cardData ? props.cardData.load : 1,
    };

    this.saveAndClose = this.saveAndClose.bind(this);
    this.updateField = this.updateField.bind(this);

    this.autoSelectProject = this.autoSelectProject.bind(this)
  }

  componentDidMount() {
    this.autoSelectProject()
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.projects.length !== this.props.projects.length ) {
      this.autoSelectProject()
    }
  }

  autoSelectProject() {
    if (this.props.projects.length > 0) {
      this.updateField({target: {name: 'projectId', value: this.props.projects[0]._id}})
    }
  }

  updateField(e) {
    this.setState({[e.target.name]: e.target.value})
  }

  saveAndClose(e) {
    e.preventDefault()


    const baseCardData =  {
      title: this.state.title, 
      description: this.state.description, 
      priority: this.state.priority,
      type: this.state.type,
      load:this.state.load,
    }


    let updatedCardData = {}

    // if edit
    if (this.props.cardData) {
      updatedCardData = {...baseCardData, 
        id: this.props.cardData._id,
        assignedTo: this.state.assignedId, 
        // sprint: 
        // epic:    
      }
    } else {
      // if new
      updatedCardData = {...baseCardData, 
        stageName: this.state.stage, 
         project: this.state.projectId,
        createdBy: this.props.loggedInId, 
      }
    }

    this.props.saveCard(updatedCardData, this.props.toggleCardModal)
    
  }

  render() {
    return (
    <div>
      <Modal isOpen={this.props.showCardModal} toggle={this.props.toggleCardModal}>
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
            <FormGroup >
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
                value={this.state.priority}>
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
                value={this.state.type}>
                <option value="“REQUIREMENT”">Requirement</option>
                <option value="TASK">Task</option>
                <option value="ISSUE">Issue</option>
              </Input>
            </FormGroup>
            <FormGroup>
                <Label>Story Name</Label>
                <Input
                  value={this.state.load} 
                  onChange={this.updateField} 
                  name="load"
                  type="number" 
                  placeholder="project load" 
                />
              </FormGroup>
          {!this.props.cardData ? 

            <div>
              <FormGroup>
                <Label>Stage</Label>
                <Input
                  type="select" 
                  name="stage"
                  onChange={this.updateField} 
                  value={this.state.stage}>
                  <option value="backlog">BackLog</option>
                  <option value="todo">ToDo</option>
                  <option value="workinprogress">Work in Progress</option>
                  <option value="verification">Verification</option>
                  <option value="done">Done</option>
                </Input>
              </FormGroup>
              <ProjectsDropdown
                value = {this.state.projectId}
                name="projectId"
                onChange={this.updateField}
                dropdownId="projectsDropdownNewCard"
              /> 
            </div> : null}
          {this.props.cardData ? 
            <div>
              <UsersDropdown
                value = {this.state.userId}
                name="assignedId"
                onChange={this.updateField}
              /> 
            </div> : null}
            
            
          
        </ModalBody>

        <ModalFooter>
          <Button color="secondary"  onClick={this.props.toggleCardModal}>Close</Button>
          {this.props.cardData ? <Button color="danger"  onClick={() => this.props.deleteCard(this.props.cardData._id, this.props.toggleCardModal)}>Delete</Button> : null}
          <Button type="submit" color="primary" onClick={this.saveAndClose}>Save changes</Button>
        </ModalFooter>
        </Form>
      </Modal>

    </div>
  );
  }
  
};

const mapStateToProps = (state) => {
  return {
    loggedInId: state.auth.user._id,
    projects: state.project.projects,
  }
};


export default connect(
  mapStateToProps,
  null
)(CardModal);
