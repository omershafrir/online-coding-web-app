import React , {useEffect,useRef,useState} from 'react';
import { useRouter } from 'next/router';
import CodeFrame from '../components/CodeFrame';
import io  from "socket.io-client";


const sessionManager = require('../lib/services/sessionManager')
let socket
export default function editor(props) {
    const router = useRouter()
    const [msg , setMsg] = useState('hello all')
    // const [role, setRole] = useState(null)          //teacher (1st) || student (2nd) || watcher (3rd +)
    const role = useRef(null)
    function popUpAlert() {
        const result = window.confirm('Are you sure you want to go back?\n All changes will be lost.');
        if (result) 
            router.push('/tasks')
        else {
            return
        }
      }
    const {taskId} = router.query   

    useEffect(() => {
        fetch('/api/socketio').finally(() => {
          socket = io()
    
          socket.on('connect', () => {
            console.log('connect')
          })
    
          socket.on('disconnect', () => {
            console.log('disconnect')
          })
          socket.on('a user connected', () => {
            console.log('a user connected')
          })

          socket.on('update-input' , (text) =>{
            setMsg(text)
          })
        })
      }, []) 
    
      const sendMsg = (msg) => {
        setMsg(msg)
        socket.emit('input-change', msg)
      }
    //TODO: figure out what to do with ID'S
    /**
    useEffect(() => {
         const update = () => {
            if (!sessionManager.getTeacher(taskId)){
                sessionManager.setTeacher(taskId , 2)
                role.current='teacher'
                // setRole('teacher')
            }
            else if (!sessionManager.getStudent(taskId)){
                sessionManager.setStudent(taskId , 1)
                role.current='student'
                // setRole('student')
            }
            else {
                role.current='watcher'
                // setRole('watcher')
            }
        }
        update()
        return () => {
            if (role === 'student'){
                sessionManager.removeStudent(taskId,1)
                setRole(null)
            }
            else if (role === 'teacher'){
                sessionManager.removeTeacher(taskId,1)
                setRole(null)
            }
        }
    } )
     */
    return (
        <div>
            <h1> editor</h1>
            <button onClick={popUpAlert}> Back to task list</button>
            <input type="text" value={msg} onChange={(e) => sendMsg(e.target.value)} />
            <h1> {`Shared Text   :${  msg}`}</h1>
            <CodeFrame />
        </div>
    );
}

