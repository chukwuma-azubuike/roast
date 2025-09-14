import express from 'express';
import { Pipeline, NotificationRule } from '../models/Pipeline.js';

const router = express.Router();

router.get('/stages', async (req, res) => {
    try {
        const stages = await Pipeline.find().sort('order');
        res.json(stages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/stages', async (req, res) => {
    try {
        // Get max order to place new stage at the end
        const maxOrder = await Pipeline.findOne().sort('-order');
        const order = maxOrder ? maxOrder.order + 1 : 1;

        const stage = new Pipeline({
            ...req.body,
            order
        });
        const savedStage = await stage.save();
        res.status(201).json(savedStage);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.patch('/stages/:id', async (req, res) => {
    try {
        const updatedStage = await Pipeline.findByIdAndUpdate(
            req.params.id,
            { ...req.body },
            { new: true, runValidators: true }
        );

        if (!updatedStage) {
            return res.status(404).json({ message: 'Stage not found' });
        }

        // If order changed, reorder other stages
        if (req.body.order !== undefined) {
            await reorderStages(updatedStage._id, req.body.order);
        }

        res.json(updatedStage);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.delete('/stages/:id', async (req, res) => {
    try {
        const stage = await Pipeline.findById(req.params.id);
        if (!stage) {
            return res.status(404).json({ message: 'Stage not found' });
        }

        if (stage.isDefault) {
            return res.status(400).json({ message: 'Cannot delete default stages' });
        }

        await stage.remove();

        // Reorder remaining stages
        await Pipeline.updateMany(
            { order: { $gt: stage.order } },
            { $inc: { order: -1 } }
        );

        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/notification-rules', async (req, res) => {
    try {
        const rules = await NotificationRule.find();
        res.json(rules);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/notification-rules', async (req, res) => {
    try {
        const rule = new NotificationRule(req.body);
        const savedRule = await rule.save();
        res.status(201).json(savedRule);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.patch('/notification-rules/:id', async (req, res) => {
    try {
        const updatedRule = await NotificationRule.findByIdAndUpdate(
            req.params.id,
            { ...req.body },
            { new: true, runValidators: true }
        );

        if (!updatedRule) {
            return res.status(404).json({ message: 'Rule not found' });
        }

        res.json(updatedRule);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Helper function to reorder stages
async function reorderStages(stageId, newOrder) {
    const stage = await Pipeline.findById(stageId);
    if (!stage) return;

    const oldOrder = stage.order;
    if (oldOrder === newOrder) return;

    if (oldOrder < newOrder) {
        // Moving down: decrease order of stages in between
        await Pipeline.updateMany(
            {
                _id: { $ne: stageId },
                order: { $gt: oldOrder, $lte: newOrder }
            },
            { $inc: { order: -1 } }
        );
    } else {
        // Moving up: increase order of stages in between
        await Pipeline.updateMany(
            {
                _id: { $ne: stageId },
                order: { $gte: newOrder, $lt: oldOrder }
            },
            { $inc: { order: 1 } }
        );
    }

    stage.order = newOrder;
    await stage.save();
}

export default router;
