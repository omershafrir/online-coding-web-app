export let debug = false
let students = [null,null,null,null,null]
let teachers = [null,null,null,null,null]


export function setStudent(taskId, studentId) {
    students[taskId] = studentId;
    if(debug)
        console.log(`Assigning user#${studentId} as a student to task num#${taskId} `)
}
export function setTeacher(taskId, teacherId) {
    teachers[taskId] = teacherId;
    if(debug)
        console.log(`Assigning user#${teacherId} as a teacher to task num#${taskId} `)
}
export function removeStudent(taskId, studentId){
    students[taskId] = null;
    if(debug)
        console.log(`Removing user#${studentId} (student) from task num#${taskId} `)
}
export function removeTeacher(taskId, teacherId){
    teachers[taskId] = null;
    if(debug)
        console.log(`Removing user#${teacherId} (teacher) from task num#${taskId} `)
}
export function getStudent(taskId) {
    return students[taskId];
}
export function getTeacher(taskId) {
    return teachers[taskId];
}
export function toggleDebug(){
    debug = !debug
    console.log(`debug mode is:${debug ? 'ON' : 'OFF'}`)
}
