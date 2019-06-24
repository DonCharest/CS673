import React, {Component} from 'react';
import PropTypes from "prop-types";
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Button, Modal, Form} from 'react-bootstrap';
import * as actions from '../../reducers/actions';
import * as classes from '../../app.css';



class SprintPage extends Component {
  constructor(props) {
    super(props)

    this.state = {
      showAddStoryModal: false,
      newStoryName: ''
    }

    this.toggleAddStoryModal = this.toggleAddStoryModal.bind(this);
    this.saveAndClose = this.saveAndClose.bind(this);
    this.updateNewStoryName = this.updateNewStoryName.bind(this);
  }


  toggleAddStoryModal() {
    if (this.state.showAddStoryModal) {
      this.setState({showAddStoryModal: false, newStoryName: ''})
    } else {
      this.setState({showAddStoryModal: true})
    }
  }

  updateNewStoryName(e) {
    this.setState({newStoryName: e.target.value})
  }

  saveAndClose() {
    this.props.actions.addNewStory({name: this.state.newStoryName})
    this.toggleAddStoryModal();
  }

  render() {
    return (
      <div>
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

        <h1>Sprint</h1>
        <Button onClick={this.toggleAddStoryModal}>Add Story</Button>
        <div className={classes.allSprintColumns}>
          <div className={classes.columnContainer}>
            <div className={classes.columnHeader}>To do</div>
            {this.props.sprint.todo.map((item) => <div className={classes.sprintStory}>{item.name}</div>)}
          </div>
          <div className={classes.columnContainer}>
            <div className={classes.columnHeader}>WIP</div>
          </div>
          <div className={classes.columnContainer}>
            <div className={classes.columnHeader}>Verification</div>
          </div>
          <div className={classes.columnContainer}>
            <div className={classes.columnHeader}>Complete</div>
          </div>
        </div>
      </div>
    );
  }
};


}

const mapStateToProps = (state) => {
  return {
    sprint: state.sprint,
  }
};


const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators({...actions}, dispatch),  
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SprintPage)

