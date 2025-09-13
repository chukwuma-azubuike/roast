export enum Role {
    ADMIN = 'ADMIN',
    ZONAL_COORDINATOR = 'ZONAL_COORDINATOR',
    WORKER = 'WORKER',
    PASTOR = 'PASTOR',
}

export type ID = string;

export enum AssimilationStage {
    INVITED = 'invited',
    ATTENDED = 'attended',
    DISCIPLED = 'discipled',
    JOINED = 'joined',
}

export interface User {
    id: ID;
    name: string;
    phone?: string;
    email?: string;
    role: Role;
    zoneIds?: ID[]; // zones they coordinate
    isActive?: boolean;
}

export enum ContactChannel {
    CALL = 'CALL',
    WHATSAPP = 'WHATSAPP',
    SMS = 'SMS',
    EMAIL = 'EMAIL',
    VISIT = 'VISIT',
    MEETING = 'MEETING',
}

export enum MilestoneStatus {
    PENDING = 'PENDING',
    COMPLETED = 'COMPLETED',
    SKIPPED = 'SKIPPED',
}

export interface Milestone {
    id: ID;
    title: string;
    description?: string;
    weekNumber?: number;
    status: MilestoneStatus;
    completedAt?: string | null;
}

export interface Engagement {
    id: ID;
    guestId: ID;
    workerId: ID;
    type: ContactChannel;
    notes?: string;
    timestamp: string;
}

export interface Zone {
    id: ID;
    name: string;
}

export interface Guest {
    id: ID;
    firstName: string;
    lastName?: string;
    phone: string;
    zoneId?: ID;
    assignedToId?: ID | null;
    createdById?: ID;
    createdAt: string;
    lastContact?: string;
    preferredChannel?: ContactChannel;
    prayerRequest?: string | null;
    address?: string | null;
    assimilationStage: AssimilationStage;
    nextAction?: string;
    milestones: Milestone[];
    meta?: Record<string, any>;
}

export interface GuestFormData extends Omit<Guest, 'id' | 'createdAt' | 'milestones'> {
    milestones?: Partial<Milestone>[];
}
