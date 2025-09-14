// Core types
export type ID = string;

// Enums
export enum Role {
    ADMIN = 'ADMIN',
    ZONAL_COORDINATOR = 'ZONAL_COORDINATOR',
    WORKER = 'WORKER',
    PASTOR = 'PASTOR',
}

export enum AssimilationStage {
    INVITED = 'invited',
    ATTENDED = 'attended',
    DISCIPLED = 'discipled',
    JOINED = 'joined',
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

// Base interfaces
export interface User {
    _id: ID;
    name: string;
    phone?: string;
    email?: string;
    role: Role;
    zoneIds?: ID[]; // zones they coordinate
    isActive?: boolean;
}

export interface Milestone {
    _id: ID;
    title: string;
    description?: string;
    weekNumber?: number;
    status: MilestoneStatus;
    completedAt?: string | Date | null;
}

export interface Zone {
    _id: ID;
    name: string;
    coordinator?: ID;
    workers?: ID[];
    guestCounts?: {
        invited: number;
        attended: number;
        discipled: number;
        joined: number;
    };
}

export interface Timeline {
    _id: ID;
    title?: string;
    notes?: string;
    createdBy: string;
    description?: string;
    createdAt: string | Date;
    type: 'note' | 'call' | 'visit';
}

export interface Guest {
    _id: ID;
    phone: string;
    zoneId: ID;
    assignedToId?: ID | null;
    createdById?: ID;
    createdAt: string | Date; // ISO string format
    lastContact?: string | Date; // ISO string format
    preferredChannel?: ContactChannel;
    completedAt?: string | Date | null;
    prayerRequest?: string | null;
    address?: string | null;
    assimilationStage: AssimilationStage;
    nextAction?: string;
    milestones: Milestone[];
    meta?: Record<string, any>;
    name: string;
    timeline?: Timeline[];
}

export interface Engagement {
    _id: ID;
    guestId: ID;
    workerId: ID;
    type: ContactChannel;
    notes?: string;
    timestamp: string | Date;
}

// Form and request/response types
export interface GuestFormData extends Omit<Guest, '_id' | 'createdAt' | 'milestones' | 'name' | 'stage'> {
    milestones?: Partial<Omit<Milestone, '_id'>>[];
}

// Component props interfaces
export interface GuestProfileProps {
    guestId: ID;
    onClose: () => void;
}

export enum NotificationType {
    FOLLOW_UP = 'follow_up',
    STAGNANT = 'stagnant',
    MILESTONE = 'milestone',
    WELCOME = 'welcome',
    REMINDER = 'reminder',
    ASSIGNMENT = 'assignment',
}

export enum NotificationPriority {
    LOW = 'low',
    MEDIUM = 'medium',
    HIGH = 'high',
}

export interface NotificationProps {
    _id: ID;
    type: NotificationType;
    title: string;
    message: string;
    guestName?: string;
    guestId?: ID;
    createdAt: string; // ISO string format
    isRead: boolean;
    priority: NotificationPriority;
    actionRequired: boolean;
}

// Navigation and view types
export enum View {
    CAPTURE = 'capture',
    MY_GUESTS = 'myGuests',
    PROFILE = 'profile',
    ZONE = 'zone',
    GLOBAL = 'global',
    LEADERBOARDS = 'leaderboards',
    NOTIFICATIONS = 'notifications',
    PIPELINE_SETTINGS = 'pipelineSettings',
}

export type ViewType = `${View}`;
