import React , {useEffect,useRef,useState} from 'react';
import { useRouter } from 'next/router';
import io  from "socket.io-client";
import styles from '../styles/Home.module.css'
import { getSingleTask} from '../lib/mongo';
export const getServerSideProps = async (context) => {
  const {id} = context.query
  const task = await getSingleTask(id)
  return {
      props: {
        task  
      }
    };
}

const sessionManager = require('../lib/services/sessionManager')

let clientSocket


export default function Editor({task}) {
    const {id: taskId , content: taskContent, solution: taskSolution} = task
    const router = useRouter()
    const [broadcast , setBroadcast] = useState('hello all')
    const [roomMsg , setRoomMsg] = useState('hello room')
    const [theme, setTheme] = useState('Light')
    const [role, setRole] = useState('null')
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
    function checkSolution(){
      if (roomMsg === taskSolution)
        alert('Correct!')
      else
        alert('Try Again')
    }
      roomId.current = router.query.id
    // initalizing / activating the client side socket + attaching handlers for proper functionality
    useEffect(() => {
      setRoomMsg(taskContent)  
        fetch('/api/socketio').finally(() => {
        clientSocket = io()
        const attachClientHandlers = async (clientSocket) => {

            clientSocket.on('connect', async () =>  {
            console.log(`client #${clientSocket.id} connected to room#${roomId.current}`)
            const room = await fetch(`/api/mongo`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({action:'set-client' , 
                                      taskId: roomId.current, 
                                      clientId: clientSocket.id })
              })
            const roomData =  await room.json()
          })

            clientSocket.on('broadcast-server', (msg) => {
                setBroadcast(msg)
            })
            clientSocket.on('room-msg-server', (msg) => {
                setRoomMsg(msg)
            })
            clientSocket.on('disconnect' , () => {
              console.log(`client disconnected from room#${roomId.current}`)
            })
        }
          clientSocket.emit('join-room-client' , roomId.current, () => {
            console.log(`${clientSocket.id} joined room ${roomId.current}`)
          })

        attachClientHandlers(clientSocket) })
        return () => {
          console.log("cleanup!")
          // clientSocket.disconnect()
        }
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
            {/* <input className={styles.codeBox} type="text" value={roomMsg} onChange={(e) => sendToRoom(roomId , e.target.value)} /> */}
            <textarea value={roomMsg} className={styles.codeBox} onChange={(e) => sendToRoom(roomId , e.target.value)}></textarea>
            <button onClick={checkSolution}> Submit </button>
            <button onClick={() => setTheme(theme === 'Dark' ? 'Light' : 'Dark')}> {`Switch to ${theme} Theme `}</button>
        </div>
    );
}

