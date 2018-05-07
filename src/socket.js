import socketIOClient from 'socket.io-client'

const socketConnection = socketIOClient('https://pure-savannah-41765.herokuapp.com:4001/');

export default socketConnection;