import React, { Component } from "react";
import { Container } from "reactstrap";
import { connect } from "react-redux";
import PropTypes from "prop-types";

class BacklogPage extends Component {
  static propTypes = {
    isAuthenticated: PropTypes.bool
  };

  render() {
    return (
      <Container>
        <div>
          <h1>BackLog</h1>
          <hr />
        </div>
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
});

export default connect(
  mapStateToProps,
  null
)(BacklogPage);
