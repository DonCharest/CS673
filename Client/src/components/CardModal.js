import React, {Component} from "react";
import { Container } from "reactstrap";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import {Button, Modal, Form} from 'react-bootstrap';
import * as classes from "../app.css";
import ProjectsDropdown from './ProjectsDropdown'
import UsersDropdown from './UsersDropdown'

class CardModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      title: props.cardData ? props.cardData.title : '',
      description: props.cardData ? props.cardData.description : '',
      stage: props.cardData ?  props.cardData.stage[0].stageName.toLowerCase() : 'backlog',
      assignedId: props.cardData ?  props.cardData.assignedTo : props.loggedInId,
      projectId: '',
      shortcode:  '',
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
    console.log(e.target.name)
    console.log(e.target.value)
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
        'project.shortcode': this.state.shortcode,
        createdBy: this.props.loggedInId, 
      }
    }

    this.props.saveCard(updatedCardData, this.props.toggleCardModal)
    
  }

  render() {
    return (
    <div>
      <Modal show={this.props.showCardModal} onHide={this.props.toggleCardModal}>
        <Modal.Header closeButton>
          <Modal.Title>{this.props.title}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form>
            <Form.Group controlId="story-name">
              <Form.Label>Title</Form.Label>
              <Form.Control 
                value={this.state.title} 
                onChange={this.updateField} 
                name="title"
                type="text" 
                placeholder="story name" 
              />
            </Form.Group>
            <Form.Group controlId="story-name">
              <Form.Label>Description</Form.Label>
              <Form.Control 
                value={this.state.description} 
                onChange={this.updateField} 
                name="description"
                type="textarea" 
                placeholder="" 
              />
            </Form.Group>
            <Form.Group controlId="priorty">
              <Form.Label>Priority</Form.Label>
              <Form.Control 
                as="select" 
                name="priority"
                onChange={this.updateField} 
                value={this.state.priority}>
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="type">
              <Form.Label>Type</Form.Label>
              <Form.Control 
                as="select" 
                name="type"
                onChange={this.updateField} 
                value={this.state.type}>
                <option value="“REQUIREMENT”">Requirement</option>
                <option value="TASK">Task</option>
                <option value="ISSUE">Issue</option>
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="load">
                <Form.Label>Project Load</Form.Label>
                <Form.Control 
                  value={this.state.load} 
                  onChange={this.updateField} 
                  name="load"
                  type="number" 
                  placeholder="project load" 
                />
              </Form.Group>
          {!this.props.cardData ? 

            <div>
              <Form.Group controlId="stage">
                <Form.Label>Stage</Form.Label>
                <Form.Control 
                  as="select" 
                  name="stage"
                  onChange={this.updateField} 
                  value={this.state.stage}>
                  <option value="backlog">BackLog</option>
                  <option value="todo">ToDo</option>
                  <option value="workinprogress">Work in Progress</option>
                  <option value="verification">Verification</option>
                  <option value="done">Done</option>
                </Form.Control>
              </Form.Group>
              <ProjectsDropdown
                value = {this.state.projectId}
                name="projectId"
                onChange={this.updateField}
              /> 
              <Form.Group controlId="project-shortcode">
                <Form.Label>Project Shortcode</Form.Label>
                <Form.Control 
                  value={this.state.shortcode} 
                  onChange={this.updateField} 
                  name="shortcode"
                  type="text" 
                  placeholder="project shortcode" 
                />
              </Form.Group>
            </div> : null}
          {this.props.cardData ? 
            <div>
              <UsersDropdown
                value = {this.state.userId}
                name="assignedId"
                onChange={this.updateField}
              /> 
            </div> : null}
            
            
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary"  onClick={this.props.toggleCardModal}>Close</Button>
          {this.props.cardData ? <Button variant="danger"  onClick={() => this.props.deleteCard(this.props.cardId, this.props.toggleCardModal)}>Delete</Button> : null}
          <Button variant="primary" onClick={this.saveAndClose}>Save changes</Button>
        </Modal.Footer>
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
