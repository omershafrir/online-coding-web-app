import React , {useEffect,useRef,useState} from 'react';
import { useRouter } from 'next/router';
import io  from "socket.io-client";
import styles from '../styles/Home.module.css'
import { getSingleTask} from '../lib/mongo';
import "highlight.js/styles/github.css";
import hljs from "highlight.js";
import dynamic from 'next/dynamic';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import {default as MonacoEditor}  from '@monaco-editor/react';




export const getServerSideProps = async (context) => {
  const {id} = context.query
  const task = await getSingleTask(id)
  return {
      props: {
        task  
      }
    };
}


let clientSocket


export default function Editor({task}) {
    const {id: taskId , content: taskContent, solution: taskSolution} = task
    const router = useRouter()
    const [JSCode , setJSCode] = useState("")
    const [theme, setTheme] = useState('vs-light')
    const [role, setRole] = useState(null)
    const roomId = useRef(null)
    const clientSocketId = useRef(null) 
    const monacoEditorRef = useRef(null)   
    function popUpAlert() {
        const result = window.confirm('Are you sure you want to go back?\n All changes will be lost.');
        if (result) 
            router.push('/tasks')
        else {
            return
        }
    }
    function checkSolution(){
      if (JSCode === taskSolution)
        alert('Correct!')
      else
        alert('Try Again')
    }
    function syncRoomData(roomData , socketId){
      if (roomData.mentorId === socketId)
        setRole('mentor')
      else if (roomData.studentId === socketId) 
        setRole('student')
      else
        setRole('watcher')
    }
    function logRoomDetails(roomData){
      console.log(`room state is :\n id:${roomData.id}\n mentor:${roomData.mentorId}\n student:${roomData.studentId}` )
    }

    const onDisconnect = async ()  => {
      console.log(`client #${clientSocketId.current} disconnected from room#${roomId.current}`)
      const room = await fetch(`/api/mongo`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({action:'remove-client' , 
                                taskId: roomId.current, 
                                clientId: clientSocketId.current })
        })
      const roomData =  await room.json()
      console.log("roomData: " + JSON.stringify(roomData))
      if (roomData)
          syncRoomData(roomData , clientSocketId.current)
      clientSocketId.current = null
      logRoomDetails(roomData)
    }
    const refreshHandler = () => {
      alert("yo")
    }

      roomId.current = taskId
    // initalizing / activating the client side socket + attaching handlers for proper functionality
    useEffect(() => {
      // monacoEditorRef.current.updateOptions({
      //   readOnlyEmptyEditable: "Can't write as mentor",
      // })
      setJSCode(taskContent)  
      hljs.highlightAll();
        fetch('/api/socketio').finally(() => {
            clientSocket = io();
            clientSocket.on('connect', async () =>  {
              clientSocketId.current = clientSocket.id
              console.log(`client #${clientSocketId.current} connected to room#${roomId.current}`)
              const room = await fetch(`/api/mongo`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({action:'set-client' , 
                                        taskId: roomId.current, 
                                        clientId: clientSocketId.current })
                })
              const roomData =  await room.json()
              syncRoomData(roomData , clientSocketId.current)
              logRoomDetails(roomData)
            })

            clientSocket.on('jscode-server', (code) => {
              console.log(`${"reciecing js code from server"}\n`)
              
              setJSCode(code)
            })

            clientSocket.on('disconnect', onDisconnect)
            // window.addEventListener('before-unload' , refreshHandler)
          clientSocket.emit('join-room-client' , roomId.current, () => {
            console.log(`${clientSocketId.current} joined room ${roomId.current}`)
          })

      })

        return () => {
          console.log("cleanup!")
          // window.removeEventListener('beforeunload', refreshHandler);
          clientSocket.disconnect()
        }
      }, []) 

      const sendJSCode = (roomId , code) => {
        if (role === 'student'){
          setJSCode(code)
          clientSocket.emit('jscode-client', roomId, code )
        }
      }
    return (
        <div className={styles.editor}>
            {/* <h1> editor</h1> */}
            <button onClick={() => router.push('/tasks')}> Back to task list</button>
            <div className={styles.editArea}> 
              <br />
              <div>


              <MonacoEditor
                  height="500px"
                  width="800px"
                  language="javascript"
                  theme={theme}
                  value={JSCode}
                  options={{readOnly:role != 'student' ? true : false}}
                  onChange={(newCode , event) => sendJSCode(roomId.current , newCode)}
              />
                            </div>
              <button onClick={checkSolution}> Submit </button>
              <button onClick={() => setTheme(theme === 'vs-dark' ? 'vs-light' : 'vs-dark')}> {`Switch to ${theme} Theme `}</button>
            </div>
        </div>
    );
}




