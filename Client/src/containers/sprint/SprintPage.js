import React, {Component} from 'react';
import PropTypes from "prop-types";
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Button, Modal, Form} from 'react-bootstrap';
import CardModal from '../../components/CardModal'
import Card from '../../components/Card'
import * as actions from '../../actions/sprintActions';
import * as classes from '../../app.css';



class SprintPage extends Component {
  constructor(props) {
    super(props)

    this.state = {
      showCardModal: false,
    }

    this.toggleCardModal = this.toggleCardModal.bind(this);
  }

  componentDidMount() {
    // request all cards
    this.props.actions.getCards()
  }

  toggleCardModal() {
    if (this.state.showCardModal) {
      this.setState({showCardModal: false})
    } else {
      this.setState({showCardModal: true})
    }
  }

  

  render() {
    return (
      <div>
        <CardModal
          title="Add New Story"
          showCardModal={this.state.showCardModal}
          toggleCardModal={this.toggleCardModal}
          saveCard={this.props.actions.addNewCard}
        />
        <h1>Sprint</h1>
        <Button onClick={this.toggleCardModal}>Add Story</Button>
        <div className={classes.allSprintColumns}>
          <div className={classes.columnContainer}>
            <div className={classes.columnHeader}>To do</div>
            {this.props.sprint.todo.map((item, index) => <Card key={index} cardData={item} />)}
          </div>
          <div className={classes.columnContainer}>
            <div className={classes.columnHeader}>WIP</div>
            {this.props.sprint.workinprogress.map((item, index) => <Card key={index} cardData={item} />)}
          </div>
          <div className={classes.columnContainer}>
            <div className={classes.columnHeader}>Verification</div>
            {this.props.sprint.verification.map((item, index) => <Card key={index} cardData={item} />)}
          </div>
          <div className={classes.columnContainer}>
            <div className={classes.columnHeader}>Complete</div>
            {this.props.sprint.done.map((item, index) => <Card key={index} cardData={item} />)}
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

