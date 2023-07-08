import React , {useEffect,useRef,useState} from 'react';
import { useRouter } from 'next/router';
import io  from "socket.io-client";
import styles from '../styles/Home.module.css'
import { getSingleTask} from '../lib/mongo';
import "highlight.js/styles/github.css";
import hljs from "highlight.js";
import {default as MonacoEditor}  from '@monaco-editor/react';
import { debounce } from '../lib/services/utils';

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
    const {id: taskId ,title:taskTitle ,  content: taskContent, solution: taskSolution} = task
    const router = useRouter()
    const [JSCode , setJSCode] = useState("")
    const [highlightedJSCode, setHighlightedJSCode ] = useState(null)
    const [theme, setTheme] = useState('vs-light')
    const [role, setRole] = useState(null)
    const roomId = useRef(null)
    const clientSocketId = useRef(null) 
    const editorRef = useRef(null); 

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
    function handleEditorDidMount(editor, monaco) {
      editorRef.current = editor;
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
      if (roomData)
          syncRoomData(roomData , clientSocketId.current)
      clientSocketId.current = null
      logRoomDetails(roomData)
    }
    const sendJSCode = (roomId , code) => {
      if (role === 'student'){
        setJSCode(code)
        clientSocket.emit('jscode-client', roomId, code )
      }
    }
    const debouncedSendJSCode = debounce(sendJSCode , 200)

    const cleanupFunction = () => {
      // 'cleanup' function to be called before page unloading
      console.log('Cleanup function is running (when refresh).');
      onDisconnect()
    };

    // initalizing / activating the client side socket + attaching handlers for proper functionality
    useEffect(() => {

      //adding this event listener for handling refreshes at the client
      //because refresh does not trigger cleanup function of effect
      window.addEventListener('beforeunload', cleanupFunction);
      setJSCode(taskContent) 
      roomId.current = taskId 
      // hljs.highlightAll();
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
              console.log("input from server")         
              setJSCode(code)
            })

            clientSocket.on('highlight-text-server', ({text , location}) => {
              setHighlightedJSCode({ text, location });
            })
            clientSocket.on('disconnect', onDisconnect)

          clientSocket.emit('join-room-client' , roomId.current, () => {
            console.log(`${clientSocketId.current} joined room ${roomId.current}`)
          })

      })
      // editorRef.current.onDidChangeCursorSelection(handleSelectionChange);
      // editorRef.current.updateOptions({
      //   readOnlyMessage: "Can't write as mentor",
      // })


        return () => {
          console.log("Cleanup function is running (when rerouting).")
          clientSocket.disconnect()
          window.removeEventListener('beforeunload', cleanupFunction);
        }
      }, []) 
    
    //effect of changing the highlighted text 
    // useEffect(() => {
    //   if (editorRef.current && highlightedJSCode) {
    //     const model = editorRef.current.getModel();
    //     const decorations = model.deltaDecorations([], [
    //       {
    //         range: new monaco.Range(
    //           highlightedJSCode.location.startLine,
    //           highlightedJSCode.location.startColumn,
    //           highlightedJSCode.location.endLine,
    //           highlightedJSCode.location.endColumn
    //         ),
    //         options: { inlineClassName: 'highlighted-line' }
    //       }
    //     ]);
  
    //     return () => {
    //       model.deltaDecorations(decorations, []);
    //     };
    //   }
    // }, [highlightedJSCode]);




      // const handleSelectionChange = () => {
      //   const selection = editorRef.current.getSelection();
      //   const selectedText = model.getValueInRange(selection);

      //   if (selectedText.length > 0) {
      //     const location = {
      //       startLine: selection.startLineNumber,
      //       startColumn: selection.startColumn,
      //       endLine: selection.endLineNumber,
      //       endColumn: selection.endColumn
      //     };
      //     socket.emit('highlight-text-client', roomId ,{ text: selectedText, location });
      //   }
      // };
      
    return (
        <div className={styles.editor}>
            {/* <h1> editor</h1> */}
              <br />
              <div className={styles.editorToolbar}>
              { <a className={styles.info}> {taskTitle} </a>}
              { role && <a className={styles.info} > {`Connected as: ${role.charAt(0).toUpperCase() + role.slice(1)}`} </a>}
              </div>
              <MonacoEditor
                  height="520px"
                  width="1000px"
                  language="javascript"
                  theme={theme}
                  value={JSCode}
                  options={{readOnly:role != 'student' ? true : false,
                            fontSize: 20,
                            quickSuggestions: false,
                            scrollBeyondLastLine: false
                            }}
                  onChange={(newCode , event) => debouncedSendJSCode(roomId.current , newCode)}
                  // onChange={(newCode , event) => sendJSCode(roomId.current , newCode) }
                  onMount={handleEditorDidMount}
              />
              <button className={styles.button} onClick={checkSolution}> Submit </button>
              <button className={styles.button} onClick={() => setTheme(theme === 'vs-dark' ? 'vs-light' : 'vs-dark')}> {`Switch to ${theme} Theme `}</button>
        </div>
    );
}




