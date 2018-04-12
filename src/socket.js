import socketIOClient from 'socket.io-client'

const socketConnection = socketIOClient('http://10.0.0.49:4001/');

export default socketConnection;