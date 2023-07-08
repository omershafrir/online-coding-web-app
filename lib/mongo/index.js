const { MongoClient } = require('mongodb');

const mongoURI = process.env.MONGODB_URI
const databaseName = 'db';

let client = null;

export async function connectToDatabase() {
  if (client) {
    return client.db(databaseName);
  }

  try {
    client = await MongoClient.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }

  return client.db(databaseName);
  }

export async function getTasks() {
    try {
      const db = await connectToDatabase();
      const collection = db.collection('tasks');
      const tasks = await collection.find({}).toArray();
      return tasks.map( ({_id, ...rest}) => rest);
    } catch (error) {
      console.error('Error retrieving tasks:', error);
      return [];
    } 
  }
export async function getTitles() {
  try {
    const db = await connectToDatabase();
    const collection = db.collection('tasks');
    const tasks = await collection.find({}, {id:true , title:true}).toArray();
    return tasks.map( ({_id, ...rest}) => rest);
  } catch (error) {
    console.error('Error retrieving titles:', error);
    return [];
  }
}

export async function getSingleTask(taskId){
  try {
    const db = await connectToDatabase();
    const collection = db.collection('tasks');
    const task = await collection.findOne({id:Number(taskId)})
    delete task._id
    return task
  } catch (error) {
    console.error('Error retrieving tasks:', error);
    return [];
  }
}

// room : {
//   id: String
//   mentorId: String
//   studentId: String
// }

export async function getAllUsers(){
  try {
    const db = await connectToDatabase();
    const collection = db.collection('rooms');
    const rooms = await collection.find({}).toArray()
    let users = []
    rooms.forEach(room => {
                            if (room.mentorId)  
                              users.push(room.mentorId)
                            if (room.studentId)  
                              users.push(room.studentId)
    })
    return users
  } catch (error) {
    console.error('Error retrieving users:', error);
    return [];
  }
}

export async function handleRooms(action, taskId, clientId){

  try{   
    const db = await connectToDatabase();
    const collection = db.collection('rooms');
    const room = await collection.findOne({id:Number(taskId)})
    
    let filter , newRoom , result , updatedRoom
    switch (action){
      case 'set-client':
        if (room.studentId!= null  && room.mentorId!= null)  // the room is already with 2 active members
          return room

        filter = { id: Number(room.id) }
        newRoom = {
          _id: room._id ,
          id: room.id  , 
          mentorId: !room.mentorId ? clientId : room.mentorId ,
          studentId: (room.mentorId  && !room.studentId) ? clientId : room.studentId 
        }       
        console.log(`${'before finding calls in order to set-client'}\n`)
        
        const res = await collection.findOneAndReplace(filter, newRoom, { returnOriginal: false })
        result = await collection.findOne(filter)     

        console.log(`${'after finding calls in order to set-client'}\n`)

        if (result === {})
            console.log(`${`tried to set-client num ${clientId} to room num ${taskId}`}\n`)
        console.log(`${result}\n`)
                 
        delete result._id
        return result


        
      case 'remove-client':      
      filter = { id: Number(room.id) }
        newRoom = {
          _id: room._id ,
          id: room.id  , 
          mentorId: clientId === room.mentorId ? null : room.mentorId , 
          studentId: clientId === room.studentId ? null : room.studentId 
        }
        await collection.findOneAndReplace(filter, newRoom, { returnOriginal: false } )
        result = await collection.findOne(filter)
        delete result._id
        return result
      }
  } catch( error) {
    console.error('Error handling Rooms:' , error)
    return error
  } 
  }

 export async function removeUser(userId){
  try {
    const db = await connectToDatabase();
    const collection = db.collection('rooms');
    const rooms = await collection.find({}).toArray()
    rooms.forEach(room => {
                            if (room.mentorId === userId){
                              handleRooms('remove-client' , room.id , room.mentorId )
                              return 
                            }  
                            if (room.studentId === userId)  {
                              handleRooms('remove-client' , room.id , room.studentId )
                               return 
                            }
    })
    return 
  } catch (error) {
    console.error('Error deleting user', error);
    return ;
  }
 } 
  export async function populateDB(){
    try {
        const db = await connectToDatabase();
        const taskCollection = db.collection('tasks');
        const roomsCollection = db.collection('rooms')
        //deleting porevious collections
        {
          taskCollection.drop((error, result) => {
          if (error) {
            console.error('Error deleting collection:', error);
          } else {
            console.log('Collection deleted successfully.');
          }
        });
        roomsCollection.drop((error, result) => {
          if (error) {
            console.error('Error deleting collection:', error);
          } else {
            console.log('Collection deleted successfully.');
          }
        });
        }
        const tasks = [
                       {
                          id: 1,
                          title: 'Array Manipulation',
                          content:
`//write a function called "sumEvenNumbers" that gets as input an array of  
//numbers and returns the sum of all the even numbers in the array.

function sumEvenNumbers(numbers) {



  


}`  ,
                          solution:
`//write a function called "sumEvenNumbers" that gets as input an array of  
//numbers and returns the sum of all the even numbers in the array.

function sumEvenNumbers(numbers) {
  return numbers.reduce((sum, num) => {
    if (num % 2 === 0) {
      return sum + num;
    }
    return sum;
  }, 0);
}`                          
                       },
                       {
                        id: 2 ,
                        title: `Loops`,
                        content:
`//Write a function called "countVowels" that takes a string as input and
// returns the number of vowels (a, e, i, o, u) in the string.

function countVowels(str) {

  






}`,
                        solution:
`//Write a function called "countVowels" that takes a string as input and
// returns the number of vowels (a, e, i, o, u) in the string.

function countVowels(str) {
  const vowels = ['a', 'e', 'i', 'o', 'u'];
  let count = 0;
  for (let char of str) {
    if (vowels.includes(char.toLowerCase())) {
      count++;
    }
  }
  return count;
}`
                       },
                       {
                        id:3,
                        title: `Conditional Statements`,
                        content:
`//Write a function called "checkInput that for a given input pair of number and string
//checks: if the number is positive: prints the string in uppercase,
//if the number is negative: prints the string in lowercase
//and if the number is 0: prints the empty string.
function checkInput(numb, string) {

  







}`,
                        solution:
`//Write a function called "checkInput that for a given input pair of number and string
//checks: if the number is positive: prints the string in uppercase,
//if the number is negative: prints the string in lowercase
//and if the number is 0: prints the empty string.
function checkInput(numb, string) {
  if (number > 0) {
    console.log(string.upper());
  } 
  else if (number < 0) {
    console.log(string.lower());
  } 
  else {
    console.log("");
  }
}`                  
                       },
                       {
                        id: 4,
                        title: `String Manipulation`,
                        content:
`//Write a function called truncateString that takes a string and a number 
//maxLength as input. If the string length is greater than maxLength, 
//truncate the string and add '...' at the end. Otherwise, return the original string.

function truncateString(str, maxLength) {

  


}`,                     
                        solution:
`//Write a function called truncateString that takes a string and a number 
//maxLength as input. If the string length is greater than maxLength, 
//truncate the string and add '...' at the end. Otherwise, return the original string.

function truncateString(str, maxLength) {
  if (str.length > maxLength) {
    return str.slice(0, maxLength) + '...';
  }
  return str;
}`
                       },
                       {
                        id: 5,
                        title: `Promises`,
                        content:
`//Write a function called fetchData that simulates an asynchronous operation
//and returns a promise. The promise should resolve with a message 
//"Data fetched successfully!" after a delay of 2 seconds.

function fetchData() {





}`,
                        solution:
`//Write a function called fetchData that simulates an asynchronous operation
//and returns a promise. The promise should resolve with a message 
//"Data fetched successfully!" after a delay of 2 seconds.

function fetchData() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve("Data fetched successfully!");
    }, 2000);
  });
}`                           
                       }

                      ]     

       const rooms = tasks.map(task => task.id).map(id => ({
                                                id:id,
                                                mentorId: null,
                                                studentId: null
       }))

        await taskCollection.insertMany(tasks);
        await roomsCollection.insertMany(rooms)
    } catch (error) {
        console.error('Error populating tasks:', error);
      } finally {
        if (client){
          client.close()
        }
      }
}





