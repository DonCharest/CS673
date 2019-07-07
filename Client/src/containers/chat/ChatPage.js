import React, { Component } from "react";
import { Container, Button } from "reactstrap";
import { connect } from "react-redux";
import socketIOClient from "socket.io-client";
import PropTypes from "prop-types";
import "./chatPage.css";

class chatPage extends Component {
  static propTypes = {
    auth: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      response: false,
      endpoint: "http://127.0.0.1:4001"
    };
  }

  componentDidMount() {
    const { endpoint } = this.state;
    const socket = socketIOClient(endpoint);
    socket.on("FromAPI", data => this.setState({ response: data }));
  }

  // $(function(){
  //         var socket = io();
  //         $('form').submit(function(e){
  //             /* Block page reload.
  //                 Emit the message text as a 'chat message' event.
  //                 Reset the value of the message box.
  //             */
  //             e.preventDefault();
  //             socket.emit('chat message', $('#m').val());
  //             $('#m').val('');
  //             return false;
  //         });

  //         // When a message is received, append it to the text message list.
  //         socket.on('chat message', function(msg){
  //             $('#messages').append($('<li>').text(msg));
  //         });
  //     });

  // <ul id="messages"></ul>
  //     <form action="">
  //         <input type="text" id="m" autocomplete="off" /><button>SEND</button>
  //     </form>

  render() {
    const { response } = this.state;
    const { isAuthenticated, user } = this.props.auth;

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
          <Button className="chat-button" color="primary">
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
