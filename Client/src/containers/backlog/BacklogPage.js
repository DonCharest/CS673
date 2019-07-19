import React, { Component } from "react";
import { connect } from "react-redux";
import {bindActionCreators} from 'redux';
import {Container, Button} from 'reactstrap';
import PropTypes from "prop-types";
import CardModal from '../../components/CardModal'
import Card from '../../components/Card'
import * as classes from '../../app.css';
import * as actions from '../../actions/sprintActions';
import ProjectsDropdown from '../../components/ProjectsDropdown'

class BacklogPage extends Component {
  static propTypes = {
    isAuthenticated: PropTypes.bool
  };

  constructor(props) {
    super(props)

    this.state = {
      showCardModal: false,
      projectId: ''
    }

    this.onChangeProject = this.onChangeProject.bind(this)
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

  onChangeProject(e) {
    this.setState({projectId: e.target.value})
    this.props.actions.getCards(e.target.value)
    
  }

  render() {
    return (
      <Container>
        <div className={classes.pageHeader}>
          <CardModal
            title="Add New Story"
            showCardModal={this.state.showCardModal}
            toggleCardModal={this.toggleCardModal}
            saveCard={this.props.actions.addNewCard}
          />

          <h1>BackLog</h1>
          <Button onClick={this.toggleCardModal}>Add Story</Button>
          <ProjectsDropdown
            value = {this.state.projectId}
            name="project"
            onChange={this.onChangeProject}
          />
        </div>
        <div className={classes.allSprintColumns}>
          <div className={classes.columnContainer}>
            {this.props.sprint.backlog.map((item, index) => <Card key={index} cardData={item} />)}
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
