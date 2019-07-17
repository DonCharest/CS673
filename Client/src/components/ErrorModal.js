import React, {Component} from "react";
import { connect } from "react-redux";
import {bindActionCreators} from 'redux';
import PropTypes from "prop-types";
import {Button, 
  Modal, 
  ModalHeader, 
  ModalBody, 
  ModalFooter} from 'reactstrap';
import * as classes from "../app.css";
import * as actions from '../actions/appErrorActions';

class ErrorModal extends Component {



  render() {
    return (
    <div>
      <Modal isOpen={this.props.appError.showModal} toggle={this.props.actions.clearErrors}>
        <ModalHeader toggle={this.props.actions.clearErrors}>
           {this.props.appError.title ? this.props.appError.title : 'Error'}
        </ModalHeader>
        <ModalBody>
          {this.props.appError.location && <div>Error occurred at {this.props.appError.location}</div>}
          {this.props.appError.msg && <div>{this.props.appError.msg}</div>}
          {this.props.appError.statusCode && <div>Status Code:{this.props.appError.statusCode}</div>}
            
          
        </ModalBody>

        <ModalFooter>
          <Button color="secondary"  onClick={this.props.actions.clearErrors}>Close</Button>
        </ModalFooter>
      </Modal>

    </div>
  );
  }
  
};

const mapStateToProps = (state) => {
  return {
    appError: state.appError
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
)(ErrorModal);
