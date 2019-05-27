import React, { Component } from "react";
import socketIOClient from "socket.io-client";

class App extends Component {
  constructor() {
    super();
    this.state = {
      chats: [],
      // endpoint: "http://127.0.0.1:4001/",
      // endpoint: "https://yhlu9.sse.codesandbox.io/",
      endpoint: "https://chat-room-backend-9646.herokuapp.com/",
      socket: false,
      userSet: false
    };
  }

  componentWillMount() {
    const { endpoint } = this.state;
    const socket = socketIOClient(endpoint);
    this.setState({ socket: socket });
  }

  componentDidMount() {
    let { socket, chats } = this.state;
    socket.on("Talk", data => {
      chats.push(data);
      this.setState({ chats: chats });
    });
  }

  componentWillUpdate() {
    const chatScroll = document.getElementById("chatScroll");
    chatScroll.scrollTop = chatScroll.scrollHeight - chatScroll.clientHeight;
  }

  onMsgChange = e => {
    console.log("Msg", e.target.value);
    this.setState({ userMsg: e.target.value });
  };

  onUserNameChange = e => {
    console.log("User", e.target.value);
    this.setState({ userName: e.target.value });
  };

  onUserSubmit = e => {
    const { userName } = this.state;
    e.preventDefault();
    console.log("User", userName);
    this.setState({ userSet: true });
  };

  onSendMsg = () => {
    console.log("Button Clicked");
    const { socket, userMsg, userName } = this.state;
    if (userMsg && userName) {
      const data = {
        userMsg: userMsg,
        userName: userName
      };
      this.refs.msg.value = "";
      this.setState({ userMsg: "" });
      socket.emit("Talk", data);
    }
  };
  render() {
    const { chats, userSet, userName } = this.state;
    return (
      <div>
        <div className="App" id="chatScroll">
          <div className="flex-container">
            {chats ? (
              chats.map((chat, id) => {
                return (
                  <div key={id} style={{ paddingLeft: 10 }}>
                    <p style={{ color: "#575ed8" }}>
                      <span id="chatUser">{chat.userName}</span> :{" "}
                      <span id="chatMsg">{chat.userMsg}</span>
                    </p>
                  </div>
                );
              })
            ) : (
              <p> L O A D I N G ....</p>
            )}
          </div>
        </div>
        <div id="footer">
          {userSet ? (
            <div>
              <div className="input-container">
                <input
                  className="msg"
                  id="user"
                  type="text"
                  value={userName}
                  disabled={true}
                />
                <input
                  ref="msg"
                  className="msg"
                  type="text"
                  placeholder="Message"
                  onChange={this.onMsgChange}
                />
              </div>
              <button onClick={this.onSendMsg}>Send </button>
            </div>
          ) : (
            <div>
              <div className="input-container">
                <form onSubmit={this.onUserSubmit}>
                  <input
                    className="msg"
                    type="text"
                    placeholder="User Name"
                    onChange={this.onUserNameChange}
                  />
                </form>
                <input
                  ref="msg"
                  type="text"
                  className="msg"
                  placeholder="Message"
                  onChange={this.onMsgChange}
                />
              </div>
              <button onClick={this.onSendMsg}>Send </button>
            </div>
          )}
        </div>
      </div>
    );
  }
}
export default App;
