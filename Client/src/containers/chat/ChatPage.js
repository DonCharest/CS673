import React, {Component} from 'react';
import socketIOClient from 'socket.io-client';
import './chatPage.css';

class ChatPage extends Component {

  constructor() {
    super();
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
      <div>
        <h1>Chat</h1>
        
        <div style={{ textAlign: "center" }}>
          {response
              ? <p>
                The temperature in Florence is: {response} °F
              </p>
              : <p>Loading...</p>}
        </div>

      </div>


    )
  }

}

export default ChatPage