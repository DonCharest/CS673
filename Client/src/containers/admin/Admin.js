import React, { Component } from "react";
import { Container, ListGroup, ListGroupItem, Button } from "reactstrap";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { connect } from "react-redux";
import RegisterModal from "../auth/RegisterModal";
//import ItemModel from "../item/itemModal";
import { getItems, deleteItem } from "../../actions/itemActions";
import PropTypes from "prop-types";

class Admin extends Component {
  static propTypes = {
    getItems: PropTypes.func.isRequired,
    item: PropTypes.object.isRequired,
    isAuthenticated: PropTypes.bool
  };

  componentDidMount() {
    this.props.getItems();
  }

  onDeleteClick = id => {
    this.props.deleteItem(id);
  };

  render() {
    const { items } = this.props.item;
    return (
      <Container>
        <div>
          <h1>Admin Page</h1>
          <hr />
          <div>
            <p>View/Edit Projects:</p>
          </div>
          <div>
            <p>View/Edit Users:</p>
            <RegisterModal />
          </div>
          <div>
            <p>View/Edit Spints:</p>
          </div>
        </div>
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  item: state.item,
  isAuthenticated: state.auth.isAuthenticated
});

export default connect(
  mapStateToProps,
  { getItems, deleteItem }
)(Admin);
