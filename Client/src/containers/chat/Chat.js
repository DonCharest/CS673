import React, { Component } from "react";
import { Container } from "reactstrap";
import socketIOClient from "socket.io-client";
import PropTypes from "prop-types";
import "./Chat.css";

Container.propTypes = {
  fluid: PropTypes.bool
};

class Chat extends Component {
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

    return (
      <Container>
        <div>
          <h1>Chat</h1>
          <hr />

          <div style={{ textAlign: "center" }}>
            {response ? (
              <p>The temperature in Florence is: {response} °F</p>
            ) : (
              <p>Loading...</p>
            )}
          </div>
        </div>
      </Container>
    );
  }
}

export default Chat;
