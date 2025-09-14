import React, { useState } from 'react';
import { Users, Plus, BarChart3, Trophy, Bell, UserIcon, Settings } from 'lucide-react';
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
import { PipelineSettings } from './components/PipelineSettings';

import { User, Role, ViewType, View } from './store/types';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { useGetUsersQuery } from './store/api';

// Mock current user - in real app this would come from auth
const mockCurrentUser: User = {
    _id: 'user1',
    name: 'John Worker',
    role: Role.WORKER,
    zoneIds: ['zone1'],
    email: 'john@church.org',
    isActive: true,
};

// ViewType moved to store/types.ts

export default function App() {
    const [currentView, setCurrentView] = useState<ViewType>(View.MY_GUESTS);
    const [currentUser, setCurrentUser] = useState<User>(mockCurrentUser);
    const [selectedGuest, setSelectedGuest] = useState<string | null>(null);

    // Role-based navigation items
    const getNavigationItems = () => {
        const baseItems = [
            {
                id: View.CAPTURE,
                label: 'New Guest',
                icon: Plus,
                roles: [Role.WORKER, Role.ZONAL_COORDINATOR, Role.ADMIN, Role.PASTOR],
            },
            {
                id: View.MY_GUESTS,
                label: 'My Guests',
                icon: Users,
                roles: [Role.WORKER, Role.ZONAL_COORDINATOR, Role.ADMIN, Role.PASTOR],
            },
            {
                id: View.ZONE,
                label: 'Zone Dashboard',
                icon: BarChart3,
                roles: [Role.ZONAL_COORDINATOR, Role.ADMIN, Role.PASTOR],
            },
            {
                id: View.GLOBAL,
                label: 'Global Dashboard',
                icon: BarChart3,
                roles: [Role.ADMIN, Role.PASTOR],
            },
            {
                id: View.LEADERBOARDS,
                label: 'Leaderboards',
                icon: Trophy,
                roles: [Role.WORKER, Role.ZONAL_COORDINATOR, Role.ADMIN, Role.PASTOR],
            },
            {
                id: View.NOTIFICATIONS,
                label: 'Notifications',
                icon: Bell,
                roles: [Role.WORKER, Role.ZONAL_COORDINATOR, Role.ADMIN, Role.PASTOR],
            },
            {
                id: View.PIPELINE_SETTINGS,
                label: 'Pipeline Settings',
                icon: Settings,
                roles: [Role.ADMIN, Role.PASTOR],
            },
        ];

        return baseItems.filter(item => item.roles.includes(currentUser.role));
    };

    const navigationItems = getNavigationItems();

    const handleViewGuest = (guestId: string) => {
        setSelectedGuest(guestId);
        setCurrentView(View.PROFILE);
    };

    const handleBackFromProfile = () => {
        setSelectedGuest(null);
        setCurrentView(View.MY_GUESTS);
    };

    const renderCurrentView = () => {
        switch (currentView) {
            case View.CAPTURE:
                return (
                    <GuestCaptureForm
                        currentUser={currentUser}
                        onGuestCaptured={() => setCurrentView(View.MY_GUESTS)}
                    />
                );
            case View.MY_GUESTS:
                return <MyGuestsDashboard currentUser={currentUser} onViewGuest={handleViewGuest} />;
            case View.PROFILE:
                return <GuestProfile guestId={selectedGuest} onBack={handleBackFromProfile} />;
            case View.ZONE:
                return <ZoneDashboard currentUser={currentUser} />;
            case View.GLOBAL:
                return <GlobalDashboard />;
            case View.LEADERBOARDS:
                return <Leaderboards currentUser={currentUser} />;
            case View.NOTIFICATIONS:
                return <NotificationCenter currentUser={currentUser} />;
            case View.PIPELINE_SETTINGS:
                return <PipelineSettings currentUser={currentUser} />;
            default:
                return <MyGuestsDashboard currentUser={currentUser} onViewGuest={handleViewGuest} />;
        }
    };

    // Role switcher for demo purposes
    const handleRoleSwitch = (role: Role) => {
        setCurrentUser({
            ...currentUser,
            role,
            zoneIds: role === Role.ADMIN || role === Role.PASTOR ? [] : ['zone1'],
        });
        // Reset to appropriate default view for role
        if (role === Role.WORKER) {
            setCurrentView(View.MY_GUESTS);
        } else if (role === Role.ZONAL_COORDINATOR) {
            setCurrentView(View.ZONE);
        } else {
            setCurrentView(View.GLOBAL);
        }
    };

    return (
        <Provider store={store}>
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
                                <Select value={currentUser.role} onValueChange={role => handleRoleSwitch(role as Role)}>
                                    <SelectTrigger className="w-32">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value={Role.WORKER}>Worker</SelectItem>
                                        <SelectItem value={Role.ZONAL_COORDINATOR}>Coordinator</SelectItem>
                                        <SelectItem value={Role.ADMIN}>Admin</SelectItem>
                                        <SelectItem value={Role.PASTOR}>Pastor</SelectItem>
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
        </Provider>
    );
}
