import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
    Guest,
    User,
    Engagement,
    MilestoneStatus,
    ContactChannel,
    Zone,
    AssimilationStage,
    GuestFormData,
    Role,
    NotificationProps,
    NotificationType,
    NotificationPriority,
} from './types';
import { v4 as uuid } from 'uuid';

// Helper to get current ISO timestamp
const now = () => new Date();

// Mock Data Generator
const generateMockGuest = (overrides: Partial<Guest> = {}): Guest => ({
    _id: uuid(),
    name: 'John Doe',
    phone: '+2348012345678',
    zoneId: 'zone-1',
    assignedToId: 'user-worker-1',
    createdById: 'user-worker-1',
    createdAt: now(),
    lastContact: now(),
    preferredChannel: ContactChannel.WHATSAPP,
    prayerRequest: 'Pray for new job',
    address: 'Lagos',
    nextAction: 'Follow up via call',
    assimilationStage: AssimilationStage.INVITED,
    milestones: [
        {
            _id: uuid(),
            title: 'Initial Contact',
            description: 'First contact with guest',
            weekNumber: 1,
            status: MilestoneStatus.PENDING,
            completedAt: null,
        },
        {
            _id: uuid(),
            title: 'First Service',
            description: 'Attended first service',
            weekNumber: 2,
            status: MilestoneStatus.COMPLETED,
            completedAt: now(),
        },
        {
            _id: uuid(),
            title: 'Second Service',
            description: 'Attended second service',
            weekNumber: 3,
            status: MilestoneStatus.COMPLETED,
            completedAt: now(),
        },
    ],
    meta: {},
    ...overrides,
});

// Initial Mock Data
const mockGuests: Guest[] = [
    generateMockGuest({
        name: 'Remi Lawal',
        assignedToId: 'user-worker-1',
        assimilationStage: AssimilationStage.INVITED,
        lastContact: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    }),
    generateMockGuest({
        name: 'Chidi Uba',
        assignedToId: 'user-worker-2',
        assimilationStage: AssimilationStage.ATTENDED,
        lastContact: now(),
    }),
    generateMockGuest({
        name: 'Ngozi Udo',
        assignedToId: 'user-worker-3',
        assimilationStage: AssimilationStage.DISCIPLED,
    }),
    generateMockGuest({
        name: 'Usman Jankin',
        assignedToId: 'user-worker-3',
        assimilationStage: AssimilationStage.JOINED,
    }),
];

const mockZones: Zone[] = [
    { _id: 'zone-1', name: 'Surulere' },
    { _id: 'zone-2', name: 'Ikeja' },
];

const mockUsers: User[] = [
    { _id: 'user-worker-1', name: 'Worker 1', role: Role.WORKER },
    { _id: 'user-worker-2', name: 'Worker 2', role: Role.WORKER },
    { _id: 'user-coord-1', name: 'Coordinator', role: Role.ZONAL_COORDINATOR, zoneIds: ['zone-1'] },
];

const mockEngagements: Record<string, Engagement[]> = {};

// Mock current user for development
const mockCurrentUser: User = {
    _id: 'current-user',
    name: 'John Doe',
    email: 'john@church.org',
    phone: '+2348012345678',
    role: Role.WORKER,
    isActive: true,
    zoneIds: ['zone-1'],
};

// Mock notification data
const mockNotifications: NotificationProps[] = [
    {
        _id: uuid(),
        type: NotificationType.FOLLOW_UP,
        title: 'Follow-up Due',
        message: "Sarah Johnson needs a follow-up call - it's been 2 days since last contact",
        guestName: 'Sarah Johnson',
        guestId: 'guest1',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
        isRead: false,
        priority: NotificationPriority.HIGH,
        actionRequired: true,
    },
    {
        _id: uuid(),
        type: NotificationType.MILESTONE,
        title: 'Milestone Completed',
        message: 'Mike Chen completed "First Visit" milestone',
        guestName: 'Mike Chen',
        guestId: 'guest2',
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
        isRead: false,
        priority: NotificationPriority.MEDIUM,
        actionRequired: false,
    },
    {
        _id: uuid(),
        type: NotificationType.STAGNANT,
        title: 'Guest Needs Attention',
        message: "Emily Rodriguez hasn't had contact in 7 days and may be losing interest",
        guestName: 'Emily Rodriguez',
        guestId: 'guest3',
        createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
        isRead: true,
        priority: NotificationPriority.HIGH,
        actionRequired: true,
    },
    {
        _id: uuid(),
        type: NotificationType.ASSIGNMENT,
        title: 'New Guest Assigned',
        message: 'Lisa Zhang has been assigned to you for follow-up',
        guestName: 'Lisa Zhang',
        guestId: 'guest5',
        createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
        isRead: true,
        priority: NotificationPriority.MEDIUM,
        actionRequired: true,
    },
    {
        _id: uuid(),
        type: NotificationType.REMINDER,
        title: 'Weekly Report Due',
        message: 'Your weekly guest activity report is due tomorrow',
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
        isRead: true,
        priority: NotificationPriority.MEDIUM,
        actionRequired: true,
    },
    {
        _id: uuid(),
        type: NotificationType.WELCOME,
        title: 'Welcome Message Sent',
        message: 'Welcome message sent to David Kim via WhatsApp',
        guestName: 'David Kim',
        guestId: 'guest4',
        createdAt: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(), // 1.5 days ago
        isRead: true,
        priority: NotificationPriority.LOW,
        actionRequired: false,
    },
];

export const crmApi = createApi({
    reducerPath: 'crmApi',

    baseQuery: fetchBaseQuery({
        baseUrl: 'https://coza-global-api.onrender.com/api/role/getRoles', // Placeholder URL
        prepareHeaders: headers => {
            // Add auth headers here in production
            return headers;
        },
    }),

    tagTypes: ['Guest', 'GuestList', 'Zone', 'User', 'Engagement', 'Notification', 'CurrentUser'],

    refetchOnReconnect: true,
    refetchOnFocus: true,

    endpoints: builder => ({
        // Guest Queries
        getGuests: builder.query<Guest[], { workerId?: string; zoneId?: string }>({
            query: params => ({
                url: '/',
                method: 'GET',
                params,
            }),
            transformResponse(data: Guest[]) {
                return mockGuests;
            },
            providesTags: result =>
                result
                    ? [
                          ...result.map(({ _id }) => ({ type: 'Guest' as const, _id })),
                          { type: 'GuestList', _id: 'LIST' },
                      ]
                    : [{ type: 'GuestList', _id: 'LIST' }],
        }),

        getGuestById: builder.query<Guest, string>({
            query: _id => `/guests/${_id}`,
            transformResponse(_res: any, _meta, arg) {
                return mockGuests.find(g => g._id === arg) ?? mockGuests[0];
            },
            providesTags: (_result, _err, _id) => [{ type: 'Guest', _id }],
        }),

        createGuest: builder.mutation<Guest, GuestFormData>({
            query: guest => ({
                url: '/guests',
                method: 'POST',
                body: guest,
            }),
            transformResponse(_res: any, _meta, arg) {
                const newGuest = generateMockGuest({
                    ...arg,
                    createdAt: now(),
                    lastContact: now(),
                    milestones:
                        arg.milestones?.map(m => ({
                            _id: uuid(),
                            title: m.title || '',
                            description: m.description,
                            weekNumber: m.weekNumber,
                            status: m.status || MilestoneStatus.PENDING,
                            completedAt: m.completedAt,
                        })) || [],
                });
                mockGuests.unshift(newGuest);
                return newGuest;
            },
            invalidatesTags: [{ type: 'GuestList', id: 'LIST' }],
        }),

        updateGuest: builder.mutation<Guest, Partial<Guest> & { _id: string }>({
            query: ({ _id, ...patch }) => ({
                url: `/guests/${_id}`,
                method: 'PATCH',
                body: patch,
            }),
            transformResponse(_res: any, _meta, arg) {
                const idx = mockGuests.findIndex(g => g._id === arg._id);
                if (idx >= 0) {
                    const updated = { ...mockGuests[idx], ...arg };
                    mockGuests[idx] = updated;
                    return updated;
                }
                throw new Error('Guest not found');
            },
            invalidatesTags: (_result, _error, { _id }) => [
                { type: 'Guest', _id },
                { type: 'GuestList', _id: 'LIST' },
            ],
        }),

        // Zone Queries
        getZones: builder.query<Zone[], void>({
            query: () => '/zones',
            transformResponse() {
                return mockZones;
            },
            providesTags: result =>
                result
                    ? [...result.map(({ _id }) => ({ type: 'Zone' as const, _id }))]
                    : [{ type: 'Zone', _id: 'LIST' }],
        }),

        // User Queries
        getUsers: builder.query<User[], { role?: string; zoneId?: string }>({
            query: params => ({
                url: '/users',
                method: 'GET',
                params,
            }),
            transformResponse() {
                return mockUsers;
            },
            providesTags: result =>
                result
                    ? [...result.map(({ _id }) => ({ type: 'User' as const, _id }))]
                    : [{ type: 'User', _id: 'LIST' }],
        }),

        // Engagement Queries
        getEngagementsForGuest: builder.query<Engagement[], string>({
            query: guestId => `/guests/${guestId}/engagements`,
            transformResponse(_res: any, _meta, guestId) {
                if (!mockEngagements[guestId]) {
                    mockEngagements[guestId] = [
                        {
                            _id: uuid(),
                            guestId,
                            workerId: 'user-worker-1',
                            type: ContactChannel.WHATSAPP,
                            notes: 'Initial contact made',
                            timestamp: now(),
                        },
                    ];
                }
                return mockEngagements[guestId];
            },
            providesTags: (_result, _error, guestId) => [{ type: 'Engagement', _id: guestId }],
        }),

        addEngagement: builder.mutation<Engagement, Omit<Engagement, '_id' | 'timestamp'>>({
            query: engagement => ({
                url: `/guests/${engagement.guestId}/engagements`,
                method: 'POST',
                body: engagement,
            }),
            transformResponse(_res: any, _meta, arg) {
                const newEngagement: Engagement = {
                    ...arg,
                    _id: uuid(),
                    timestamp: now(),
                };

                if (!mockEngagements[arg.guestId]) {
                    mockEngagements[arg.guestId] = [];
                }
                mockEngagements[arg.guestId].unshift(newEngagement);

                // Update guest's last contact
                const guestIndex = mockGuests.findIndex(g => g._id === arg.guestId);
                if (guestIndex >= 0) {
                    mockGuests[guestIndex] = {
                        ...mockGuests[guestIndex],
                        lastContact: now(),
                    };
                }

                return newEngagement;
            },
            invalidatesTags: (_result, _error, { guestId }) => [
                { type: 'Engagement', _id: guestId },
                { type: 'Guest', _id: guestId },
            ],
        }),

        // Notification Queries
        getNotifications: builder.query<NotificationProps[], void>({
            // query: () => '/notifications',
            query: () => '/',
            transformResponse() {
                return mockNotifications;
            },
            // providesTags: result =>
            //     result
            //         ? [...result.map(({ _id }) => ({ type: 'Notification' as const, _id }))]
            //         : [{ type: 'Notification', _id: 'LIST' }],
        }),

        markNotificationAsRead: builder.mutation<NotificationProps, string>({
            query: _id => ({
                // url: `/notifications/${_id}/read`,
                url: '/',
                method: 'PATCH',
            }),
            transformResponse(_res: any, _meta, _id) {
                const idx = mockNotifications.findIndex(n => n._id === _id);
                if (idx >= 0) {
                    mockNotifications[idx] = { ...mockNotifications[idx], isRead: true };
                    return mockNotifications[idx];
                }
                throw new Error('Notification not found');
            },
            invalidatesTags: (_result, _error, _id) => [{ type: 'Notification', _id }],
        }),

        // Current User Query
        getCurrentUser: builder.query<User, void>({
            query: () => '/me',
            transformResponse() {
                return mockCurrentUser;
            },
            providesTags: ['CurrentUser'],
        }),
    }),
});

export const {
    useGetGuestsQuery,
    useGetGuestByIdQuery,
    useCreateGuestMutation,
    useUpdateGuestMutation,
    useGetZonesQuery,
    useGetUsersQuery,
    useGetEngagementsForGuestQuery,
    useAddEngagementMutation,
    useGetNotificationsQuery,
    useMarkNotificationAsReadMutation,
    useGetCurrentUserQuery,
} = crmApi;
