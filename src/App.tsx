import React, { useState } from 'react';
import { Users, Plus, BarChart3, Trophy, Bell, User } from 'lucide-react';
import { Button } from './components/ui/button';
import { Badge } from './components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select';
import { Toaster } from './components/ui/sonner';

import { GuestCaptureForm } from './components/GuestCaptureForm';
import { MyGuestsDashboard } from './components/MyGuestsDashboard';
import { GuestProfile } from './components/GuestProfile';
import { ZoneDashboard } from './components/ZoneDashboard';
import { GlobalDashboard } from './components/GlobalDashboard';
import { Leaderboards } from './components/Leaderboards';
import { NotificationCenter } from './components/NotificationCenter';

// Mock data and types
export interface Guest {
    id: string;
    name: string;
    phone: string;
    zone: string;
    assignedWorker: string;
    stage: 'invited' | 'attended' | 'discipled' | 'joined';
    createdAt: Date;
    lastContact: Date;
    nextAction: string;
    address?: string;
    prayerRequest?: string;
    milestones: {
        id: string;
        title: string;
        completed: boolean;
        completedAt?: Date;
    }[];
    timeline: {
        id: string;
        type: 'call' | 'visit' | 'whatsapp' | 'note' | 'milestone';
        description: string;
        createdAt: Date;
        createdBy: string;
    }[];
}

export interface User {
    id: string;
    name: string;
    role: 'worker' | 'coordinator' | 'admin' | 'pastor';
    zone?: string;
    email: string;
}

export interface Zone {
    id: string;
    name: string;
    coordinator: string;
    workers: string[];
    guestCounts: {
        invited: number;
        attended: number;
        discipled: number;
        joined: number;
    };
}

// Mock current user - in real app this would come from auth
const mockCurrentUser: User = {
    id: 'user1',
    name: 'John Worker',
    role: 'worker',
    zone: 'zone1',
    email: 'john@church.org',
};

type ViewType = 'capture' | 'myGuests' | 'profile' | 'zone' | 'global' | 'leaderboards' | 'notifications';

export default function App() {
    const [currentView, setCurrentView] = useState<ViewType>('myGuests');
    const [currentUser, setCurrentUser] = useState<User>(mockCurrentUser);
    const [selectedGuest, setSelectedGuest] = useState<string | null>(null);

    // Role-based navigation items
    const getNavigationItems = () => {
        const baseItems = [
            {
                id: 'capture',
                label: 'New Guest',
                icon: Plus,
                roles: ['worker'],
            },
            {
                id: 'myGuests',
                label: 'My Guests',
                icon: Users,
                roles: ['worker'],
            },
            {
                id: 'zone',
                label: 'Zone Dashboard',
                icon: BarChart3,
                roles: ['coordinator', 'admin', 'pastor'],
            },
            {
                id: 'global',
                label: 'Global Dashboard',
                icon: BarChart3,
                roles: ['admin', 'pastor'],
            },
            {
                id: 'leaderboards',
                label: 'Leaderboards',
                icon: Trophy,
                roles: ['worker', 'coordinator', 'admin', 'pastor'],
            },
            {
                id: 'notifications',
                label: 'Notifications',
                icon: Bell,
                roles: ['worker', 'coordinator', 'admin', 'pastor'],
            },
        ];

        return baseItems.filter(item => item.roles.includes(currentUser.role));
    };

    const navigationItems = getNavigationItems();

    const handleViewGuest = (guestId: string) => {
        setSelectedGuest(guestId);
        setCurrentView('profile');
    };

    const handleBackFromProfile = () => {
        setSelectedGuest(null);
        setCurrentView('myGuests');
    };

    const renderCurrentView = () => {
        switch (currentView) {
            case 'capture':
                return (
                    <GuestCaptureForm currentUser={currentUser} onGuestCaptured={() => setCurrentView('myGuests')} />
                );
            case 'myGuests':
                return <MyGuestsDashboard currentUser={currentUser} onViewGuest={handleViewGuest} />;
            case 'profile':
                return <GuestProfile guestId={selectedGuest} onBack={handleBackFromProfile} />;
            case 'zone':
                return <ZoneDashboard currentUser={currentUser} />;
            case 'global':
                return <GlobalDashboard />;
            case 'leaderboards':
                return <Leaderboards currentUser={currentUser} />;
            case 'notifications':
                return <NotificationCenter currentUser={currentUser} />;
            default:
                return <MyGuestsDashboard currentUser={currentUser} onViewGuest={handleViewGuest} />;
        }
    };

    // Role switcher for demo purposes
    const handleRoleSwitch = (role: string) => {
        setCurrentUser({
            ...currentUser,
            role: role as User['role'],
            zone: role === 'admin' || role === 'pastor' ? undefined : 'zone1',
        });
        // Reset to appropriate default view for role
        if (role === 'worker') {
            setCurrentView('myGuests');
        } else if (role === 'coordinator') {
            setCurrentView('zone');
        } else {
            setCurrentView('global');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
                <div className="px-4 py-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                <Users className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h1 className="text-lg font-semibold">Roast</h1>
                                <p className="text-sm text-gray-500">{currentUser.name}</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            {/* Role Switcher - Demo Only */}
                            <Select value={currentUser.role} onValueChange={handleRoleSwitch}>
                                <SelectTrigger className="w-32">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="worker">Worker</SelectItem>
                                    <SelectItem value="coordinator">Coordinator</SelectItem>
                                    <SelectItem value="admin">Admin</SelectItem>
                                    <SelectItem value="pastor">Pastor</SelectItem>
                                </SelectContent>
                            </Select>
                            <Badge variant="outline" className="capitalize hidden sm:inline">
                                {currentUser.role}
                            </Badge>
                        </div>
                    </div>
                </div>
            </header>

            {/* Navigation */}
            <nav className="bg-white border-b border-gray-200">
                <div className="px-4 py-2">
                    <div className="flex space-x-1 overflow-x-auto">
                        {navigationItems.map(item => {
                            const Icon = item.icon;
                            const isActive = currentView === item.id;
                            return (
                                <Button
                                    key={item.id}
                                    variant={isActive ? 'default' : 'ghost'}
                                    size="sm"
                                    className="flex items-center sm:space-x-2 whitespace-nowrap"
                                    onClick={() => setCurrentView(item.id as ViewType)}
                                >
                                    <Icon className="w-4 h-4" />
                                    <span className="hidden sm:inline">{item.label}</span>
                                </Button>
                            );
                        })}
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="pb-4">{renderCurrentView()}</main>

            {/* Toast Notifications */}
            <Toaster />
        </div>
    );
}
