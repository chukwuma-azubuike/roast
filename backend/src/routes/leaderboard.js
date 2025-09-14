import express from 'express';
import Guest from '../models/Guest.js';
import User from '../models/User.js';
import Zone from '../models/Zone.js';
import Achievement from '../models/Achievement.js';
import Engagement from '../models/Engagement.js';

const router = express.Router();

router.get('/workers', async (req, res) => {
    try {
        const { period = 'weekly' } = req.query;
        const periodDays = getPeriodDays(period);
        const startDate = new Date(Date.now() - periodDays * 24 * 60 * 60 * 1000);

        const workers = await User.find({ role: 'WORKER', isActive: true })
            .populate('zoneIds', 'name');

        const leaderboard = await Promise.all(workers.map(async worker => {
            const stats = await calculateWorkerStats(worker._id, startDate);
            const trend = await calculateWorkerTrend(worker._id, startDate);
            const badges = await calculateWorkerBadges(stats);

            return {
                id: worker._id,
                name: worker.name,
                zone: worker.zoneIds[0]?.name || 'Unassigned',
                avatar: getInitials(worker.name),
                stats,
                badges,
                trend,
                points: calculatePoints(stats, badges)
            };
        }));

        const sortedLeaderboard = leaderboard.sort((a, b) => b.points - a.points);
        res.json(sortedLeaderboard);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/zones', async (req, res) => {
    try {
        const { period = 'weekly' } = req.query;
        const periodDays = getPeriodDays(period);
        const startDate = new Date(Date.now() - periodDays * 24 * 60 * 60 * 1000);

        const zones = await Zone.find()
            .populate('coordinator', 'name');

        const leaderboard = await Promise.all(zones.map(async zone => {
            const stats = await calculateZoneStats(zone._id, startDate);
            const trend = await calculateZoneTrend(zone._id, startDate);

            return {
                zone: zone.name,
                coordinator: zone.coordinator?.name || 'Unassigned',
                stats,
                points: calculateZonePoints(stats),
                trend
            };
        }));

        const sortedLeaderboard = leaderboard.sort((a, b) => b.points - a.points);
        res.json(sortedLeaderboard);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/achievements', async (req, res) => {
    try {
        const achievements = await Achievement.find().sort('points');
        res.json(achievements);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Helper functions
function getPeriodDays(period) {
    const periods = {
        daily: 1,
        weekly: 7,
        monthly: 30,
        quarterly: 90,
        yearly: 365
    };
    return periods[period] || 7;
}

async function calculateWorkerStats(workerId, startDate) {
    const guestsCaptured = await Guest.countDocuments({
        createdById: workerId,
        createdAt: { $gte: startDate }
    });

    const conversions = await Guest.countDocuments({
        assignedToId: workerId,
        assimilationStage: 'JOINED',
        lastContact: { $gte: startDate }
    });

    const callsMade = await Engagement.countDocuments({
        workerId,
        type: { $in: ['PHONE', 'WHATSAPP'] },
        createdAt: { $gte: startDate }
    });

    const visitsMade = await Engagement.countDocuments({
        workerId,
        type: 'IN_PERSON',
        createdAt: { $gte: startDate }
    });

    const milestoneCompletions = await Guest.aggregate([
        { $match: { assignedToId: workerId } },
        { $unwind: '$milestones' },
        {
            $match: {
                'milestones.status': 'COMPLETED',
                'milestones.completedAt': { $gte: startDate }
            }
        },
        { $count: 'total' }
    ]);

    // Calculate consistency based on daily activity
    const consistency = await calculateConsistency(workerId, startDate);

    return {
        guestsCaptured,
        conversions,
        callsMade,
        visitsMade,
        milestoneCompletions: milestoneCompletions[0]?.total || 0,
        consistency
    };
}

async function calculateConsistency(workerId, startDate) {
    const days = await Engagement.aggregate([
        {
            $match: {
                workerId,
                createdAt: { $gte: startDate }
            }
        },
        {
            $group: {
                _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }
            }
        },
        { $count: 'activeDays' }
    ]);

    const totalPossibleDays = Math.ceil((Date.now() - startDate) / (24 * 60 * 60 * 1000));
    const activeDays = days[0]?.activeDays || 0;

    return Math.round((activeDays / totalPossibleDays) * 100);
}

async function calculateWorkerTrend(workerId, startDate) {
    const currentPeriodConversions = await Guest.countDocuments({
        assignedToId: workerId,
        assimilationStage: 'JOINED',
        lastContact: { $gte: startDate }
    });

    const previousPeriodConversions = await Guest.countDocuments({
        assignedToId: workerId,
        assimilationStage: 'JOINED',
        lastContact: {
            $gte: new Date(startDate.getTime() - (startDate.getTime() - Date.now())),
            $lt: startDate
        }
    });

    if (currentPeriodConversions > previousPeriodConversions) return 'UP';
    if (currentPeriodConversions < previousPeriodConversions) return 'DOWN';
    return 'STABLE';
}

async function calculateWorkerBadges(stats) {
    const badges = [];

    if (stats.guestsCaptured >= 25) badges.push('Top Evangelist');
    if (stats.consistency >= 90) badges.push('Consistent Caller');
    if (stats.conversions >= 8) badges.push('Conversion King');
    if (stats.visitsMade >= 20) badges.push('Visit Champion');
    if (stats.callsMade >= 150) badges.push('Phone Warrior');

    return badges;
}

function calculatePoints(stats, badges) {
    return (
        stats.guestsCaptured * 50 +
        stats.conversions * 200 +
        stats.callsMade * 5 +
        stats.visitsMade * 20 +
        stats.milestoneCompletions * 30 +
        stats.consistency * 10 +
        badges.length * 100
    );
}

async function calculateZoneStats(zoneId, startDate) {
    const totalGuests = await Guest.countDocuments({ zoneId });
    const conversions = await Guest.countDocuments({
        zoneId,
        assimilationStage: 'JOINED',
        lastContact: { $gte: startDate }
    });
    const conversionRate = totalGuests > 0 ? Math.round((conversions / totalGuests) * 100) : 0;
    const activeWorkers = await User.countDocuments({
        zoneIds: zoneId,
        role: 'WORKER',
        isActive: true
    });

    // Calculate average response time
    const engagements = await Engagement.aggregate([
        {
            $match: {
                guestId: { $in: (await Guest.find({ zoneId }, '_id')).map(g => g._id) },
                createdAt: { $gte: startDate }
            }
        },
        {
            $group: {
                _id: '$guestId',
                avgResponseTime: { $avg: { $subtract: ['$createdAt', '$$ROOT.createdAt'] } }
            }
        }
    ]);

    const avgResponseTime = engagements.length > 0
        ? Math.round(engagements.reduce((acc, curr) => acc + curr.avgResponseTime, 0) / engagements.length / (60 * 60 * 1000) * 10) / 10
        : 0;

    return {
        totalGuests,
        conversions,
        conversionRate,
        activeWorkers,
        avgResponseTime: `${avgResponseTime} hours`
    };
}

async function calculateZoneTrend(zoneId, startDate) {
    const currentPeriodStats = await calculateZoneStats(zoneId, startDate);
    const previousPeriodStats = await calculateZoneStats(
        zoneId,
        new Date(startDate.getTime() - (startDate.getTime() - Date.now()))
    );

    if (currentPeriodStats.conversionRate > previousPeriodStats.conversionRate) return 'UP';
    if (currentPeriodStats.conversionRate < previousPeriodStats.conversionRate) return 'DOWN';
    return 'STABLE';
}

function calculateZonePoints(stats) {
    return (
        stats.totalGuests * 50 +
        stats.conversions * 200 +
        stats.conversionRate * 100 +
        stats.activeWorkers * 500
    );
}

function getInitials(name) {
    return name
        .split(' ')
        .map(part => part[0].toUpperCase())
        .join('');
}

export default router;
