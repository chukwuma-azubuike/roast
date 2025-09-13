export enum Role {
    ADMIN = 'ADMIN',
    ZONAL_COORDINATOR = 'ZONAL_COORDINATOR',
    WORKER = 'WORKER',
    PASTOR = 'PASTOR',
}

export type ID = string;

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
    type: ContactChannel | 'VISIT' | 'MEETING';
    notes?: string;
    timestamp: string;
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
    preferredChannel?: ContactChannel;
    prayerRequest?: string | null;
    address?: string | null;
    assimilationStage: string; // stage key, configurable
    milestones: Milestone[];
    meta?: Record<string, any>;
}
