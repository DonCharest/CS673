import React, { Component } from "react";
import { Container } from "reactstrap";
import { connect } from "react-redux";
import PropTypes from "prop-types";

class ChatMessage extends Component {
  static propTypes = {
    auth: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.changeView = this.changeView.bind(this);
  }
  changeView() {
    this.props.changeView("signup");
  }

  render() {
    const { isAuthenticated, user } = this.props.auth;

    return (
      <Container>
        <div className="chat-message">
          <h1>Chat</h1>
          <hr />
          {/* <strong>{isAuthenticated ? "Yes" : "No"}</strong> */}
          <p>
            <strong>{user ? `Welcome ${user.name}` : ""}</strong>
          </p>
          <button className="chat-button" onClick={this.changeView}>
            Send a message
          </button>
        </div>
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  null
)(ChatMessage);
