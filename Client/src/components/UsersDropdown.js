import React, {Component} from "react";
import { connect } from "react-redux";
import {bindActionCreators} from 'redux';
import { Container } from "reactstrap";
import PropTypes from "prop-types";
import {Button, Modal, Form} from 'react-bootstrap';
import * as classes from "../app.css";
import * as actions from '../actions/userActions';

class UsersDropdown extends Component {

  componentDidMount() {
    this.props.actions.getUsers()
  }


  render() {
    return (
      <div>
        <Form.Group controlId="users">
          <Form.Label>Users</Form.Label>
          <Form.Control 
            as="select" 
              name={this.props.name}
              onChange={this.props.onChange}
              value={this.props.value} >
            <option key="blank" value="">Select</option>
            {this.props.users.map((item) => {
              return <option key={item._id} value={item._id}>{item.name}</option>
            })}
          </Form.Control>
        </Form.Group>
      </div>
    );
  }
  
};




const mapStateToProps = (state) => {
  return {
    users: state.user.users,
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
)(UsersDropdown);