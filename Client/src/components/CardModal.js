import React, {Component} from "react";
import { Container } from "reactstrap";
import PropTypes from "prop-types";
import {Button, Modal, Form} from 'react-bootstrap';
import * as classes from "../app.css";
import ProjectsDropdown from './ProjectsDropdown'
import UsersDropdown from './UsersDropdown'

class CardModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      description: this.props.description || '',
      stage: this.props.stage || 'backlog',
      assignedId: this.props.assignedId || '',
      projectId: this.props.projectId || '',
      shortcode: '',
      priority: this.props.priority || '',
      type: this.props.type || '',
      load: this.props.load || 0,
    };

    this.saveAndClose = this.saveAndClose.bind(this);
    this.updateField = this.updateField.bind(this);
  }

  updateField(e) {
    this.setState({[e.target.name]: e.target.value})
  }

  saveAndClose(e) {
    e.preventDefault()

    const cardData =  {
      description: this.state.description, 
      stage: this.state.stage, 
      priority: this.state.priority,
      type: this.state.type,
      load:this.state.load,
    }

    const newCardData = {
      project: this.state.projectId,
      'project.shortcode': this.state.shortcode,
      createdBy: this.props.user._id, 
    }

    const editCardData = {
      id: this.props.cardId,
      assignedTo: this.state.assignedId, 
      // sprint: 
      // epic:     
    }
    this.props.saveCard(cardData, this.props.toggleCardModal)
    
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
              <Form.Label>Story Name</Form.Label>
              <Form.Control 
                value={this.state.description} 
                onChange={this.updateField} 
                name="description"
                type="text" 
                placeholder="story name" 
              />
            </Form.Group>
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
                value={this.state.priority}>
                <option value="“REQUIREMENT”">Requirement</option>
                <option value="TASK">Task</option>
                <option value="ISSUE">Issue</option>
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="load">
                <Form.Label>Story Name</Form.Label>
                <Form.Control 
                  value={this.state.load} 
                  onChange={this.updateField} 
                  name="load"
                  type="number" 
                  placeholder="project load" 
                />
              </Form.Group>

          {this.props.id ? 
            <div>
              <ProjectsDropdown
                value = {this.state.projectId}
                name="projectId"
                onChange={this.updateField}
              /> 
              <Form.Group controlId="project-shortcode">
                <Form.Label>Story Name</Form.Label>
                <Form.Control 
                  value={this.state.shortcode} 
                  onChange={this.updateField} 
                  name="shortcode"
                  type="text" 
                  placeholder="project shortcode" 
                />
              </Form.Group>
            </div> : null}

          {this.props.id ? 
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
          {this.props.cardId ? <Button variant="danger"  onClick={() => this.props.deleteCard(this.props.cardId, this.props.toggleCardModal)}>Delete</Button> : null}
          <Button variant="primary" onClick={this.saveAndClose}>Save changes</Button>
        </Modal.Footer>
      </Modal>

    </div>
  );
  }
  
};

export default CardModal;
