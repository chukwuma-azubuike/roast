import React, { useState } from 'react';
import { Users, ChevronDown, Plus, MoreVertical, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { toast } from 'sonner@2.0.3';
import type { User, Guest } from '../App';

interface ZoneDashboardProps {
    currentUser: User;
}

// Mock data for zone guests
const mockZoneGuests: Guest[] = [
    {
        id: 'guest1',
        name: 'Sarah Johnson',
        phone: '+1 (555) 123-4567',
        zone: 'zone1',
        assignedWorker: 'worker1',
        stage: 'invited',
        createdAt: new Date('2024-12-10'),
        lastContact: new Date('2024-12-10'),
        nextAction: 'Follow-up call',
        milestones: [],
        timeline: [],
    },
    {
        id: 'guest2',
        name: 'Mike Chen',
        phone: '+1 (555) 987-6543',
        zone: 'zone1',
        assignedWorker: 'worker1',
        stage: 'attended',
        createdAt: new Date('2024-12-08'),
        lastContact: new Date('2024-12-12'),
        nextAction: 'Small group invite',
        milestones: [],
        timeline: [],
    },
    {
        id: 'guest3',
        name: 'Emily Rodriguez',
        phone: '+1 (555) 456-7890',
        zone: 'zone1',
        assignedWorker: 'worker2',
        stage: 'discipled',
        createdAt: new Date('2024-11-15'),
        lastContact: new Date('2024-12-13'),
        nextAction: 'Bible study check',
        milestones: [],
        timeline: [],
    },
    {
        id: 'guest4',
        name: 'David Kim',
        phone: '+1 (555) 789-0123',
        zone: 'zone1',
        assignedWorker: 'worker2',
        stage: 'joined',
        createdAt: new Date('2024-10-05'),
        lastContact: new Date('2024-12-14'),
        nextAction: 'Ministry placement',
        milestones: [],
        timeline: [],
    },
    {
        id: 'guest5',
        name: 'Lisa Zhang',
        phone: '+1 (555) 321-0987',
        zone: 'zone1',
        assignedWorker: 'worker3',
        stage: 'invited',
        createdAt: new Date('2024-12-12'),
        lastContact: new Date('2024-12-12'),
        nextAction: 'Service invitation',
        milestones: [],
        timeline: [],
    },
];

const mockWorkers = [
    { id: 'worker1', name: 'John Worker', email: 'john@church.org' },
    { id: 'worker2', name: 'Mary Helper', email: 'mary@church.org' },
    { id: 'worker3', name: 'Paul Evangelist', email: 'paul@church.org' },
];

interface KanbanColumnProps {
    title: string;
    stage: Guest['stage'];
    guests: Guest[];
    onGuestMove: (guestId: string, newStage: Guest['stage']) => void;
    onReassignWorker: (guestId: string, workerId: string) => void;
}

function KanbanColumn({ title, stage, guests, onGuestMove, onReassignWorker }: KanbanColumnProps) {
    const [draggedGuest, setDraggedGuest] = useState<string | null>(null);

    const handleDragStart = (e: React.DragEvent, guestId: string) => {
        setDraggedGuest(guestId);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        if (draggedGuest && draggedGuest !== stage) {
            onGuestMove(draggedGuest, stage);
        }
        setDraggedGuest(null);
    };

    const getStageColor = () => {
        switch (stage) {
            case 'invited':
                return 'border-blue-200 bg-blue-50';
            case 'attended':
                return 'border-green-200 bg-green-50';
            case 'discipled':
                return 'border-purple-200 bg-purple-50';
            case 'joined':
                return 'border-gray-200 bg-gray-50';
        }
    };

    const getBadgeColor = () => {
        switch (stage) {
            case 'invited':
                return 'bg-blue-100 text-blue-800';
            case 'attended':
                return 'bg-green-100 text-green-800';
            case 'discipled':
                return 'bg-purple-100 text-purple-800';
            case 'joined':
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div
            className={`flex-1 min-w-[280px] ${getStageColor()} border-2 border-dashed rounded-lg p-4 transition-colors`}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
        >
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold flex items-center space-x-2">
                    <span>{title}</span>
                    <Badge variant="secondary" className={getBadgeColor()}>
                        {guests.length}
                    </Badge>
                </h3>
            </div>

            <div className="space-y-3">
                {guests.map(guest => (
                    <Card
                        key={guest.id}
                        className="cursor-move hover:shadow-md transition-shadow bg-white"
                        draggable
                        onDragStart={e => handleDragStart(e, guest.id)}
                    >
                        <CardContent className="p-3">
                            <div className="flex items-start justify-between mb-2">
                                <div className="flex items-center space-x-2">
                                    <Avatar className="w-8 h-8">
                                        <AvatarFallback className="text-xs">
                                            {guest.name
                                                .split(' ')
                                                .map(n => n[0])
                                                .join('')}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <h4 className="font-medium text-sm">{guest.name}</h4>
                                        <p className="text-xs text-gray-500">{guest.phone}</p>
                                    </div>
                                </div>

                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                            <MoreVertical className="w-3 h-3" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => {}}>View Profile</DropdownMenuItem>
                                        <DropdownMenuItem asChild>
                                            <div className="cursor-pointer">
                                                Reassign Worker
                                                <Select
                                                    onValueChange={workerId => onReassignWorker(guest.id, workerId)}
                                                >
                                                    <SelectTrigger className="w-full mt-1">
                                                        <SelectValue placeholder="Choose worker" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {mockWorkers.map(worker => (
                                                            <SelectItem key={worker.id} value={worker.id}>
                                                                {worker.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>

                            <div className="space-y-2">
                                <div className="text-xs text-gray-600">
                                    <strong>Assigned:</strong>{' '}
                                    {mockWorkers.find(w => w.id === guest.assignedWorker)?.name || 'Unassigned'}
                                </div>

                                <div className="text-xs bg-yellow-50 border border-yellow-200 rounded p-2">
                                    <strong>Next:</strong> {guest.nextAction}
                                </div>

                                <div className="text-xs text-gray-500">
                                    Last contact: {guest.lastContact.toLocaleDateString()}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}

                {guests.length === 0 && (
                    <div className="text-center py-8 text-gray-400">
                        <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No guests in this stage</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export function ZoneDashboard({ currentUser }: ZoneDashboardProps) {
    const [guests, setGuests] = useState<Guest[]>(mockZoneGuests);
    const [selectedZone, setSelectedZone] = useState(currentUser.zone || 'zone1');

    // Filter guests by selected zone
    const zoneGuests = guests.filter(guest => guest.zone === selectedZone);

    // Group guests by stage
    const guestsByStage = {
        invited: zoneGuests.filter(g => g.stage === 'invited'),
        attended: zoneGuests.filter(g => g.stage === 'attended'),
        discipled: zoneGuests.filter(g => g.stage === 'discipled'),
        joined: zoneGuests.filter(g => g.stage === 'joined'),
    };

    const handleGuestMove = (guestId: string, newStage: Guest['stage']) => {
        setGuests(prev =>
            prev.map(guest => (guest.id === guestId ? { ...guest, stage: newStage, lastContact: new Date() } : guest))
        );
        toast.success(`Guest moved to ${newStage} stage`);
    };

    const handleReassignWorker = (guestId: string, workerId: string) => {
        setGuests(prev => prev.map(guest => (guest.id === guestId ? { ...guest, assignedWorker: workerId } : guest)));
        const worker = mockWorkers.find(w => w.id === workerId);
        toast.success(`Guest reassigned to ${worker?.name}`);
    };

    // Calculate zone stats
    const totalGuests = zoneGuests.length;
    const conversionRate = totalGuests > 0 ? Math.round((guestsByStage.joined.length / totalGuests) * 100) : 0;
    const activeThisWeek = zoneGuests.filter(g => {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return g.lastContact >= weekAgo;
    }).length;

    const zones = [
        { id: 'zone1', name: 'Central Zone' },
        { id: 'zone2', name: 'North Zone' },
        { id: 'zone3', name: 'South Zone' },
    ];

    return (
        <div className="p-4">
            {/* Header */}
            <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-2xl font-bold">Zone Dashboard</h1>
                    {currentUser.role === 'admin' || currentUser.role === 'pastor' ? (
                        <Select value={selectedZone} onValueChange={setSelectedZone}>
                            <SelectTrigger className="w-48">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {zones.map(zone => (
                                    <SelectItem key={zone.id} value={zone.id}>
                                        {zone.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    ) : (
                        <Badge variant="outline" className="text-lg px-3 py-1">
                            {zones.find(z => z.id === selectedZone)?.name}
                        </Badge>
                    )}
                </div>

                {/* Zone Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card>
                        <CardContent className="p-4 text-center">
                            <div className="text-2xl font-bold text-blue-600">{totalGuests}</div>
                            <div className="text-sm text-gray-600">Total Guests</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4 text-center">
                            <div className="text-2xl font-bold text-green-600">{conversionRate}%</div>
                            <div className="text-sm text-gray-600">Conversion Rate</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4 text-center">
                            <div className="text-2xl font-bold text-purple-600">{activeThisWeek}</div>
                            <div className="text-sm text-gray-600">Active This Week</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4 text-center">
                            <div className="text-2xl font-bold text-orange-600">{mockWorkers.length}</div>
                            <div className="text-sm text-gray-600">Active Workers</div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Instructions */}
            <Card className="mb-6">
                <CardContent className="p-4">
                    <h3 className="font-medium mb-2">Pipeline Management</h3>
                    <p className="text-sm text-gray-600 mb-2">
                        Drag and drop guest cards between stages to update their assimilation progress.
                    </p>
                    <div className="flex items-center space-x-4 text-sm">
                        <div className="flex items-center space-x-1">
                            <div className="w-3 h-3 bg-blue-500 rounded"></div>
                            <span>Invited</span>
                            <ArrowRight className="w-3 h-3" />
                        </div>
                        <div className="flex items-center space-x-1">
                            <div className="w-3 h-3 bg-green-500 rounded"></div>
                            <span>Attended</span>
                            <ArrowRight className="w-3 h-3" />
                        </div>
                        <div className="flex items-center space-x-1">
                            <div className="w-3 h-3 bg-purple-500 rounded"></div>
                            <span>Discipled</span>
                            <ArrowRight className="w-3 h-3" />
                        </div>
                        <div className="flex items-center space-x-1">
                            <div className="w-3 h-3 bg-gray-500 rounded"></div>
                            <span>Joined</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Kanban Board */}
            <div className="flex space-x-4 overflow-x-auto pb-4">
                <KanbanColumn
                    title="Invited"
                    stage="invited"
                    guests={guestsByStage.invited}
                    onGuestMove={handleGuestMove}
                    onReassignWorker={handleReassignWorker}
                />
                <KanbanColumn
                    title="Attended"
                    stage="attended"
                    guests={guestsByStage.attended}
                    onGuestMove={handleGuestMove}
                    onReassignWorker={handleReassignWorker}
                />
                <KanbanColumn
                    title="Discipled"
                    stage="discipled"
                    guests={guestsByStage.discipled}
                    onGuestMove={handleGuestMove}
                    onReassignWorker={handleReassignWorker}
                />
                <KanbanColumn
                    title="Joined Workforce"
                    stage="joined"
                    guests={guestsByStage.joined}
                    onGuestMove={handleGuestMove}
                    onReassignWorker={handleReassignWorker}
                />
            </div>
        </div>
    );
}
