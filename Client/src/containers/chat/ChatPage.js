import React, { Component } from "react";
import { Container, Button } from "reactstrap";
import { connect } from "react-redux";
import socketIOClient from "socket.io-client";
import PropTypes from "prop-types";
import * as classes from "./chatPage.css";

class chatPage extends Component {
  static propTypes = {
    auth: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      response: [],
      newMsg: ''
    };
    this.socket = socketIOClient();

    this.submitMsg = this.submitMsg.bind(this)
    this.updateMsg = this.updateMsg.bind(this)
  }

  componentDidMount() {
    this.socket.on('chat message', data => this.setState({ response: [...this.state.response, JSON.parse(data)]}));
  }

  updateMsg(e) {
    this.setState({newMsg: e.target.value})
  }

  submitMsg(e) {
    e.preventDefault()
    this.socket.emit('chat message', {message: this.state.newMsg, user: this.props.auth.user.name, project: 'default'});
    this.setState({newMsg: ''})
  }

  render() {
    const { response } = this.state;
    const { isAuthenticated, user } = this.props.auth;
    console.log('this.state', this.state)
    return (
      <Container>
        <div className="chat-page">
          <h1>Chat</h1>
          <hr />

          <p>
            <strong>{user ? `Welcome ${user.name}` : ""}</strong>
            {/* <strong>{user ? `Welcome ${user.email}` : ""}</strong> */}
          </p>
          <p>
            <strong>{user ? `Role: ${user.role}` : ""}</strong>
          </p>
          <p>
            <strong>{user ? `Projects: ${user.projects}` : ""}</strong>
          </p>
          {this.state.response.map((item, index) => {
            console.log('item', item)
            return (
              <div key={index} className={classes.singleChat}>
                <div className={classes.singleChatUser}>{item.user}:</div>
                <div className={classes.singleChatMessage}>{item.message}</div>
              </div>
            )

          })}
          <input type="text" value={this.state.newMsg} onChange={this.updateMsg} />
          <Button className="chat-button" color="primary" onClick={this.submitMsg}>
            Send a message
          </Button>
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
)(chatPage);
