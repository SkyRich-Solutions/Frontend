import express from 'express';
import {
    getJSON,
    postJSON,
    updateJSON,
    deleteJSON
} from '../Controller/ProcessedController.js';

const router = express.Router();

router.get('/getJSON', getJSON);

export default router;
