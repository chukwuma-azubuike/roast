import express from 'express';
import Notification from '../models/Notification.js';
import User from '../models/User.js';
import Guest from '../models/Guest.js';
import { NotificationRule } from '../models/Pipeline.js';

const router = express.Router();

// Get notifications with filtering
router.get('/', async (req, res) => {
    try {
        const { userId, isRead, type, priority } = req.query;
        const query = {};

        if (userId) query.recipients = userId;
        if (isRead !== undefined) query.isRead = isRead === 'true';
        if (type) query.type = type;
        if (priority) query.priority = priority;

        const notifications = await Notification.find(query)
            .populate('guestId', 'name')
            .sort('-createdAt')
            .limit(100); // Limit to prevent overwhelming response

        res.json(notifications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Mark notification as read
router.patch('/:id/read', async (req, res) => {
    try {
        const notification = await Notification.findByIdAndUpdate(
            req.params.id,
            { isRead: true },
            { new: true }
        ).populate('guestId', 'name');

        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }

        res.json(notification);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Mark all notifications as read for a user
router.post('/mark-all-read', async (req, res) => {
    try {
        const { userId } = req.body;
        if (!userId) {
            return res.status(400).json({ message: 'userId is required' });
        }

        await Notification.updateMany(
            { recipients: userId, isRead: false },
            { isRead: true }
        );

        res.status(200).json({ message: 'All notifications marked as read' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create notification (used internally)
async function createNotification(params) {
    try {
        const notification = new Notification(params);
        await notification.save();
        return notification;
    } catch (error) {
        console.error('Error creating notification:', error);
        return null;
    }
}

// Check and create notifications based on rules
async function checkNotificationRules(event, data) {
    try {
        const rules = await NotificationRule.find({
            triggerEvent: event,
            isActive: true
        });

        for (const rule of rules) {
            if (await checkRuleConditions(rule, data)) {
                const recipients = await getNotificationRecipients(rule, data);

                await createNotification({
                    type: event.toUpperCase(),
                    title: rule.template?.title || rule.name,
                    message: generateNotificationMessage(rule, data),
                    guestId: data.guestId,
                    guestName: data.guestName,
                    priority: rule.template?.priority || 'MEDIUM',
                    actionRequired: true,
                    recipients
                });
            }
        }
    } catch (error) {
        console.error('Error checking notification rules:', error);
    }
}

// Helper function to check rule conditions
async function checkRuleConditions(rule, data) {
    const conditions = rule.conditions || {};

    // Example conditions check
    if (conditions.daysSinceContact && data.lastContact) {
        const daysSince = (Date.now() - new Date(data.lastContact)) / (1000 * 60 * 60 * 24);
        if (daysSince < conditions.daysSinceContact) return false;
    }

    if (conditions.stage && data.stage !== conditions.stage) return false;
    if (conditions.priority && data.priority !== conditions.priority) return false;

    return true;
}

// Helper function to get notification recipients
async function getNotificationRecipients(rule, data) {
    const recipients = new Set();

    for (const recipientType of rule.recipients) {
        switch (recipientType) {
            case 'worker':
                if (data.workerId) recipients.add(data.workerId);
                break;
            case 'coordinator':
                const guest = await Guest.findById(data.guestId).populate('zoneId');
                if (guest?.zoneId?.coordinator) {
                    recipients.add(guest.zoneId.coordinator);
                }
                break;
            case 'admin':
                const admins = await User.find({ role: 'ADMIN' });
                admins.forEach(admin => recipients.add(admin._id));
                break;
        }
    }

    return Array.from(recipients);
}

// Helper function to generate notification message
function generateNotificationMessage(rule, data) {
    if (rule.template?.message) {
        let message = rule.template.message;
        // Replace placeholders with actual data
        Object.entries(data).forEach(([key, value]) => {
            message = message.replace(`{${key}}`, value);
        });
        return message;
    }
    return rule.name;
}

export default router;
export { checkNotificationRules };
