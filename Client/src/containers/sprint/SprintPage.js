import React, {Component} from 'react';
import PropTypes from "prop-types";
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Button, Modal, Form} from 'react-bootstrap';
import * as actions from '../../actions/sprintActions';
import * as classes from '../../app.css';



class SprintPage extends Component {


  componentDidMount() {
    // request all cards
    this.props.actions.getCards()
  }


  

  render() {
    return (
      <div>
        

        <h1>Sprint</h1>
        <Button onClick={this.toggleAddStoryModal}>Add Story</Button>
        <div className={classes.allSprintColumns}>
          <div className={classes.columnContainer}>
            <div className={classes.columnHeader}>To do</div>
            {this.props.sprint.todo.map((item, index) => <div key={index} className={classes.sprintStory}>{item.description}</div>)}
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


const mapStateToProps = (state) => {
  return {
    sprint: state.sprint,
    auth: state.auth
  }
};


const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators({...actions}, dispatch),  
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SprintPage)

