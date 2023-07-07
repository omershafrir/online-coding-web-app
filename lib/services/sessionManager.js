export let debug = false
export let rooms = new Map() // {roomId: {mentor: string , student: string}}
const cache = require('memory-cache');
cache.put('counter' , 0)
export const count = () => {
    const counter = cache.get('counter')
    console.log("Counter is: "+counter)
    cache.put('counter',counter+1)
    return counter-1;
}
// global.Memory = new Map()
// class Memory {
//     constructor(){
//         this.data = {}
//     }
// }

// const instance = new Memory();
// export default instance;













// export function setClient(taskId, clientId){
//     let ret
//     console.log(`handling client:\n taskid:${taskId}\n clientId:${clientId} `)
//     console.log(`rooms is now:\n${rooms}`)
//     taskId = String(taskId)
//     const room = rooms.get(taskId);
//     if (!room) {
//         const newRoom = {
//             mentor: clientId,
//             student: null
//         }
//         rooms.set(taskId, newRoom);
//         ret = 'mentor'
//     } 
//     else if (!room.student) {
//         room.student = clientId
//         ret =  'student'
//     } 
//     else ret = null;
//     console.log( `rooms after new user are (in SERVER):${JSON.stringify(rooms)}`)
//     return ret
// }

// export function removeClient(taskId , clientId) {
//     taskId = String(taskId)
//     if (rooms.taskId.student === clientId){
//         rooms.taskId.student = undefined
//     }
//     else if (rooms.taskId.mentor === clientId){
//         rooms.taskId.mentor = undefined
//     }
// }

// export function getStudent(taskId) {
//     return students[taskId];
// }
// export function getTeacher(taskId) {
//     return teachers[taskId];
// }
// export function toggleDebug(){
//     debug = !debug
//     console.log(`debug mode is:${debug ? 'ON' : 'OFF'}`)
// }

export default module
