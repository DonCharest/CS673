import React, {Component} from "react";
import { connect } from "react-redux";
import {bindActionCreators} from 'redux';
import { Container } from "reactstrap";
import PropTypes from "prop-types";
import {Button, Modal, Form} from 'react-bootstrap';
import * as classes from "../app.css";
import * as actions from '../actions/projectActions';

class ProjectsDropdown extends Component {
  componentDidMount() {
    this.props.actions.getProjects()
  }


  render() {
    return (
      <div>
        <Form.Group controlId="projects">
          <Form.Label>Projects</Form.Label>
          <Form.Control 
            as="select" 
            name={this.props.name} 
            onChange={this.props.onChange}
            value={this.props.value}
            >
            <option key="blank" value="">Select</option>
          {this.props.projects.map((item) => {
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
    projects: state.project.projects,
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
)(ProjectsDropdown);