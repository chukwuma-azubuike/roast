import express from 'express';
import { mockZones } from '../models/data.js';

const router = express.Router();

router.get('/', (req, res) => {
    res.json(mockZones);
});

export default router;
