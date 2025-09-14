import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Guest from '../models/Guest.js';

const router = express.Router();

// Get all users with filtering
router.get('/', async (req, res) => {
    try {
        const { role, zoneId } = req.query;
        const query = {};

        if (role) query.role = role;
        if (zoneId) query.zoneIds = zoneId;

        const users = await User.find(query)
            .select('-password')
            .populate('zoneIds', 'name')
            .sort('name');

        // Get guest counts for each user
        const usersWithStats = await Promise.all(
            users.map(async user => {
                const guestCount = await Guest.countDocuments({ assignedToId: user._id });
                return {
                    ...user.toObject(),
                    guestCount
                };
            })
        );

        res.json(usersWithStats);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get user by ID
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
            .select('-password')
            .populate('zoneIds', 'name');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Get user statistics
        const stats = await getUserStats(user._id);

        res.json({
            ...user.toObject(),
            stats
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create new user
router.post('/', async (req, res) => {
    try {
        // Check if email already exists
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        const user = new User({
            ...req.body,
            password: hashedPassword
        });

        const savedUser = await user.save();
        const userWithoutPassword = await User.findById(savedUser._id)
            .select('-password')
            .populate('zoneIds', 'name');

        res.status(201).json(userWithoutPassword);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update user
router.patch('/:id', async (req, res) => {
    try {
        const updates = { ...req.body };

        // Hash new password if provided
        if (updates.password) {
            const salt = await bcrypt.genSalt(10);
            updates.password = await bcrypt.hash(updates.password, salt);
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            updates,
            { new: true, runValidators: true }
        )
            .select('-password')
            .populate('zoneIds', 'name');

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(updatedUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete user
router.delete('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if user has assigned guests
        const guestCount = await Guest.countDocuments({ assignedToId: user._id });
        if (guestCount > 0) {
            return res.status(400).json({
                message: `Cannot delete user with ${guestCount} assigned guest(s). Please reassign guests first.`
            });
        }

        await user.remove();
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// User login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Create JWT token
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Get user stats
        const stats = await getUserStats(user._id);

        const userWithoutPassword = user.toObject();
        delete userWithoutPassword.password;

        res.json({
            token,
            user: {
                ...userWithoutPassword,
                stats
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Helper function to get user statistics
async function getUserStats(userId) {
    const totalGuests = await Guest.countDocuments({ assignedToId: userId });
    const activeGuests = await Guest.countDocuments({
        assignedToId: userId,
        lastContact: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
    });

    const stageBreakdown = await Guest.aggregate([
        { $match: { assignedToId: userId } },
        {
            $group: {
                _id: '$assimilationStage',
                count: { $sum: 1 }
            }
        }
    ]);

    const conversionRate = stageBreakdown.reduce((acc, curr) => {
        return curr._id === 'JOINED' ? (curr.count / totalGuests * 100) : acc;
    }, 0);

    return {
        totalGuests,
        activeGuests,
        conversionRate: Math.round(conversionRate * 10) / 10,
        stageBreakdown: Object.fromEntries(
            stageBreakdown.map(({ _id, count }) => [_id, count])
        )
    };
}

export default router;
