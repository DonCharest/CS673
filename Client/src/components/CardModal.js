import React, {Component} from "react";
import { Container } from "reactstrap";
import PropTypes from "prop-types";
import {Button, Modal, Form} from 'react-bootstrap';
import * as classes from "../app.css";

class CardModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      description: props.description || ''
    };

    this.saveAndClose = this.saveAndClose.bind(this);
    this.updateNewStoryName = this.updateNewStoryName.bind(this);
  }

  // componentWillUnmount() {
  //   this.setState({description: ''})
  // }

  updateNewStoryName(e) {
    this.setState({description: e.target.value})
  }

  saveAndClose(e) {
    e.preventDefault()
    this.props.saveCard({
      description: this.state.description, 
      createdBy: '5d13e9ebb2c52b209f75c0af', 
      project: '5d229a761350c68f58f61372'
    }, this.props.toggleCardModal)
    
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
              <Form.Control onChange={this.updateNewStoryName} type="text" placeholder="story name" />
            </Form.Group>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary"  onClick={this.props.toggleCardModal}>Close</Button>
          <Button variant="primary" onClick={this.saveAndClose}>Save changes</Button>
        </Modal.Footer>
      </Modal>

    </div>
  );
  }
  
};

export default CardModal;
