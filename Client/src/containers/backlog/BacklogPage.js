import React, { Component } from "react";
import { Container } from "reactstrap";
import { connect } from "react-redux";
import {bindActionCreators} from 'redux';
import {Button, Modal, Form} from 'react-bootstrap';
import PropTypes from "prop-types";
import * as classes from '../../app.css';
import * as actions from '../../actions/sprintActions';

class BacklogPage extends Component {
  static propTypes = {
    isAuthenticated: PropTypes.bool
  };

  constructor(props) {
    super(props)

    this.state = {
      showAddStoryModal: false,
      newStoryDescription: ''
    }

    this.toggleAddStoryModal = this.toggleAddStoryModal.bind(this);
    this.saveAndClose = this.saveAndClose.bind(this);
    this.updateNewStoryName = this.updateNewStoryName.bind(this);
  }

  componentDidMount() {
    // request all cards
    this.props.actions.getCards()
  }

  toggleAddStoryModal() {
    if (this.state.showAddStoryModal) {
      this.setState({showAddStoryModal: false, newStoryDescription: ''})
    } else {
      this.setState({showAddStoryModal: true})
    }
  }

  updateNewStoryName(e) {
    this.setState({newStoryDescription: e.target.value})
  }

  saveAndClose(e) {
    e.preventDefault()
    this.props.actions.addNewCard({description: this.state.newStoryDescription, createdBy: '5d13e9ebb2c52b209f75c0af', project: '5d229a761350c68f58f61372'})
    this.toggleAddStoryModal();
  }

  render() {
    return (
      <Container>
        <Modal show={this.state.showAddStoryModal} onHide={this.toggleAddStoryModal}>
          <Modal.Header closeButton>
            <Modal.Title>Add New Story</Modal.Title>
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
            <Button variant="secondary"  onClick={this.toggleAddStoryModal}>Close</Button>
            <Button variant="primary" onClick={this.saveAndClose}>Save changes</Button>
          </Modal.Footer>
        </Modal>

        <h1>BackLog</h1>
        <Button onClick={this.toggleAddStoryModal}>Add Story</Button>
        <div className={classes.allSprintColumns}>
          <div className={classes.columnContainer}>
            {this.props.sprint.backlog.map((item, index) => <div key={index} className={classes.sprintStory}>{item.description}</div>)}
          </div>
        </div>


   
      </Container>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    sprint: state.sprint,
    auth: state.auth,
    isAuthenticated: state.auth.isAuthenticated
  }
};


const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators({...actions}, dispatch),  
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BacklogPage);
