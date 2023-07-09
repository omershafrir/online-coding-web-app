import { Server } from 'socket.io'
import { getAllUsers ,removeUser } from '../../lib/mongo'
import { getTime } from '../../lib/services/utils'

// map that contains {clientId : timeout} pairs
// used by the server to keep track of clients, delete inactive clients from the db 
let timeoutMap = {}

const sendHeartbeat = (io , clientId) => {
  const waitForHeartbeat =  () =>  {
    const timeout = setTimeout( async () => {
  
      const deletedUser = await removeUser(clientId)
      console.log(`time is (when removing user): ${getTime()}\n`)
      console.log(`${`removing client${deletedUser}`}\n`)
      
      }, 5000); 
      timeoutMap[clientId] = timeout
      return timeout
  }
  console.log("server sent heartbeat")
  waitForHeartbeat()
  io.to(clientId).emit('heartbeat-server' , clientId)
  
}


const ioHandler = (req, res) => {
  if (!res.socket.server.io) {
    console.log('*First use, starting socket.io')

    const io = new Server(res.socket.server)
    const initServerHeartbets = () => {
      setInterval(async ()  =>    {
        const users = await getAllUsers()
        console.log(`time is (when server sends heartbeat): ${getTime()}\n`)
        console.log(`users logged in: ${users}\n`)
        users.forEach((clientId) => sendHeartbeat(io,clientId))
      } , 10000)
    }
    initServerHeartbets()

    // all of the servcer socket relevent handlers
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
        serverSocket.on('heartbeat-client' , (clientId) => {
          clearTimeout(timeoutMap[clientId]);
        })

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