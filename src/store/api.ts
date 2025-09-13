// src/features/crm/api/crmApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Guest, User, Engagement, Milestone, ContactChannel } from './types';
import { v4 as uuid } from 'uuid';

// small helper to now ISO
const now = () => new Date().toISOString();

const generateMockGuest = (overrides: Partial<Guest> = {}): Guest => ({
    id: uuid(),
    firstName: 'John',
    lastName: 'Doe',
    phone: '+2348012345678',
    zoneId: 'zone-1',
    assignedToId: 'user-worker-1',
    createdById: 'user-worker-1',
    createdAt: now(),
    preferredChannel: ContactChannel.WHATSAPP,
    prayerRequest: 'Pray for new job',
    address: 'Lagos',
    assimilationStage: 'INVITED',
    milestones: [
        {
            id: uuid(),
            title: 'Attended First Service',
            weekNumber: 1,
            status: 'PENDING',
        } as Milestone,
    ],
    meta: {},
    ...overrides,
});

const mockGuests: Guest[] = [
    generateMockGuest({ firstName: 'Ada', assignedToId: 'user-worker-1', assimilationStage: 'INVITED' }),
    generateMockGuest({ firstName: 'Chidi', assignedToId: 'user-worker-2', assimilationStage: 'ATTENDED' }),
    generateMockGuest({ firstName: 'Ngozi', assignedToId: null, assimilationStage: 'NEW_LEAD' }),
];

const mockZones = [
    { id: 'zone-1', name: 'Surulere' },
    { id: 'zone-2', name: 'Ikeja' },
];

const mockUsers: User[] = [
    { id: 'user-worker-1', name: 'Worker 1', role: 'WORKER' as any },
    { id: 'user-worker-2', name: 'Worker 2', role: 'WORKER' as any },
    { id: 'user-coord-1', name: 'Coordinator', role: 'ZONAL_COORDINATOR' as any, zoneIds: ['zone-1'] },
];

export const crmApi = createApi({
    reducerPath: 'crmApi',
    baseQuery: fetchBaseQuery({
        baseUrl: '/api', // keep, but in dev we'll mock responses via transformResponse
    }),
    tagTypes: ['Guests', 'Zones', 'Engagements', 'Users'],
    endpoints: builder => ({
        getGuests: builder.query<Guest[], void>({
            query: () => ({ url: '/guests', method: 'GET' }),
            transformResponse() {
                // return mock data here; production: map server response -> Guest[]
                return mockGuests;
            },
            providesTags: ['Guests'],
        }),
        getGuestById: builder.query<Guest, string>({
            query: id => ({ url: `/guests/${id}`, method: 'GET' }),
            transformResponse(_res: any, _meta, arg) {
                // lookup the mock by id
                return mockGuests.find(g => g.id === arg) ?? mockGuests[0];
            },
            providesTags: result => (result ? [{ type: 'Guests', id: result.id }] : ['Guests']),
        }),
        createGuest: builder.mutation<Guest, Partial<Guest>>({
            query: guest => ({ url: '/guests', method: 'POST', body: guest }),
            transformResponse(_res: any, _meta, arg) {
                // emulate server created object
                const newGuest = generateMockGuest({ ...arg, createdAt: now() });
                mockGuests.unshift(newGuest); // in-memory mutation for dev mock
                return newGuest;
            },
            invalidatesTags: ['Guests'],
        }),
        updateGuest: builder.mutation<Guest, Partial<Guest> & { id: string }>({
            query: ({ id, ...patch }) => ({ url: `/guests/${id}`, method: 'PATCH', body: patch }),
            transformResponse(_res: any, _meta, arg) {
                const idx = mockGuests.findIndex(g => g.id === arg.id);
                if (idx >= 0) {
                    mockGuests[idx] = { ...mockGuests[idx], ...(arg as any) };
                    return mockGuests[idx];
                }
                return generateMockGuest();
            },
            invalidatesTags: result => (result ? [{ type: 'Guests', id: result.id }] : ['Guests']),
        }),
        getZones: builder.query<any[], void>({
            query: () => ({ url: '/zones', method: 'GET' }),
            transformResponse() {
                return mockZones;
            },
            providesTags: ['Zones'],
        }),
        getUsers: builder.query<User[], void>({
            query: () => ({ url: '/users', method: 'GET' }),
            transformResponse() {
                return mockUsers;
            },
            providesTags: ['Users'],
        }),
        getEngagementsForGuest: builder.query<Engagement[], string>({
            query: guestId => ({ url: `/guests/${guestId}/engagements`, method: 'GET' }),
            transformResponse(_res: any, _meta, guestId) {
                // just return simple mock engagements
                return [
                    {
                        id: uuid(),
                        guestId,
                        workerId: 'user-worker-1',
                        type: 'WHATSAPP',
                        notes: 'Shared invite',
                        timestamp: now(),
                    },
                ] as Engagement[];
            },
            providesTags: ['Engagements'],
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
} = crmApi;
