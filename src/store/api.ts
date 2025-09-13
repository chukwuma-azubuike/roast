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
} from './types';
import { v4 as uuid } from 'uuid';

// Helper to get current ISO timestamp
const now = () => new Date().toISOString();

// Mock Data Generator
const generateMockGuest = (overrides: Partial<Guest> = {}): Guest => ({
    id: uuid(),
    firstName: 'John',
    lastName: 'Doe',
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
            id: uuid(),
            title: 'Initial Contact',
            description: 'First contact with guest',
            weekNumber: 1,
            status: MilestoneStatus.PENDING,
            completedAt: null,
        },
        {
            id: uuid(),
            title: 'First Service',
            description: 'Attended first service',
            weekNumber: 2,
            status: MilestoneStatus.PENDING,
            completedAt: null,
        },
    ],
    meta: {},
    ...overrides,
});

// Initial Mock Data
const mockGuests: Guest[] = [
    generateMockGuest({
        firstName: 'Ada',
        assignedToId: 'user-worker-1',
        assimilationStage: AssimilationStage.INVITED,
        lastContact: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    }),
    generateMockGuest({
        firstName: 'Chidi',
        assignedToId: 'user-worker-2',
        assimilationStage: AssimilationStage.ATTENDED,
        lastContact: now(),
    }),
    generateMockGuest({
        firstName: 'Ngozi',
        assignedToId: null,
        assimilationStage: AssimilationStage.DISCIPLED,
    }),
];

const mockZones: Zone[] = [
    { id: 'zone-1', name: 'Surulere' },
    { id: 'zone-2', name: 'Ikeja' },
];

const mockUsers: User[] = [
    { id: 'user-worker-1', name: 'Worker 1', role: 'WORKER' as any },
    { id: 'user-worker-2', name: 'Worker 2', role: 'WORKER' as any },
    { id: 'user-coord-1', name: 'Coordinator', role: 'ZONAL_COORDINATOR' as any, zoneIds: ['zone-1'] },
];

const mockEngagements: Record<string, Engagement[]> = {};

export const crmApi = createApi({
    reducerPath: 'crmApi',
    baseQuery: fetchBaseQuery({
        baseUrl: '/api',
        prepareHeaders: headers => {
            // Add auth headers here in production
            return headers;
        },
    }),
    tagTypes: ['Guest', 'GuestList', 'Zone', 'User', 'Engagement'],
    endpoints: builder => ({
        // Guest Queries
        getGuests: builder.query<Guest[], { workerId?: string; zoneId?: string }>({
            query: params => ({
                url: '/guests',
                method: 'GET',
                params,
            }),
            transformResponse() {
                return mockGuests;
            },
            providesTags: result =>
                result
                    ? [...result.map(({ id }) => ({ type: 'Guest' as const, id })), { type: 'GuestList', id: 'LIST' }]
                    : [{ type: 'GuestList', id: 'LIST' }],
        }),

        getGuestById: builder.query<Guest, string>({
            query: id => `/guests/${id}`,
            transformResponse(_res: any, _meta, arg) {
                return mockGuests.find(g => g.id === arg) ?? mockGuests[0];
            },
            providesTags: (_result, _err, id) => [{ type: 'Guest', id }],
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
                            id: uuid(),
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

        updateGuest: builder.mutation<Guest, Partial<Guest> & { id: string }>({
            query: ({ id, ...patch }) => ({
                url: `/guests/${id}`,
                method: 'PATCH',
                body: patch,
            }),
            transformResponse(_res: any, _meta, arg) {
                const idx = mockGuests.findIndex(g => g.id === arg.id);
                if (idx >= 0) {
                    const updated = { ...mockGuests[idx], ...arg };
                    mockGuests[idx] = updated;
                    return updated;
                }
                throw new Error('Guest not found');
            },
            invalidatesTags: (_result, _error, { id }) => [
                { type: 'Guest', id },
                { type: 'GuestList', id: 'LIST' },
            ],
        }),

        // Zone Queries
        getZones: builder.query<Zone[], void>({
            query: () => '/zones',
            transformResponse() {
                return mockZones;
            },
            providesTags: result =>
                result ? [...result.map(({ id }) => ({ type: 'Zone' as const, id }))] : [{ type: 'Zone', id: 'LIST' }],
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
                result ? [...result.map(({ id }) => ({ type: 'User' as const, id }))] : [{ type: 'User', id: 'LIST' }],
        }),

        // Engagement Queries
        getEngagementsForGuest: builder.query<Engagement[], string>({
            query: guestId => `/guests/${guestId}/engagements`,
            transformResponse(_res: any, _meta, guestId) {
                if (!mockEngagements[guestId]) {
                    mockEngagements[guestId] = [
                        {
                            id: uuid(),
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
            providesTags: (_result, _error, guestId) => [{ type: 'Engagement', id: guestId }],
        }),

        addEngagement: builder.mutation<Engagement, Omit<Engagement, 'id' | 'timestamp'>>({
            query: engagement => ({
                url: `/guests/${engagement.guestId}/engagements`,
                method: 'POST',
                body: engagement,
            }),
            transformResponse(_res: any, _meta, arg) {
                const newEngagement: Engagement = {
                    ...arg,
                    id: uuid(),
                    timestamp: now(),
                };

                if (!mockEngagements[arg.guestId]) {
                    mockEngagements[arg.guestId] = [];
                }
                mockEngagements[arg.guestId].unshift(newEngagement);

                // Update guest's last contact
                const guestIndex = mockGuests.findIndex(g => g.id === arg.guestId);
                if (guestIndex >= 0) {
                    mockGuests[guestIndex] = {
                        ...mockGuests[guestIndex],
                        lastContact: now(),
                    };
                }

                return newEngagement;
            },
            invalidatesTags: (_result, _error, { guestId }) => [
                { type: 'Engagement', id: guestId },
                { type: 'Guest', id: guestId },
            ],
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
} = crmApi;
