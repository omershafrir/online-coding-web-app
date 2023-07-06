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
        console.log('Connected to MongoDB');
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
// export async function setNewRole(role, taskId, personId){
//   const filter = { name: 'John Doe' };
//   const update = { $set: { age: 35 } };
//   if (role === 'student'){
    
//   }
//   else if (role === 'teacher'){

//   }
// }

  export async function populateDBDemo(){
    try {
        const db = await connectToDatabase();
        const taskCollection = db.collection('tasks');
        const tasks = [1,2,3,4,5].map(id => ({
                                                id:id , 
                                                title:`Task num${id}`,
                                                content:`content num${id}`,
                                                solution: `solution num${id}`
                                            }))
        await taskCollection.insertMany(tasks);
        // const serverCollection = db.collection('serverState');
        // await serverCollection.insertOne({
        //                                     task0: [null,null],
        //                                     task1: [null,null],
        //                                     task2: [null,null],
        //                                     task3: [null,null],
        //                                     task4: [null,null],
        // })
    } catch (error) {
        console.error('Error populating tasks:', error);
      }
}
////////////////////////////////////////////////////////////////////////
/**


// let isConnected = false;

// export async function connectToDatabase() {
//     console.log("URI\n" , mongoURI)
//     if (isConnected) {
//         console.log('Database already connected');  
//         return;
//       }
//   try {
//     await mongoose.connect(mongoURI, {
//         useNewUrlParser: true,
//         useUnifiedTopology: true,
//       });
//       isConnected = true;
//       console.log('Database connection successful');  
//   } catch (error) {
//     console.error('Error connecting to MongoDB:', error);
//     throw error;
//   }
// }

// export async function getTasks(){
//     // connectToDatabase()
//     // const tasks = await Task.find()
//     // console.log(tasks)
// }

// export async function populateDBDemo(){
//     connectToDatabase()
//     const tasks = [1,2,3,4,5].map(id => new Task({
//                                             id:id , 
//                                             title:`Task num${id}`,
//                                             content:`content num${id}`,
//                                             solution: `solution num${id}`
//                                          }))
//     tasks.forEach(task => task.save().then(() => console.log("data saved ")))                               
// }

// const taskScheme = new mongoose.Schema({
//     id: Number,
//     title: String,
//     content: String,
//     solution: String 
// })
// console.log(mongoose.model.Task)
// const Task = mongoose.model.Task || mongoose.model('Task' , taskScheme);

 */