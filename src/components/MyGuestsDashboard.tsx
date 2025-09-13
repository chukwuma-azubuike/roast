import React, { useState } from 'react';
import {
    Phone,
    MessageCircle,
    Calendar,
    Clock,
    ChevronRight,
    Search,
    LayoutGrid,
    List,
    MoreVertical,
    Users,
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { ToggleGroup, ToggleGroupItem } from './ui/toggle-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import type { User, Guest } from '../App';
import { toast } from 'sonner';

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
    {
        id: 'guest4',
        name: 'David Park',
        phone: '+1 (555) 321-9876',
        zone: 'zone1',
        assignedWorker: 'user1',
        stage: 'joined',
        createdAt: new Date('2024-10-05'),
        lastContact: new Date('2024-12-14'),
        nextAction: 'Assign ministry role',
        milestones: [
            { id: 'm1', title: 'Initial Contact', completed: true, completedAt: new Date('2024-10-05') },
            { id: 'm2', title: 'First Phone Call', completed: true, completedAt: new Date('2024-10-06') },
            { id: 'm3', title: 'Service Invitation', completed: true, completedAt: new Date('2024-10-08') },
            { id: 'm4', title: 'First Visit', completed: true, completedAt: new Date('2024-10-10') },
            { id: 'm5', title: 'Small Group Invitation', completed: true, completedAt: new Date('2024-10-15') },
            { id: 'm6', title: 'Bible Study Started', completed: true, completedAt: new Date('2024-11-01') },
            { id: 'm7', title: 'Baptism Preparation', completed: true, completedAt: new Date('2024-11-20') },
            { id: 'm8', title: 'Baptized', completed: true, completedAt: new Date('2024-12-01') },
            { id: 'm9', title: 'Joined Workforce', completed: true, completedAt: new Date('2024-12-10') },
        ],
        timeline: [
            {
                id: 't1',
                type: 'note',
                description: 'Officially joined the church workforce. Ready for ministry assignment.',
                createdAt: new Date('2024-12-14'),
                createdBy: 'user1',
            },
        ],
    },
];

interface KanbanColumnProps {
    title: string;
    stage: Guest['stage'];
    guests: Guest[];
    onGuestMove: (guestId: string, newStage: Guest['stage']) => void;
    onViewGuest: (guestId: string) => void;
}

function KanbanColumn({ title, stage, guests, onGuestMove, onViewGuest }: KanbanColumnProps) {
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
                {guests.map(guest => {
                    const progress = getProgressPercentage(guest.milestones);
                    const daysSinceContact = getDaysSinceContact(guest.lastContact);

                    return (
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
                                            <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-6 w-6 p-0">
                                                <MoreVertical className="w-3 h-3" />
                                            </button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => onViewGuest(guest.id)}>
                                                View Profile
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-gray-600">Progress</span>
                                        <span className="text-gray-500">{progress}% complete</span>
                                    </div>

                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                            style={{ width: `${progress}%` }}
                                        />
                                    </div>

                                    <div className="text-xs bg-yellow-50 border border-yellow-200 rounded p-2">
                                        <strong>Next:</strong> {guest.nextAction}
                                    </div>

                                    <div className="flex items-center justify-between text-xs">
                                        <div className="flex items-center space-x-1 text-gray-600">
                                            <Clock className="w-3 h-3" />
                                            <span>
                                                {daysSinceContact === 0
                                                    ? 'Today'
                                                    : daysSinceContact === 1
                                                    ? 'Yesterday'
                                                    : `${daysSinceContact} days ago`}
                                            </span>
                                        </div>
                                        <div className="flex space-x-1">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="h-6 px-2"
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
                                                className="h-6 px-2"
                                                onClick={e => {
                                                    e.stopPropagation();
                                                    window.open(
                                                        `https://wa.me/${guest.phone.replace(/\D/g, '')}`,
                                                        '_blank'
                                                    );
                                                }}
                                            >
                                                <MessageCircle className="w-3 h-3" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}

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

export function MyGuestsDashboard({ currentUser, onViewGuest }: MyGuestsDashboardProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
    const [stageFilter, setStageFilter] = useState<Guest['stage'] | 'all'>('all');
    const [guests, setGuests] = useState<Guest[]>(mockGuests);

    // Filter guests by current user and search term
    const userGuests = guests.filter(
        guest => guest.assignedWorker === currentUser.id && guest.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Categorize guests by stage
    const categorizedGuests = {
        all: userGuests,
        invited: userGuests.filter(guest => guest.stage === 'invited'),
        attended: userGuests.filter(guest => guest.stage === 'attended'),
        discipled: userGuests.filter(guest => guest.stage === 'discipled'),
        joined: userGuests.filter(guest => guest.stage === 'joined'),
    };

    // Group guests by stage for Kanban view
    const guestsByStage = {
        invited: userGuests.filter(g => g.stage === 'invited'),
        attended: userGuests.filter(g => g.stage === 'attended'),
        discipled: userGuests.filter(g => g.stage === 'discipled'),
        joined: userGuests.filter(g => g.stage === 'joined'),
    };

    const handleGuestMove = (guestId: string, newStage: Guest['stage']) => {
        setGuests(prev =>
            prev.map(guest => (guest.id === guestId ? { ...guest, stage: newStage, lastContact: new Date() } : guest))
        );
        toast.success(`Guest moved to ${newStage} stage`);
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

    const ListView = ({ displayGuests }: any) => {
        return (
            <div>
                {/* Guest List Table */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            <span>My Guests</span>
                            <Badge variant="outline">{displayGuests.length} guests</Badge>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Guest</TableHead>
                                    <TableHead>Contact</TableHead>
                                    <TableHead>Stage</TableHead>
                                    <TableHead>Progress</TableHead>
                                    <TableHead>Last Contact</TableHead>
                                    <TableHead>Next Action</TableHead>
                                    <TableHead className="w-20">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {displayGuests.map(guest => {
                                    const progress = getProgressPercentage(guest.milestones);
                                    const daysSinceContact = getDaysSinceContact(guest.lastContact);

                                    return (
                                        <TableRow key={guest.id}>
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
                                                            <div className="text-xs text-gray-500">{guest.address}</div>
                                                        )}
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="space-y-1">
                                                    <div className="text-sm">{guest.phone}</div>
                                                    <div className="flex space-x-1">
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            className="h-6 px-2"
                                                            onClick={() => window.open(`tel:${guest.phone}`, '_self')}
                                                        >
                                                            <Phone className="w-3 h-3" />
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            className="h-6 px-2"
                                                            onClick={() =>
                                                                window.open(
                                                                    `https://wa.me/${guest.phone.replace(/\D/g, '')}`,
                                                                    '_blank'
                                                                )
                                                            }
                                                        >
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
                                                <div className="space-y-1">
                                                    <div className="text-sm">{progress}% complete</div>
                                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                                        <div
                                                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                                            style={{ width: `${progress}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="text-sm text-gray-600">
                                                    {daysSinceContact === 0
                                                        ? 'Today'
                                                        : daysSinceContact === 1
                                                        ? 'Yesterday'
                                                        : `${daysSinceContact} days ago`}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="text-sm bg-yellow-50 border border-yellow-200 rounded px-2 py-1">
                                                    {guest.nextAction}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-6 w-6 p-0">
                                                            <MoreVertical className="w-3 h-3" />
                                                        </button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem onClick={() => onViewGuest(guest.id)}>
                                                            View Profile
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        );
    };

    const SearchAndFilter = () => {
        return (
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
                {viewMode == 'list' && (
                    <Select
                        value={stageFilter}
                        onValueChange={value => setStageFilter(value as Guest['stage'] | 'all')}
                    >
                        <SelectTrigger className="w-min">
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
                )}

                {/* View Toggle */}
                <ToggleGroup
                    type="single"
                    value={viewMode}
                    onValueChange={value => value && setViewMode(value as 'kanban' | 'list')}
                >
                    <ToggleGroupItem value="kanban" aria-label="Kanban view">
                        <LayoutGrid className="w-4 h-4" />
                    </ToggleGroupItem>
                    <ToggleGroupItem value="list" aria-label="List view">
                        <List className="w-4 h-4" />
                    </ToggleGroupItem>
                </ToggleGroup>
            </div>
        );
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

    const getFilteredGuests = () => {
        let filtered = userGuests;

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
        <div className="p-4 max-w-6xl mx-auto space-y-6">
            {/* Header with Stats */}
            <div>
                <h1 className="text-2xl font-bold mb-4">My Guests</h1>
                <div className="grid grid-cols-4 gap-4">
                    <Card className="text-center">
                        <CardContent className="p-4">
                            <div className="text-2xl font-bold text-blue-600">{categorizedGuests.invited.length}</div>
                            <div className="text-sm text-gray-600">Invited</div>
                        </CardContent>
                    </Card>
                    <Card className="text-center">
                        <CardContent className="p-4">
                            <div className="text-2xl font-bold text-green-600">{categorizedGuests.attended.length}</div>
                            <div className="text-sm text-gray-600">Attended</div>
                        </CardContent>
                    </Card>
                    <Card className="text-center">
                        <CardContent className="p-4">
                            <div className="text-2xl font-bold text-purple-600">
                                {categorizedGuests.discipled.length}
                            </div>
                            <div className="text-sm text-gray-600">Discipled</div>
                        </CardContent>
                    </Card>
                    <Card className="text-center">
                        <CardContent className="p-4">
                            <div className="text-2xl font-bold text-gray-600">{categorizedGuests.joined.length}</div>
                            <div className="text-sm text-gray-600">Joined</div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <SearchAndFilter />

            {/* Content */}
            {viewMode === 'kanban' ? (
                <div className="flex space-x-4 overflow-x-auto">
                    <KanbanColumn
                        title="Invited"
                        stage="invited"
                        guests={guestsByStage.invited}
                        onGuestMove={handleGuestMove}
                        onViewGuest={onViewGuest}
                    />
                    <KanbanColumn
                        title="Attended"
                        stage="attended"
                        guests={guestsByStage.attended}
                        onGuestMove={handleGuestMove}
                        onViewGuest={onViewGuest}
                    />
                    <KanbanColumn
                        title="Discipled"
                        stage="discipled"
                        guests={guestsByStage.discipled}
                        onGuestMove={handleGuestMove}
                        onViewGuest={onViewGuest}
                    />
                    <KanbanColumn
                        title="Joined Workforce"
                        stage="joined"
                        guests={guestsByStage.joined}
                        onGuestMove={handleGuestMove}
                        onViewGuest={onViewGuest}
                    />
                </div>
            ) : (
                <ListView displayGuests={displayGuests} />
            )}
        </div>
    );
}
