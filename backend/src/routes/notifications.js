import express from 'express';
import { mockNotifications } from '../models/data.js';

const router = express.Router();

router.get('/', (req, res) => {
    res.json(mockNotifications);
});

router.patch('/:id/read', (req, res) => {
    const idx = mockNotifications.findIndex(n => n._id === req.params.id);
    if (idx === -1) {
        return res.status(404).json({ message: 'Notification not found' });
    }

    mockNotifications[idx] = {
        ...mockNotifications[idx],
        isRead: true
    };

    res.json(mockNotifications[idx]);
});

export default router;
