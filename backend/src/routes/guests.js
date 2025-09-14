import express from 'express';
import Guest from '../models/Guest.js';
import Engagement from '../models/Engagement.js';

const router = express.Router();

// Get all guests
router.get('/', async (req, res) => {
    try {
        const { campusId, workerId, zoneId } = req.query;
        const query = {};

        if (workerId) query.assignedToId = workerId;
        if (zoneId) query.zoneId = zoneId;
        if (campusId) query.campusId = campusId;
        // campusId filter can be added when implementing multi-campus feature

        const guests = await Guest.find(query)
            .populate('assignedToId', 'name')
            .populate('zoneId', 'name')
            .sort('-createdAt');

        res.json(guests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get guest by ID
router.get('/:id', async (req, res) => {
    try {
        const guest = await Guest.findById(req.params.id)
            .populate('assignedToId', 'name')
            .populate('zoneId', 'name');

        if (!guest) {
            return res.status(404).json({ message: 'Guest not found' });
        }
        res.json(guest);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create new guest
router.post('/', async (req, res) => {
    try {
        const guest = new Guest({
            ...req.body,
            lastContact: new Date()
        });
        const savedGuest = await guest.save();
        res.status(201).json(savedGuest);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update guest
router.patch('/:id', async (req, res) => {
    try {
        const updatedGuest = await Guest.findByIdAndUpdate(
            req.params.id,
            { ...req.body },
            { new: true, runValidators: true }
        );

        if (!updatedGuest) {
            return res.status(404).json({ message: 'Guest not found' });
        }

        res.json(updatedGuest);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get guest engagements
router.get('/:id/engagements', async (req, res) => {
    try {
        const engagements = await Engagement.find({ guestId: req.params.id })
            .populate('workerId', 'name')
            .sort('-createdAt');
        res.json(engagements);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Add engagement
router.post('/:id/engagements', async (req, res) => {
    try {
        const guestId = req.params.id;
        const engagement = new Engagement({
            guestId,
            ...req.body
        });

        const savedEngagement = await engagement.save();

        // Update guest's last contact
        await Guest.findByIdAndUpdate(guestId, { lastContact: new Date() });

        const populatedEngagement = await savedEngagement.populate('workerId', 'name');
        res.status(201).json(populatedEngagement);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

export default router;
