import React, { useState } from 'react';
import {
    Users,
    MoreVertical,
    ArrowRight,
    UserX,
    UserCheck,
    X,
    LayoutGrid,
    List,
    Phone,
    MessageCircle,
    MapPin,
    Search,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Checkbox } from './ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { ToggleGroup, ToggleGroupItem } from './ui/toggle-group';
import { Input } from './ui/input';

import { GuestReassignmentDialog } from './GuestReassignmentDialog';
import { toast } from 'sonner';
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
    currentUser: User;
    bulkReassignMode: boolean;
    selectedGuests: string[];
    onGuestMove: (guestId: string, newStage: Guest['stage']) => void;
    onReassignWorker: (guestId: string, workerId: string, zoneId?: string) => void;
    onToggleGuestSelection: (guestId: string) => void;
}

function KanbanColumn({
    title,
    stage,
    guests,
    currentUser,
    bulkReassignMode,
    selectedGuests,
    onGuestMove,
    onReassignWorker,
    onToggleGuestSelection,
}: KanbanColumnProps) {
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
                        className={`cursor-move hover:shadow-md transition-shadow bg-white ${
                            bulkReassignMode && selectedGuests.includes(guest.id)
                                ? 'ring-2 ring-blue-500 bg-blue-50'
                                : ''
                        }`}
                        draggable={!bulkReassignMode}
                        onDragStart={e => !bulkReassignMode && handleDragStart(e, guest.id)}
                        onClick={() => bulkReassignMode && onToggleGuestSelection(guest.id)}
                    >
                        <CardContent className="p-3">
                            <div className="flex items-start justify-between mb-2">
                                <div className="flex items-center space-x-2">
                                    {bulkReassignMode && (
                                        <Checkbox
                                            checked={selectedGuests.includes(guest.id)}
                                            onCheckedChange={() => onToggleGuestSelection(guest.id)}
                                        />
                                    )}
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

                                {!bulkReassignMode && (
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-6 w-6 p-0">
                                                <MoreVertical className="w-3 h-3" />
                                            </button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => {}}>View Profile</DropdownMenuItem>
                                            <GuestReassignmentDialog
                                                guest={guest}
                                                currentUser={currentUser}
                                                onReassign={onReassignWorker}
                                            >
                                                <DropdownMenuItem onSelect={e => e.preventDefault()}>
                                                    <UserX className="w-4 h-4 mr-2" />
                                                    Reassign Worker
                                                </DropdownMenuItem>
                                            </GuestReassignmentDialog>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                )}
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
    const [bulkReassignMode, setBulkReassignMode] = useState(false);
    const [selectedGuests, setSelectedGuests] = useState<string[]>([]);
    const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
    const [searchTerm, setSearchTerm] = useState('');
    const [stageFilter, setStageFilter] = useState<Guest['stage'] | 'all'>('all');

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

    const handleReassignWorker = (guestId: string, workerId: string, zoneId?: string) => {
        setGuests(prev =>
            prev.map(guest =>
                guest.id === guestId
                    ? {
                          ...guest,
                          assignedWorker: workerId,
                          zone: zoneId || guest.zone,
                          lastContact: new Date(),
                      }
                    : guest
            )
        );

        // If guest was moved to a different zone, update selected zone to follow the guest
        if (zoneId && zoneId !== selectedZone && (currentUser.role === 'admin' || currentUser.role === 'pastor')) {
            setSelectedZone(zoneId);
        }
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

    const handleBulkReassign = (workerId: string) => {
        if (selectedGuests.length === 0) {
            toast.error('Please select guests to reassign');
            return;
        }

        setGuests(prev =>
            prev.map(guest =>
                selectedGuests.includes(guest.id)
                    ? { ...guest, assignedWorker: workerId, lastContact: new Date() }
                    : guest
            )
        );

        const worker = mockWorkers.find(w => w.id === workerId);
        toast.success(`${selectedGuests.length} guests reassigned to ${worker?.name}`);
        setSelectedGuests([]);
        setBulkReassignMode(false);
    };

    const toggleGuestSelection = (guestId: string) => {
        setSelectedGuests(prev => (prev.includes(guestId) ? prev.filter(id => id !== guestId) : [...prev, guestId]));
    };

    const ListView = () => {
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
            }
        };

        const getStageText = (stage: Guest['stage']) => {
            switch (stage) {
                case 'invited':
                    return 'Invited';
                case 'attended':
                    return 'Attended';
                case 'discipled':
                    return 'Discipled';
                case 'joined':
                    return 'Joined Workforce';
            }
        };

        // Filter guests based on search and stage filter
        const getFilteredGuests = () => {
            let filtered = zoneGuests;

            if (searchTerm) {
                filtered = filtered.filter(
                    guest =>
                        guest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        guest.phone.includes(searchTerm) ||
                        (guest.address && guest.address.toLowerCase().includes(searchTerm.toLowerCase()))
                );
            }

            if (stageFilter !== 'all') {
                filtered = filtered.filter(guest => guest.stage === stageFilter);
            }

            return filtered;
        };

        const displayGuests = getFilteredGuests();

        return (
            <div className="space-y-4">
                {/* List View Filters */}
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center space-x-4">
                            <div className="flex-1 relative">
                                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                                <Input
                                    placeholder="Search guests by name, phone, or address..."
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                            <Select
                                value={stageFilter}
                                onValueChange={value => setStageFilter(value as Guest['stage'] | 'all')}
                            >
                                <SelectTrigger className="w-48">
                                    <SelectValue placeholder="Filter by stage" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Stages</SelectItem>
                                    <SelectItem value="invited">Invited</SelectItem>
                                    <SelectItem value="attended">Attended</SelectItem>
                                    <SelectItem value="discipled">Discipled</SelectItem>
                                    <SelectItem value="joined">Joined Workforce</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                {/* Guest List Table */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            <span>Guest List</span>
                            <Badge variant="outline">{displayGuests.length} guests</Badge>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    {bulkReassignMode && <TableHead className="w-10"></TableHead>}
                                    <TableHead>Guest</TableHead>
                                    <TableHead>Contact</TableHead>
                                    <TableHead>Stage</TableHead>
                                    <TableHead>Assigned Worker</TableHead>
                                    <TableHead>Last Contact</TableHead>
                                    <TableHead>Next Action</TableHead>
                                    <TableHead className="w-20">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {displayGuests.map(guest => (
                                    <TableRow
                                        key={guest.id}
                                        className={`${
                                            bulkReassignMode && selectedGuests.includes(guest.id) ? 'bg-blue-50' : ''
                                        }`}
                                    >
                                        {bulkReassignMode && (
                                            <TableCell>
                                                <Checkbox
                                                    checked={selectedGuests.includes(guest.id)}
                                                    onCheckedChange={() => toggleGuestSelection(guest.id)}
                                                />
                                            </TableCell>
                                        )}
                                        <TableCell>
                                            <div className="flex items-center space-x-3">
                                                <Avatar className="w-8 h-8">
                                                    <AvatarFallback className="text-xs">
                                                        {guest.name
                                                            .split(' ')
                                                            .map(n => n[0])
                                                            .join('')}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <div className="font-medium">{guest.name}</div>
                                                    {guest.address && (
                                                        <div className="text-xs text-gray-500 flex items-center">
                                                            <MapPin className="w-3 h-3 mr-1" />
                                                            {guest.address}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="space-y-1">
                                                <div className="text-sm">{guest.phone}</div>
                                                <div className="flex space-x-1">
                                                    <Button size="sm" variant="outline" className="h-6 px-2">
                                                        <Phone className="w-3 h-3" />
                                                    </Button>
                                                    <Button size="sm" variant="outline" className="h-6 px-2">
                                                        <MessageCircle className="w-3 h-3" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Select
                                                value={guest.stage}
                                                onValueChange={newStage =>
                                                    handleGuestMove(guest.id, newStage as Guest['stage'])
                                                }
                                            >
                                                <SelectTrigger className="w-32">
                                                    <SelectValue>
                                                        <Badge className={getStageColor(guest.stage)}>
                                                            {getStageText(guest.stage)}
                                                        </Badge>
                                                    </SelectValue>
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="invited">
                                                        <div className="flex items-center space-x-2">
                                                            <div className="w-3 h-3 bg-blue-500 rounded"></div>
                                                            <span>Invited</span>
                                                        </div>
                                                    </SelectItem>
                                                    <SelectItem value="attended">
                                                        <div className="flex items-center space-x-2">
                                                            <div className="w-3 h-3 bg-green-500 rounded"></div>
                                                            <span>Attended</span>
                                                        </div>
                                                    </SelectItem>
                                                    <SelectItem value="discipled">
                                                        <div className="flex items-center space-x-2">
                                                            <div className="w-3 h-3 bg-purple-500 rounded"></div>
                                                            <span>Discipled</span>
                                                        </div>
                                                    </SelectItem>
                                                    <SelectItem value="joined">
                                                        <div className="flex items-center space-x-2">
                                                            <div className="w-3 h-3 bg-gray-500 rounded"></div>
                                                            <span>Joined Workforce</span>
                                                        </div>
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-sm">
                                                {mockWorkers.find(w => w.id === guest.assignedWorker)?.name ||
                                                    'Unassigned'}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-sm text-gray-600">
                                                {guest.lastContact.toLocaleDateString()}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-sm bg-yellow-50 border border-yellow-200 rounded px-2 py-1">
                                                {guest.nextAction}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {!bulkReassignMode && (
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-6 w-6 p-0">
                                                            <MoreVertical className="w-3 h-3" />
                                                        </button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem onClick={() => {}}>
                                                            View Profile
                                                        </DropdownMenuItem>
                                                        <GuestReassignmentDialog
                                                            guest={guest}
                                                            currentUser={currentUser}
                                                            onReassign={handleReassignWorker}
                                                        >
                                                            <DropdownMenuItem onSelect={e => e.preventDefault()}>
                                                                <UserX className="w-4 h-4 mr-2" />
                                                                Reassign Worker
                                                            </DropdownMenuItem>
                                                        </GuestReassignmentDialog>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        );
    };

    return (
        <div className="p-4">
            {/* Header */}
            <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-2xl font-bold">Zone Dashboard</h1>
                    <div className="flex items-center space-x-2">
                        {/* View Toggle */}
                        <ToggleGroup
                            type="single"
                            value={viewMode}
                            onValueChange={value => {
                                if (value) {
                                    setViewMode(value as 'kanban' | 'list');
                                    // Reset filters when switching views
                                    setSearchTerm('');
                                    setStageFilter('all');
                                    setBulkReassignMode(false);
                                    setSelectedGuests([]);
                                }
                            }}
                        >
                            <ToggleGroupItem value="kanban" aria-label="Kanban view">
                                <LayoutGrid className="w-4 h-4" />
                            </ToggleGroupItem>
                            <ToggleGroupItem value="list" aria-label="List view">
                                <List className="w-4 h-4" />
                            </ToggleGroupItem>
                        </ToggleGroup>

                        {/* Bulk Actions */}
                        {!bulkReassignMode ? (
                            <Button variant="outline" onClick={() => setBulkReassignMode(true)}>
                                <UserCheck className="w-4 h-4 mr-2" />
                                Bulk Reassign
                            </Button>
                        ) : (
                            <div className="flex items-center space-x-2">
                                <span className="text-sm text-gray-600">{selectedGuests.length} selected</span>
                                <Select onValueChange={handleBulkReassign}>
                                    <SelectTrigger className="w-40">
                                        <SelectValue placeholder="Assign to..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {mockWorkers.map(worker => (
                                            <SelectItem key={worker.id} value={worker.id}>
                                                {worker.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setBulkReassignMode(false);
                                        setSelectedGuests([]);
                                    }}
                                >
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>
                        )}

                        {/* Zone Selector */}
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

            {/* Instructions - Only show for Kanban view */}
            {viewMode === 'kanban' && (
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
            )}

            {/* View Content */}
            {viewMode === 'kanban' ? (
                <div className="flex space-x-4 overflow-x-auto pb-4">
                    <KanbanColumn
                        title="Invited"
                        stage="invited"
                        guests={guestsByStage.invited}
                        currentUser={currentUser}
                        bulkReassignMode={bulkReassignMode}
                        selectedGuests={selectedGuests}
                        onGuestMove={handleGuestMove}
                        onReassignWorker={handleReassignWorker}
                        onToggleGuestSelection={toggleGuestSelection}
                    />
                    <KanbanColumn
                        title="Attended"
                        stage="attended"
                        guests={guestsByStage.attended}
                        currentUser={currentUser}
                        bulkReassignMode={bulkReassignMode}
                        selectedGuests={selectedGuests}
                        onGuestMove={handleGuestMove}
                        onReassignWorker={handleReassignWorker}
                        onToggleGuestSelection={toggleGuestSelection}
                    />
                    <KanbanColumn
                        title="Discipled"
                        stage="discipled"
                        guests={guestsByStage.discipled}
                        currentUser={currentUser}
                        bulkReassignMode={bulkReassignMode}
                        selectedGuests={selectedGuests}
                        onGuestMove={handleGuestMove}
                        onReassignWorker={handleReassignWorker}
                        onToggleGuestSelection={toggleGuestSelection}
                    />
                    <KanbanColumn
                        title="Joined Workforce"
                        stage="joined"
                        guests={guestsByStage.joined}
                        currentUser={currentUser}
                        bulkReassignMode={bulkReassignMode}
                        selectedGuests={selectedGuests}
                        onGuestMove={handleGuestMove}
                        onReassignWorker={handleReassignWorker}
                        onToggleGuestSelection={toggleGuestSelection}
                    />
                </div>
            ) : (
                <ListView />
            )}
        </div>
    );
}
