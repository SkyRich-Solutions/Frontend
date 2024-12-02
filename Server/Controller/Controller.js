import PostMaterial from "../Models/postTest.js";
import Material  from '../Models/test.js';

export const getJSON = async (req, res) => {
    try {
        const data = await Material.find();
        res.status(200).json(data);
        // console.log(data)
    } catch (error) {
        console.log(error);
    }
};

export const postJSON = async (req, res) => {
    console.log(req.body)
    try {
        const data = req.body;
        const newData = await PostMaterial.create(data);
        console.log(newData)
        res.status(201).json(newData);
    } catch (error) {
        console.log(error);
    }
};
