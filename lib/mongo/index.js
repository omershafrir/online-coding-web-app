const { MongoClient } = require('mongodb');

const mongoURI = process.env.MONGODB_URI
const databaseName = 'db';

let client;
export async function connectToDatabase() {
    if (!client) {
      try {
        client = await MongoClient.connect(mongoURI, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        });
      } catch (error) {
        console.error('Error connecting to MongoDB:', error);
      }
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
    console.error('Error retrieving tasks:', error);
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

export async function handleRooms(action, taskId, clientId){

  try{
    const db = await connectToDatabase();
    const collection = db.collection('rooms');
    const room = await collection.findOne({id:Number(taskId)})

    
    if (room.studentId!= null  && room.mentorId!= null)  // the room is already with 2 active members
      room

    let filter , newRoom , result , updatedRoom
    switch (action){
      case 'set-client':
        filter = { id: room.id }
        newRoom = {
          _id: room._id ,
          id: room.id  , 
          mentorId: !room.mentorId ? clientId : room.mentorId ,
          studentId: (room.mentorId  && !room.studentId) ? clientId : room.studentId 
        }       
        await collection.findOneAndReplace(filter, newRoom, { returnOriginal: false } )
        result = await collection.findOne(filter)
        delete result._id
        return result

        
      case 'remove-client':      
        filter = { id: room.id }
        newRoom = {
          _id: room._id ,
          id: room.id  , 
          mentorId: clientId === room.mentorId ? null : room.mentorId , 
          studentId: clientId === room.studentId ? null : room.studentId 
        }
        console.log(`room before value is: ${JSON.stringify(room)}\n`)
        await collection.findOneAndReplace(filter, newRoom, { returnOriginal: false } )
        result = await collection.findOne(filter)
        console.log(`room after value is: ${JSON.stringify(result)}\n`)
        
        delete result._id
        return result
      }
  } catch( error) {
    console.error('Error handling Rooms:' , error)
    return error
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
        const tasks = [1,2,3,4,5].map(id => ({
                                                id:id , 
                                                title:`Task num${id}`,
                                                content:`const func = () => {
                                                  let i = ${id}
                                                  if ( i > 0)
                                                    return true
                                                  else
                                                    return false
                                              }`,
                                                solution: `solution num${id}`
                                            }))
       const rooms = [1,2,3,4,5].map(id => ({
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

