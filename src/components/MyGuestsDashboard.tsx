import React, { useState } from 'react';
import { Phone, MessageCircle, Calendar, Clock, ChevronRight, Search, Filter } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import type { User, Guest } from '../App';

interface MyGuestsDashboardProps {
    currentUser: User;
    onViewGuest: (guestId: string) => void;
}

// Mock guests data
const mockGuests: Guest[] = [
    {
        id: 'guest1',
        name: 'Sarah Johnson',
        phone: '+1 (555) 123-4567',
        zone: 'zone1',
        assignedWorker: 'user1',
        stage: 'invited',
        createdAt: new Date('2024-12-10'),
        lastContact: new Date('2024-12-10'),
        nextAction: 'Follow-up call tomorrow',
        address: '123 Main St, City',
        milestones: [
            { id: 'm1', title: 'Initial Contact', completed: true, completedAt: new Date('2024-12-10') },
            { id: 'm2', title: 'First Phone Call', completed: false },
            { id: 'm3', title: 'Service Invitation', completed: false },
            { id: 'm4', title: 'First Visit', completed: false },
        ],
        timeline: [
            {
                id: 't1',
                type: 'note',
                description: 'Met during street evangelism. Interested in learning more about faith.',
                createdAt: new Date('2024-12-10'),
                createdBy: 'user1',
            },
        ],
    },
    {
        id: 'guest2',
        name: 'Mike Chen',
        phone: '+1 (555) 987-6543',
        zone: 'zone1',
        assignedWorker: 'user1',
        stage: 'attended',
        createdAt: new Date('2024-12-08'),
        lastContact: new Date('2024-12-12'),
        nextAction: 'Invite to small group',
        milestones: [
            { id: 'm1', title: 'Initial Contact', completed: true, completedAt: new Date('2024-12-08') },
            { id: 'm2', title: 'First Phone Call', completed: true, completedAt: new Date('2024-12-09') },
            { id: 'm3', title: 'Service Invitation', completed: true, completedAt: new Date('2024-12-11') },
            { id: 'm4', title: 'First Visit', completed: true, completedAt: new Date('2024-12-12') },
            { id: 'm5', title: 'Small Group Invitation', completed: false },
        ],
        timeline: [
            {
                id: 't1',
                type: 'note',
                description: 'Attended Sunday service. Very engaged during worship.',
                createdAt: new Date('2024-12-12'),
                createdBy: 'user1',
            },
        ],
    },
    {
        id: 'guest3',
        name: 'Emily Rodriguez',
        phone: '+1 (555) 456-7890',
        zone: 'zone1',
        assignedWorker: 'user1',
        stage: 'discipled',
        createdAt: new Date('2024-11-15'),
        lastContact: new Date('2024-12-13'),
        nextAction: 'Check progress on Bible study',
        milestones: [
            { id: 'm1', title: 'Initial Contact', completed: true, completedAt: new Date('2024-11-15') },
            { id: 'm2', title: 'First Phone Call', completed: true, completedAt: new Date('2024-11-16') },
            { id: 'm3', title: 'Service Invitation', completed: true, completedAt: new Date('2024-11-18') },
            { id: 'm4', title: 'First Visit', completed: true, completedAt: new Date('2024-11-20') },
            { id: 'm5', title: 'Small Group Invitation', completed: true, completedAt: new Date('2024-11-25') },
            { id: 'm6', title: 'Bible Study Started', completed: true, completedAt: new Date('2024-12-01') },
            { id: 'm7', title: 'Baptism Preparation', completed: false },
        ],
        timeline: [
            {
                id: 't1',
                type: 'note',
                description: 'Completed first month of Bible study. Showing great spiritual growth.',
                createdAt: new Date('2024-12-13'),
                createdBy: 'user1',
            },
        ],
    },
];

export function MyGuestsDashboard({ currentUser, onViewGuest }: MyGuestsDashboardProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('new');

    // Filter guests by current user and search term
    const userGuests = mockGuests.filter(
        guest => guest.assignedWorker === currentUser.id && guest.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Categorize guests by stage
    const categorizedGuests = {
        new: userGuests.filter(guest => guest.stage === 'invited'),
        inProgress: userGuests.filter(guest => guest.stage === 'attended' || guest.stage === 'discipled'),
        completed: userGuests.filter(guest => guest.stage === 'joined'),
    };

    const getStageColor = (stage: Guest['stage']) => {
        switch (stage) {
            case 'invited':
                return 'bg-blue-100 text-blue-800';
            case 'attended':
                return 'bg-green-100 text-green-800';
            case 'discipled':
                return 'bg-purple-100 text-purple-800';
            case 'joined':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getProgressPercentage = (milestones: Guest['milestones']) => {
        const completed = milestones.filter(m => m.completed).length;
        return Math.round((completed / milestones.length) * 100);
    };

    const getDaysSinceContact = (lastContact: Date) => {
        const today = new Date();
        const diffTime = today.getTime() - lastContact.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    const GuestCard = ({ guest }: { guest: Guest }) => {
        const progress = getProgressPercentage(guest.milestones);
        const daysSinceContact = getDaysSinceContact(guest.lastContact);

        return (
            <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => onViewGuest(guest.id)}>
                <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                            <Avatar className="w-10 h-10">
                                <AvatarFallback>
                                    {guest.name
                                        .split(' ')
                                        .map(n => n[0])
                                        .join('')}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <h3 className="font-medium">{guest.name}</h3>
                                <p className="text-sm text-gray-500">{guest.phone}</p>
                            </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Badge variant="secondary" className={getStageColor(guest.stage)}>
                                {guest.stage.charAt(0).toUpperCase() + guest.stage.slice(1)}
                            </Badge>
                            <span className="text-sm text-gray-500">{progress}% complete</span>
                        </div>

                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${progress}%` }}
                            />
                        </div>

                        <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center space-x-1 text-gray-600">
                                <Clock className="w-4 h-4" />
                                <span>
                                    {daysSinceContact === 0
                                        ? 'Today'
                                        : daysSinceContact === 1
                                          ? 'Yesterday'
                                          : `${daysSinceContact} days ago`}
                                </span>
                            </div>
                            <div className="flex space-x-2">
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={e => {
                                        e.stopPropagation();
                                        window.open(`tel:${guest.phone}`, '_self');
                                    }}
                                >
                                    <Phone className="w-3 h-3" />
                                </Button>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={e => {
                                        e.stopPropagation();
                                        window.open(`https://wa.me/${guest.phone.replace(/\D/g, '')}`, '_blank');
                                    }}
                                >
                                    <MessageCircle className="w-3 h-3" />
                                </Button>
                            </div>
                        </div>

                        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-2 rounded">
                            <p className="text-sm text-yellow-800">
                                <strong>Next:</strong> {guest.nextAction}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    };

    const TabContent = ({ guests }: { guests: Guest[] }) => (
        <div className="space-y-3">
            {guests.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                    <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No guests in this category</p>
                    <p className="text-sm">Start capturing new guests to see them here</p>
                </div>
            ) : (
                guests.map(guest => <GuestCard key={guest.id} guest={guest} />)
            )}
        </div>
    );

    return (
        <div className="p-4 max-w-4xl mx-auto">
            {/* Header with Stats */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold mb-4">My Guests</h1>
                <div className="grid grid-cols-3 gap-4">
                    <Card className="text-center">
                        <CardContent className="p-4">
                            <div className="text-2xl font-bold text-blue-600">{categorizedGuests.new.length}</div>
                            <div className="text-sm text-gray-600">New</div>
                        </CardContent>
                    </Card>
                    <Card className="text-center">
                        <CardContent className="p-4">
                            <div className="text-2xl font-bold text-green-600">
                                {categorizedGuests.inProgress.length}
                            </div>
                            <div className="text-sm text-gray-600">In Progress</div>
                        </CardContent>
                    </Card>
                    <Card className="text-center">
                        <CardContent className="p-4">
                            <div className="text-2xl font-bold text-purple-600">
                                {categorizedGuests.completed.length}
                            </div>
                            <div className="text-sm text-gray-600">Completed</div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Search */}
            <div className="mb-4">
                <div className="relative">
                    <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <Input
                        placeholder="Search guests..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="new">New ({categorizedGuests.new.length})</TabsTrigger>
                    <TabsTrigger value="inProgress">In Progress ({categorizedGuests.inProgress.length})</TabsTrigger>
                    <TabsTrigger value="completed">Completed ({categorizedGuests.completed.length})</TabsTrigger>
                </TabsList>

                <TabsContent value="new" className="mt-4">
                    <TabContent guests={categorizedGuests.new} />
                </TabsContent>

                <TabsContent value="inProgress" className="mt-4">
                    <TabContent guests={categorizedGuests.inProgress} />
                </TabsContent>

                <TabsContent value="completed" className="mt-4">
                    <TabContent guests={categorizedGuests.completed} />
                </TabsContent>
            </Tabs>
        </div>
    );
}
