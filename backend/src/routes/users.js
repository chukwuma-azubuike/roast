import express from 'express';
import { mockUsers } from '../models/data.js';

const router = express.Router();

router.get('/', (req, res) => {
    const { role, zoneId } = req.query;
    let filteredUsers = [...mockUsers];

    if (role) {
        filteredUsers = filteredUsers.filter(u => u.role === role);
    }
    if (zoneId) {
        filteredUsers = filteredUsers.filter(u => u.zoneIds?.includes(zoneId));
    }

    res.json(filteredUsers);
});

export default router;
