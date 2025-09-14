import express from 'express';
import Analytics from '../models/Analytics.js';
import Guest from '../models/Guest.js';
import Zone from '../models/Zone.js';
import User from '../models/User.js';

const router = express.Router();

router.get('/global', async (req, res) => {
    try {
        const { timeRange, zoneId } = req.query;

        // Calculate real-time analytics
        const query = {};
        if (zoneId) query.zoneId = zoneId;

        // Get total guests
        const totalGuests = await Guest.countDocuments(query);

        // Calculate conversion rate
        const convertedGuests = await Guest.countDocuments({
            ...query,
            assimilationStage: 'JOINED'
        });
        const conversionRate = totalGuests > 0 ? Math.round((convertedGuests / totalGuests) * 100) : 0;

        // Get active workers
        const activeWorkers = await User.countDocuments({
            ...query,
            isActive: true,
            role: 'WORKER'
        });

        // Get stage distribution
        const stages = ['INVITED', 'ATTENDED', 'DISCIPLED', 'JOINED'];
        const stageColors = ['#3B82F6', '#10B981', '#8B5CF6', '#6B7280'];
        const stageDistribution = await Promise.all(
            stages.map(async (stage, index) => ({
                name: stage.charAt(0) + stage.slice(1).toLowerCase(),
                value: await Guest.countDocuments({
                    ...query,
                    assimilationStage: stage
                }),
                color: stageColors[index]
            }))
        );

        // Get zone performance
        const zones = await Zone.find({});
        const zonePerformance = await Promise.all(
            zones.map(async zone => {
                const zoneQuery = { zoneId: zone._id };
                return {
                    zone: zone.name,
                    invited: await Guest.countDocuments({ ...zoneQuery, assimilationStage: 'INVITED' }),
                    attended: await Guest.countDocuments({ ...zoneQuery, assimilationStage: 'ATTENDED' }),
                    discipled: await Guest.countDocuments({ ...zoneQuery, assimilationStage: 'DISCIPLED' }),
                    joined: await Guest.countDocuments({ ...zoneQuery, assimilationStage: 'JOINED' }),
                    conversion: await calculateZoneConversionRate(zone._id)
                };
            })
        );

        // Get monthly trends
        const monthlyTrends = await getMonthlyTrends(query);

        // Get top performers
        const topPerformers = await getTopPerformers(query);

        const analytics = {
            totalGuests,
            conversionRate,
            avgTimeToConversion: await calculateAvgTimeToConversion(),
            activeWorkers,
            monthlyTrends,
            zonePerformance,
            stageDistribution,
            dropOffAnalysis: await calculateDropOffAnalysis(),
            topPerformers
        };

        // Save analytics snapshot
        await Analytics.create({
            timeRange: timeRange || 'weekly',
            zoneId,
            ...analytics
        });

        res.json(analytics);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Helper functions
async function calculateZoneConversionRate(zoneId) {
    const total = await Guest.countDocuments({ zoneId });
    const converted = await Guest.countDocuments({
        zoneId,
        assimilationStage: 'JOINED'
    });
    return total > 0 ? Math.round((converted / total) * 100) : 0;
}

async function calculateAvgTimeToConversion() {
    const convertedGuests = await Guest.find({
        assimilationStage: 'JOINED'
    });

    const conversionTimes = convertedGuests.map(guest => {
        const createdDate = new Date(guest.createdAt);
        const lastDate = new Date(guest.lastContact);
        return Math.ceil((lastDate - createdDate) / (1000 * 60 * 60 * 24)); // days
    });

    return conversionTimes.length > 0
        ? Math.round(conversionTimes.reduce((a, b) => a + b) / conversionTimes.length)
        : 0;
}

async function getMonthlyTrends(query) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonth = new Date().getMonth();
    const last6Months = Array.from({ length: 6 }, (_, i) => {
        const monthIndex = (currentMonth - i + 12) % 12;
        return months[monthIndex];
    }).reverse();

    return await Promise.all(
        last6Months.map(async month => {
            const startDate = new Date(new Date().getFullYear(), months.indexOf(month), 1);
            const endDate = new Date(new Date().getFullYear(), months.indexOf(month) + 1, 0);

            const newGuests = await Guest.countDocuments({
                ...query,
                createdAt: { $gte: startDate, $lte: endDate }
            });

            const converted = await Guest.countDocuments({
                ...query,
                assimilationStage: 'JOINED',
                lastContact: { $gte: startDate, $lte: endDate }
            });

            return { month, newGuests, converted };
        })
    );
}

async function getTopPerformers(query) {
    const workers = await User.find({
        ...query,
        role: 'WORKER',
        isActive: true
    }).populate('zoneIds', 'name');

    const performanceData = await Promise.all(
        workers.map(async worker => {
            const conversions = await Guest.countDocuments({
                assignedToId: worker._id,
                assimilationStage: 'JOINED'
            });

            // Calculate trend
            const previousConversions = await Guest.countDocuments({
                assignedToId: worker._id,
                assimilationStage: 'JOINED',
                lastContact: {
                    $gte: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), // 60 days ago
                    $lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)  // 30 days ago
                }
            });

            const trend = conversions > previousConversions ? 'UP' :
                conversions < previousConversions ? 'DOWN' : 'STABLE';

            return {
                name: worker.name,
                zone: worker.zoneIds[0]?.name || 'Unassigned',
                conversions,
                trend
            };
        })
    );

    return performanceData
        .sort((a, b) => b.conversions - a.conversions)
        .slice(0, 5);
}

async function calculateDropOffAnalysis() {
    const stages = ['INVITED', 'ATTENDED', 'DISCIPLED', 'JOINED'];
    const dropOffAnalysis = [];

    for (let i = 0; i < stages.length - 1; i++) {
        const currentStage = await Guest.countDocuments({ assimilationStage: stages[i] });
        const nextStage = await Guest.countDocuments({ assimilationStage: stages[i + 1] });
        const dropOff = currentStage > 0 ? Math.round(((currentStage - nextStage) / currentStage) * 100) : 0;

        dropOffAnalysis.push({
            stage: `${stages[i].charAt(0) + stages[i].slice(1).toLowerCase()} → ${stages[i + 1].charAt(0) + stages[i + 1].slice(1).toLowerCase()}`,
            dropOff,
            reason: getDropOffReason(stages[i], dropOff)
        });
    }

    return dropOffAnalysis;
}

function getDropOffReason(stage, dropOff) {
    const reasons = {
        'INVITED': 'No follow-up call',
        'ATTENDED': 'Not invited to small group',
        'DISCIPLED': 'Lack of mentorship'
    };
    return reasons[stage] || 'Unknown reason';
}

export default router;
