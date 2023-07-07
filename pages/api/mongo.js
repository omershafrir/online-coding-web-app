import { handleRooms } from "../../lib/mongo";

const  mongoHandler = async (req, res) => {
    if (req.method === 'POST'){
        const { action, taskId, clientId } = req.body;
        const room = await handleRooms(action, taskId, clientId)
        console.log("room in the mango handler is:" , room)
        res.status(200).json(room);
    }
    else {
        res.status(400).send('Action is not supported')
    }
}

export default mongoHandler



