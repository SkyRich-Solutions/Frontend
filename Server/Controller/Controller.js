import Material from "../Models/test.js";

export const getJSON = async (req, res) => { 
    try {
        const data = await Material.find();
        res.status(200).json(data);
        console.log(data)
    } catch (error) {
        console.log(error);
    }
}