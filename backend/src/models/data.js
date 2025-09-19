import { v4 as uuid } from 'uuid';

// Helper to get current ISO timestamp
const now = () => new Date();

// Mock Data
export const mockGuests = [
    {
        _id: uuid(),
        name: 'Remi Lawal',
        assignedToId: 'user-1',
        assimilationStage: 'INVITED',
        lastContact: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        phone: '+2348012345678',
        zoneId: 'zone-1',
        createdById: 'user-1',
        createdAt: now(),
        preferredChannel: 'WHATSAPP',
        prayerRequest: 'Pray for new job',
        address: 'Lagos',
        nextAction: 'Follow up via call',
        milestones: [
            {
                _id: uuid(),
                title: 'Initial Contact',
                description: 'First contact with guest',
                weekNumber: 1,
                status: 'PENDING',
                completedAt: null,
            }
        ]
    },
        {
        _id: uuid(),
        name: 'Osasco Paulo',
        assignedToId: 'user-1',
        assimilationStage: 'INVITED',
        lastContact: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        phone: '+2348012345678',
        zoneId: 'zone-1',
        createdById: 'user-1',
        createdAt: now(),
        preferredChannel: 'WHATSAPP',
        prayerRequest: 'Pray for new job',
        address: 'Lagos',
        nextAction: 'Follow up via call',
        milestones: [
            {
                _id: uuid(),
                title: 'Initial Contact',
                description: 'First contact with guest',
                weekNumber: 1,
                status: 'PENDING',
                completedAt: null,
            }
        ]
    }
];

export const mockZones = [
    { _id: 'zone-1', name: 'Central Zone' },
    { _id: 'zone-2', name: 'North Zone' },
    { _id: 'zone-3', name: 'South Zone' },
    { _id: 'zone-4', name: 'East Zone' },
    { _id: 'zone-5', name: 'West Zone' }
];

export const mockUsers = [
    { _id: 'user-worker-1', name: 'Worker 1', role: 'WORKER' },
    { _id: 'user-worker-2', name: 'Worker 2', role: 'WORKER' },
    { _id: 'user-coord-1', name: 'Coordinator', role: 'ZONAL_COORDINATOR', zoneIds: ['zone-1'] }
];

export const mockEngagements = {};

export const mockNotifications = [
    {
        _id: uuid(),
        type: 'FOLLOW_UP',
        title: 'Follow-up Due',
        message: "Sarah Johnson needs a follow-up call - it's been 2 days since last contact",
        guestName: 'Sarah Johnson',
        guestId: 'guest1',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        isRead: false,
        priority: 'HIGH',
        actionRequired: true,
    }
];

export const mockPipelineStages = [
    {
        id: 'invited',
        name: 'Invited',
        description: 'Guest has been invited to church but has not yet attended',
        order: 1,
        color: '#3B82F6',
        isDefault: true,
        milestones: [
            {
                id: 'm1',
                title: 'Initial Contact',
                description: 'First interaction with guest',
                required: true,
                order: 1,
            }
        ]
    }
];

export const mockNotificationRules = [
    {
        id: 'n1',
        name: 'Stagnant Guest Alert',
        description: "Alert coordinator when a guest hasn't been contacted in 7 days",
        triggerEvent: 'stagnant_guest',
        conditions: { daysSinceContact: 7 },
        recipients: ['coordinator'],
        isActive: true,
    }
];

// Analytics mock data
export const mockAnalytics = {
    totalGuests: 499,
    conversionRate: 27,
    avgTimeToConversion: 42,
    activeWorkers: 25,
    monthlyTrends: [
        { month: 'Jul', newGuests: 28, converted: 5 },
        { month: 'Aug', newGuests: 35, converted: 8 }
    ],
    zonePerformance: [
        { zone: 'Central', invited: 45, attended: 32, discipled: 18, joined: 12, conversion: 27 }
    ],
    stageDistribution: [
        { name: 'Invited', value: 212, color: '#3B82F6' }
    ],
    dropOffAnalysis: [
        { stage: 'Invited → Attended', dropOff: 30, reason: 'No follow-up call' }
    ],
    topPerformers: [
        { name: 'John Worker', zone: 'Central', conversions: 8, trend: 'UP' }
    ]
};

export const mockLeaderboard = [
    {
        id: 'worker1',
        name: 'John Worker',
        zone: 'Central',
        avatar: 'JW',
        stats: {
            guestsCaptured: 28,
            conversions: 8,
            callsMade: 156,
            visitsMade: 24,
            milestoneCompletions: 45,
            consistency: 95,
        },
        badges: ['Top Evangelist', 'Consistent Caller', 'Conversion King'],
        trend: 'UP',
        points: 2850,
    }
];

export const mockZoneLeaderboard = [
    {
        zone: 'South Zone',
        coordinator: 'Pastor Mike',
        stats: {
            totalGuests: 89,
            conversions: 24,
            conversionRate: 27,
            activeWorkers: 6,
            avgResponseTime: '2.3 hours',
        },
        points: 8950,
        trend: 'UP',
    }
];

export const mockAchievements = [
    {
        id: 'first_guest',
        title: 'First Guest',
        description: 'Capture your first guest',
        rarity: 'COMMON',
        points: 100,
    }
];
