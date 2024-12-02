import express from "express";
import { getJSON, postJSON } from "../Controller/Controller.js";

const router = express.Router();

router.get('/getJSON', getJSON)
router.post('/postJSON', postJSON);

export default router;