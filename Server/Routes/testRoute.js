import express from "express";
import { getJSON } from "../Controller/Controller.js";

const router = express.Router();

router.get('/testJSON', getJSON)

export default router;