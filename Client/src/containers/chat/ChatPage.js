import React, { Component } from "react";
import axios from "axios";
import { Container, Button } from "reactstrap";
import { connect } from "react-redux";
import socketIOClient from "socket.io-client";
import PropTypes from "prop-types";
import * as classes from "./chatPage.css";
import * as classes1 from "../../app.css";
import ProjectsDropdown from "../../components/ProjectsDropdown";

class chatPage extends Component {
  static propTypes = {
    auth: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      response: [],
      newMsg: "",
      projectId: ""
    };
    this.socket = socketIOClient();

    this.submitMsg = this.submitMsg.bind(this);
    this.updateMsg = this.updateMsg.bind(this);
    this.onChangeProject = this.onChangeProject.bind(this);
    this.autoSelectProject = this.autoSelectProject.bind(this);
    this.scrollToBottom = this.scrollToBottom.bind(this);
  }

  componentDidMount() {
    this.socket.on("chat message", data =>
      this.setState({ response: [...this.state.response, JSON.parse(data)] })
    );
    this.autoSelectProject();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.projects.length !== this.props.projects.length) {
      this.autoSelectProject();
    }
  }

  autoSelectProject() {
    if (this.props.projects.length > 0) {
      this.onChangeProject({ target: { value: this.props.projects[0]._id } });
    }
  }

  scrollToBottom() {
    this.el.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "start"
    });
  }

  onChangeProject(e) {
    this.setState({ response: [], projectId: e.target.value });

    axios
      .get(`/api/chat/${e.target.value}`)
      .then(res => {
        this.setState({ response: res.data.chat });
        this.scrollToBottom();
      })
      .catch(err => {
        console.error(err);
      });
  }

  updateMsg(e) {
    this.setState({ newMsg: e.target.value });
  }

  submitMsg(e) {
    e.preventDefault();
    this.socket.emit("chat message", {
      message: this.state.newMsg,
      user: this.props.auth.user.name,
      project: this.state.projectId
    });
    setTimeout(() => {
      this.scrollToBottom();
    }, 1000);

    this.setState({ newMsg: "" });
  }

  getDate(timeStamp) {
    const date = new Date(timeStamp);
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    ];
    return `${monthNames[date.getMonth()]} ${date.getDate()} at ${
      date.getHours() > 12 ? date.getHours() - 12 : date.getHours()
    }:${(date.getMinutes() < 10 ? "0" : "") + date.getMinutes()}${
      date.getHours() >= 12 ? " pm" : " am"
    }`;
  }

  render() {
    const { response } = this.state;
    const { isAuthenticated, user } = this.props.auth;
    return (
      <Container>
        <div className="chat-page">
          <h1>Chat</h1>
          <hr />

          <ProjectsDropdown
            value={this.state.projectId}
            name="project"
            onChange={this.onChangeProject}
          />

          <div className={classes.chatWindow}>
            {this.state.response.map((item, index) => {
              return (
                <div key={index}>
                  <div>{this.getDate(item.datestamp)}</div>
                  <div className={classes.singleChat}>
                    <div className={classes.singleChatUser}>{item.user}:</div>
                    <div className={classes.singleChatMessage}>
                      {item.message}
                    </div>
                  </div>
                </div>
              );
            })}
            <div
              ref={el => {
                this.el = el;
              }}
            >
              {" "}
            </div>
          </div>
          <form onSubmit={this.submitMsg}>
            <input
              className={classes.chatMessageInput}
              type="text"
              // size="64"
              value={this.state.newMsg}
              onChange={this.updateMsg}
            />
            <Button
              className={classes1.customButtonDark}
              type="submit"
              color="dark"
              onClick={this.submitMsg}
            >
              Send a message
            </Button>
          </form>
        </div>
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
  projects: state.project.projects
});

export default connect(
  mapStateToProps,
  null
)(chatPage);
