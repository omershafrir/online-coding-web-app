import { handleRooms } from "../../lib/mongo";

//only api endpoint for changing the db
const  mongoHandler = async (req, res) => {
    if (req.method === 'POST'){
        const { action, taskId, clientId } = req.body;
        const room = await handleRooms(action, taskId, clientId)
        res.status(200).json(room);
    }
    else {
        res.status(400).send('Action is not supported')
    }
}

export default mongoHandler



