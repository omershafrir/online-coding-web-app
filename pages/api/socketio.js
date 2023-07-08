import { Server } from 'socket.io'
import { getAllUsers ,removeUser } from '../../lib/mongo'


// map that contains {clientId : timeout} pairs
// used by the server to keep track of clients, delete inactive clients from the db 
let timeoutMap = {}


const sendHeartbeat = (io , clientId) => {
  const waitForHeartbeat =  () =>  {
    const timeout = setTimeout( async () => {
  
      await removeUser(clientId)
      console.log(`${`removing client${clientId}`}\n`)
      
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
    
    // all of the servcer socket relevent handlers
    const attachServerHandlers = (serverSocket) => {

      io.on('connection', serverSocket => {
        setInterval(async ()  =>    {
                                      const users = await getAllUsers()
                                      console.log(`getAllUsers value is: ${users}\n`)
                                      users.forEach((clientId) => sendHeartbeat(io,clientId))

                                    } , 10000)

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