import express from 'express';
import {
    getJSON,
    postJSON,
    updateJSON,
    deleteJSON
} from '../Controller/Controller.js';

const router = express.Router();

router.get('/getJSON', getJSON);
router.post('/postJSON', postJSON);
router.post('/updateJSON', updateJSON); //IN WORK
router.post('/deleteJSON', deleteJSON); //IN WORK

export default router;