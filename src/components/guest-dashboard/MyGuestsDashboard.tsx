import React, { useMemo, useState } from 'react';
import { Phone, MessageCircle, Search, LayoutGrid, List, MoreVertical } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { ToggleGroup, ToggleGroupItem } from '../ui/toggle-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { User, Guest, AssimilationStage, MilestoneStatus } from '../../store/types';
import { toast } from 'sonner';
import { useGetGuestsQuery } from '../../store/api';
import { KanbanColumn } from './KanbanColumn';

interface MyGuestsDashboardProps {
    currentUser: User;
    onViewGuest: (guestId: string) => void;
}

function MyGuestsDashboard({ currentUser, onViewGuest }: MyGuestsDashboardProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
    const [stageFilter, setStageFilter] = useState<Guest['assimilationStage'] | 'all'>('all');

    const { data: guests } = useGetGuestsQuery({ workerId: currentUser._id, zoneId: '' });

    // Filter guests by current user and search term
    const userGuests = useMemo(
        () => guests?.filter(guest => guest.name.toLowerCase().includes(searchTerm.toLowerCase())),
        [guests, searchTerm]
    );

    // Categorize guests by stage
    const categorizedGuests = {
        all: userGuests,
        invited: userGuests?.filter(guest => guest.assimilationStage === AssimilationStage.INVITED),
        attended: userGuests?.filter(guest => guest.assimilationStage === AssimilationStage.ATTENDED),
        discipled: userGuests?.filter(guest => guest.assimilationStage === AssimilationStage.DISCIPLED),
        joined: userGuests?.filter(guest => guest.assimilationStage === AssimilationStage.JOINED),
    };

    // Group guests by stage for Kanban view
    const guestsByStage = {
        invited: userGuests?.filter(g => g.assimilationStage === 'invited'),
        attended: userGuests?.filter(g => g.assimilationStage === 'attended'),
        discipled: userGuests?.filter(g => g.assimilationStage === 'discipled'),
        joined: userGuests?.filter(g => g.assimilationStage === 'joined'),
    };

    const handleGuestMove = (guestId: string, newStage: Guest['assimilationStage']) => {
        // TODO: Update guest stage in backend
        // setGuests(prev =>
        //     prev.map(guest => (guest._id === guestId ? { ...guest, stage: newStage, lastContact: new Date() } : guest))
        // );
        toast.success(`Guest moved to ${newStage} stage`);
    };

    const getStageColor = (stage: Guest['assimilationStage']) => {
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

    const getStageText = (stage: Guest['assimilationStage']) => {
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
        const completed = milestones.filter(m => m.status === MilestoneStatus.COMPLETED).length;
        return Math.round((completed / milestones.length) * 100);
    };

    const getDaysSinceContact = (lastContact: Date) => {
        const today = new Date();
        const diffTime = today.getTime() - lastContact?.getTime();
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
                                        <TableRow key={guest._id}>
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
                                                    value={guest.assimilationStage}
                                                    onValueChange={newStage =>
                                                        handleGuestMove(
                                                            guest._id,
                                                            newStage as Guest['assimilationStage']
                                                        )
                                                    }
                                                >
                                                    <SelectTrigger className="w-32">
                                                        <SelectValue>
                                                            <Badge className={getStageColor(guest.assimilationStage)}>
                                                                {getStageText(guest.assimilationStage)}
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
                                                        <DropdownMenuItem onClick={() => onViewGuest(guest._id)}>
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
                        onValueChange={value => setStageFilter(value as Guest['assimilationStage'] | 'all')}
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

    const getFilteredGuests = () => {
        let filtered = userGuests;

        if (searchTerm) {
            filtered = filtered?.filter(
                guest =>
                    guest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    guest.phone.includes(searchTerm) ||
                    (guest.address && guest.address.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }

        if (stageFilter !== 'all') {
            filtered = filtered?.filter(guest => guest.assimilationStage === stageFilter);
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
                            <div className="text-2xl font-bold text-blue-600">{categorizedGuests?.invited?.length}</div>
                            <div className="text-sm text-gray-600">Invited</div>
                        </CardContent>
                    </Card>
                    <Card className="text-center">
                        <CardContent className="p-4">
                            <div className="text-2xl font-bold text-green-600">
                                {categorizedGuests?.attended?.length}
                            </div>
                            <div className="text-sm text-gray-600">Attended</div>
                        </CardContent>
                    </Card>
                    <Card className="text-center">
                        <CardContent className="p-4">
                            <div className="text-2xl font-bold text-purple-600">
                                {categorizedGuests?.discipled?.length}
                            </div>
                            <div className="text-sm text-gray-600">Discipled</div>
                        </CardContent>
                    </Card>
                    <Card className="text-center">
                        <CardContent className="p-4">
                            <div className="text-2xl font-bold text-gray-600">{categorizedGuests?.joined?.length}</div>
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
                        stage={AssimilationStage.INVITED}
                        guests={guestsByStage.invited}
                        onGuestMove={handleGuestMove}
                        onViewGuest={onViewGuest}
                    />
                    <KanbanColumn
                        title="Attended"
                        stage={AssimilationStage.ATTENDED}
                        guests={guestsByStage.attended}
                        onGuestMove={handleGuestMove}
                        onViewGuest={onViewGuest}
                    />
                    <KanbanColumn
                        title="Discipled"
                        stage={AssimilationStage.DISCIPLED}
                        guests={guestsByStage.discipled}
                        onGuestMove={handleGuestMove}
                        onViewGuest={onViewGuest}
                    />
                    <KanbanColumn
                        title="Joined Workforce"
                        stage={AssimilationStage.JOINED}
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

export default MyGuestsDashboard;
