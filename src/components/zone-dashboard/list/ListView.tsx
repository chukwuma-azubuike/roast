import React from 'react';
import { MapPin, Phone, MessageCircle, MoreVertical, UserX, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../ui/table';
import { Avatar, AvatarFallback } from '../../ui/avatar';
import { Button } from '../../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Checkbox } from '../../ui/checkbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../../ui/dropdown-menu';
import { User, Guest, AssimilationStage } from '../../../store/types';
import { GuestReassignmentDialog } from '../../reassignment';
import { getStageColor, getStageText } from '../utils/stageUtils';

interface ListViewProps {
    guests: Guest[];
    users: User[];
    currentUser: User;
    bulkReassignMode: boolean;
    selectedGuests: string[];
    onGuestMove: (guestId: string, newStage: Guest['assimilationStage']) => void;
    onReassignWorker: (guestId: string, workerId: string, zoneId?: string) => void;
    onToggleGuestSelection: (guestId: string) => void;
}

export function ListView({
    guests,
    users,
    currentUser,
    bulkReassignMode,
    selectedGuests,
    onGuestMove,
    onReassignWorker,
    onToggleGuestSelection,
}: ListViewProps) {
    return (
        <div className="space-y-4">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <span>Guest List</span>
                        <Badge variant="outline">{guests.length} guests</Badge>
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
                            {guests.map(guest => (
                                <TableRow
                                    key={guest._id}
                                    className={`${
                                        bulkReassignMode && selectedGuests.includes(guest._id) ? 'bg-blue-50' : ''
                                    }`}
                                >
                                    {bulkReassignMode && (
                                        <TableCell>
                                            <Checkbox
                                                checked={selectedGuests.includes(guest._id)}
                                                onCheckedChange={() => onToggleGuestSelection(guest._id)}
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
                                            value={guest.assimilationStage}
                                            onValueChange={newStage =>
                                                onGuestMove(guest._id, newStage as Guest['assimilationStage'])
                                            }
                                        >
                                            <SelectTrigger className="w-32">
                                                <SelectValue>
                                                    <Badge className={getStageColor(guest.assimilationStage, 'badge')}>
                                                        {getStageText(guest.assimilationStage)}
                                                    </Badge>
                                                </SelectValue>
                                            </SelectTrigger>
                                            <SelectContent>
                                                {Object.values(AssimilationStage).map(stage => (
                                                    <SelectItem key={stage} value={stage}>
                                                        <div className="flex items-center space-x-2">
                                                            <div className={`w-3 h-3 rounded ${getStageColor(stage as AssimilationStage, 'bg')}`}></div>
                                                            <span>{getStageText(stage as AssimilationStage)}</span>
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </TableCell>
                                    <TableCell>
                                        <div className="text-sm">
                                            {users.find(w => w._id === guest.assignedToId)?.name || 'Unassigned'}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="text-sm text-gray-600">
                                            {guest.lastContact?.toLocaleString()}
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
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
