import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import PropTypes from "prop-types";
import { FormGroup, Label, Input } from "reactstrap";
import * as classes from "../app.css";
import * as actions from "../actions/projectActions";

class ProjectsDropdown extends Component {
  componentDidMount() {
    if (this.props.projects.length > 0) {
      this.props.onChange({ target: { value: this.props.projects[0]._id } });
    } else {
      this.props.actions.getProjects();
    }
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.projects.length !== prevProps.projects.length &&
      this.props.projects.length > 0
    ) {
      this.props.onChange({ target: { value: this.props.projects[0]._id } });        
    }
  }

  render() {
    return (
      <div>
        <FormGroup>
          <Label for={this.props.dropdownId || "projectsDropdown"}>
            Projects
          </Label>

          <Input
            id={this.props.dropdownId || "projectDropdown"}
            type="select"
            name={this.props.name}
            onChange={this.props.onChange}
            value={this.props.value}
          >
            <option key="blank" value="">
              Select
            </option>
            {this.props.projects.map(item => {
              return (
                <option key={item._id} value={item._id}>
                  {item.name}
                </option>
              );
            })}
          </Input>
        </FormGroup>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    projects: state.project.projects,
    activeProject: state.activeProject
  };
};

const mapDispatchToProps = dispatch => {
  return {
    actions: bindActionCreators({ ...actions }, dispatch)
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProjectsDropdown);
