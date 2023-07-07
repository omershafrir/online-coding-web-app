import { populateDB } from "../../lib/mongo";

const populateHandler = (req, res) => {
    populateDB()
    res.status(200).send()
}

export default populateHandler


