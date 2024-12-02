import UnProcessed from '../Models/Data_Processing.js';

export const getJSON = async (req, res) => {
    try {
        const data = await UnProcessed.find();
        res.status(200).json(data);
        // console.log(data)
    } catch (error) {
        console.log(error);
    }
};

export const postJSON = async (req, res) => {
    console.log(req.body);
    try {
        const data = req.body;
        const newData = await UnProcessed.create(data);
        console.log(newData);
        res.status(201).json(newData);
    } catch (error) {
        console.log(error);
    }
};

export const updateJSON = async (req, res) => {
    console.log(req.body);
    try {
        if (!(await UnProcessed.findById(req.params.rowId))) {
            return res.status(404).json('Invalid ID');
        }
        try {
            const update = await UnProcessed.findByIdAndUpdate(
                req.params.rowId,
                {
                    $set: req.body
                },
                { new: true }
            );
            res.status(200).json(update);
        } catch (error) {
            next(error);
        }
    } catch (error) {
        console.log(error);
    }
};
export const deleteJSON = async (req, res) => {};
