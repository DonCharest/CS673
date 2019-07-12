import React, {Component} from "react";
import { connect } from "react-redux";
import {bindActionCreators} from 'redux';
import { Container } from "reactstrap";
import PropTypes from "prop-types";
import {Button, Modal, Form} from 'react-bootstrap';
import * as classes from "../app.css";
import CardModal from './CardModal'
import * as actions from '../actions/sprintActions';

class Card extends Component {
  constructor(props) {
    super(props)

    this.state = {
      showCardModal: false
    }

    this.toggleCardModal = this.toggleCardModal.bind(this);
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
      <div className={classes.card}>
        <CardModal
          title="Edit Story"
          showCardModal={this.state.showCardModal}
          toggleCardModal={this.toggleCardModal}
          saveCard={this.props.actions.editCard}
          description={this.props.description}
          cardId={this.props.id}
          deleteCard={this.props.actions.deleteCard}
        />
        
        <div className={classes.cardDescription}>
          {this.props.description}
        </div>

        <Button onClick={this.toggleCardModal}>Edit</Button>
      </div>
    );
  }
  
};




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
)(Card);