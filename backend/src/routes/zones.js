import express from 'express';
import Zone from '../models/Zone.js';
import User from '../models/User.js';
import Guest from '../models/Guest.js';

const router = express.Router();

// Get all zones
router.get('/', async (req, res) => {
    try {
        const zones = await Zone.find()
            .populate('coordinator', 'name email')
            .sort('name');
        res.json(zones);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get zone by ID with stats
router.get('/:id', async (req, res) => {
    try {
        const zone = await Zone.findById(req.params.id)
            .populate('coordinator', 'name email');

        if (!zone) {
            return res.status(404).json({ message: 'Zone not found' });
        }

        // Get zone statistics
        const stats = await getZoneStats(zone._id);

        res.json({
            ...zone.toObject(),
            stats
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create new zone
router.post('/', async (req, res) => {
    try {
        const zone = new Zone(req.body);
        const savedZone = await zone.save();

        // If coordinator is assigned, update their role and zoneIds
        if (savedZone.coordinator) {
            await User.findByIdAndUpdate(savedZone.coordinator, {
                $addToSet: { zoneIds: savedZone._id },
                $set: { role: 'ZONAL_COORDINATOR' }
            });
        }

        res.status(201).json(savedZone);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update zone
router.patch('/:id', async (req, res) => {
    try {
        const zone = await Zone.findById(req.params.id);
        if (!zone) {
            return res.status(404).json({ message: 'Zone not found' });
        }

        // If coordinator is being changed, update both old and new coordinator's roles and zoneIds
        if (req.body.coordinator && req.body.coordinator !== zone.coordinator?.toString()) {
            // Remove zone from old coordinator
            if (zone.coordinator) {
                const oldCoordinator = await User.findById(zone.coordinator);
                if (oldCoordinator) {
                    oldCoordinator.zoneIds = oldCoordinator.zoneIds.filter(id => id.toString() !== zone._id.toString());
                    if (oldCoordinator.zoneIds.length === 0) {
                        oldCoordinator.role = 'WORKER';
                    }
                    await oldCoordinator.save();
                }
            }

            // Add zone to new coordinator
            await User.findByIdAndUpdate(req.body.coordinator, {
                $addToSet: { zoneIds: zone._id },
                $set: { role: 'ZONAL_COORDINATOR' }
            });
        }

        const updatedZone = await Zone.findByIdAndUpdate(
            req.params.id,
            { ...req.body },
            { new: true, runValidators: true }
        ).populate('coordinator', 'name email');

        res.json(updatedZone);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete zone
router.delete('/:id', async (req, res) => {
    try {
        const zone = await Zone.findById(req.params.id);
        if (!zone) {
            return res.status(404).json({ message: 'Zone not found' });
        }

        // Check if zone has any guests
        const guestCount = await Guest.countDocuments({ zoneId: zone._id });
        if (guestCount > 0) {
            return res.status(400).json({
                message: `Cannot delete zone with ${guestCount} guest(s). Please reassign guests first.`
            });
        }

        // Update coordinator if exists
        if (zone.coordinator) {
            const coordinator = await User.findById(zone.coordinator);
            if (coordinator) {
                coordinator.zoneIds = coordinator.zoneIds.filter(id => id.toString() !== zone._id.toString());
                if (coordinator.zoneIds.length === 0) {
                    coordinator.role = 'WORKER';
                }
                await coordinator.save();
            }
        }

        await zone.remove();
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Helper function to get zone statistics
async function getZoneStats(zoneId) {
    const totalGuests = await Guest.countDocuments({ zoneId });
    const activeGuests = await Guest.countDocuments({
        zoneId,
        lastContact: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
    });
    const workers = await User.find({
        zoneIds: zoneId,
        role: 'WORKER',
        isActive: true
    });
    const guestsPerWorker = workers.length > 0 ? totalGuests / workers.length : 0;

    const stageBreakdown = await Guest.aggregate([
        { $match: { zoneId } },
        {
            $group: {
                _id: '$assimilationStage',
                count: { $sum: 1 }
            }
        }
    ]);

    return {
        totalGuests,
        activeGuests,
        workerCount: workers.length,
        guestsPerWorker: Math.round(guestsPerWorker * 10) / 10,
        stageBreakdown: Object.fromEntries(
            stageBreakdown.map(({ _id, count }) => [_id, count])
        )
    };
}

export default router;
