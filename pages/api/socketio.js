import { Server } from 'socket.io'

const ioHandler = (req, res) => {
  if (!res.socket.server.io) {
    console.log('*First use, starting socket.io')

    const io = new Server(res.socket.server)
    const attachServerHandlers = (serverSocket) => {
      io.on('connection', serverSocket => {
        serverSocket.on('broadcast-client', msg => {
          serverSocket.broadcast.emit('broadcast-server' , msg)
        })
        serverSocket.on('jscode-client', (roomId, code) => {          
          io.to(roomId).emit('jscode-server', code)
        })
        serverSocket.on('join-room-client', (roomId, callback) => {
          serverSocket.join(roomId)
          if (callback)  callback();
        })
        // serverSocket.on('highlight-text-client' , (roomId , data) => {
        //   io.to(roomId).emit('highlight-text-server', data)
        // })
      })
    }
    attachServerHandlers(io)
    res.socket.server.io = io
  } 
  else {
    console.log('socket.io already running')
  }
  res.end()
}

export const config = {
  api: {
    bodyParser: false
  }
}

export default ioHandler