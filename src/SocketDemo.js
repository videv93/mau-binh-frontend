import {Component} from "react";
import socket from "./socket";

class SocketDemo extends Component {
  constructor() {
    super()
    this.state = {
      color: 'white'
    }
  }
  setColor = (color) => {
    this.setState({color})
  }
  send = () => {
    socket.emit('change color', this.state.color);
  }
  render() {
    socket.on('change color', (color) => {
      document.body.style.backgroundColor = color
    });
    return (
      <div style={{textAlign: 'center'}}>
        <p>Making sure this works</p>
        <button onClick={() => this.send()}>Change Color</button>
        <button id="blue" onClick={() => this.setColor('blue')}>Blue</button>
        <button id="red" onClick={() => this.setColor('red')}>Red</button>
      </div>
    );
  }
}