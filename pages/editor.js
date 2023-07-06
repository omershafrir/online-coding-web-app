import React , {useEffect,useRef,useState} from 'react';
import { useRouter } from 'next/router';
import CodeFrame from '../components/CodeFrame';
import io  from "socket.io-client";
import {debug} from '../lib/services/sessionManager'

const sessionManager = require('../lib/services/sessionManager')
let clientSocket
export default function Editor(props) {
    const router = useRouter()
    const [broadcast , setBroadcast] = useState('hello all')
    const [roomMsg , setRoomMsg] = useState('hello room')
    const roomId = useRef(null)
    // const clientSocket = useRef(null)
    function popUpAlert() {
        const result = window.confirm('Are you sure you want to go back?\n All changes will be lost.');
        if (result) 
            router.push('/tasks')
        else {
            return
        }
      }
      roomId.current = router.query.id   
    // initalizing / activating the client side socket + attaching handlers for proper functionality
    useEffect(() => {
        fetch('/api/socketio').finally(() => {
        clientSocket = io()
        const attachClientHandlers = (clientSocket) => {
            clientSocket.on('connect', () => {
            console.log(`client #${clientSocket.id} connected to room ${roomId.current}`)
          })
            clientSocket.on('broadcast-server', (msg) => {
                setBroadcast(msg)
            })
            clientSocket.on('room-msg-server', (msg) => {
                console.log("incoming room-msg at client")
                setRoomMsg(msg)
            })
        }
          clientSocket.emit('join-room-client' , roomId.current, () => {
            console.log(`${clientSocket.id} joined room ${roomId.current}`)
          })
        //   clientSocket.emit('broadcast-client', "broad" )
        //   clientSocket.emit('test' , "test broad")
        


        attachClientHandlers(clientSocket) })
      }, []) 
    
      const sendToAll = (msg) => {
        setBroadcast(msg)
        clientSocket.emit('broadcast-client', msg )
      }
      const sendToRoom = (roomId , msg) => {
        setRoomMsg(msg)
        clientSocket.emit('room-msg-client', roomId.current, msg )
      }
    return (
        <div>
            <h1> editor</h1>
            <button onClick={() => router.push('/tasks')}> Back to task list</button>
            <input type="text" value={broadcast} onChange={(e) => sendToAll(e.target.value)} />
            <h1> {`Broadcast Text   :${  broadcast}`}</h1>
            <br />
            <input type="text" value={roomMsg} onChange={(e) => sendToRoom(roomId , e.target.value)} />
            <h1> {`Room Text   :${  roomMsg}`}</h1>
            {/* <button onClick={() => joinRoom(2)}> join room 2</button> */}
            <CodeFrame />
        </div>
    );
}

