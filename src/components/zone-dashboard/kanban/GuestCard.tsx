import React from 'react';
import { MoreVertical, UserX } from 'lucide-react';
import { Card, CardContent } from '../../ui/card';
import { Avatar, AvatarFallback } from '../../ui/avatar';
import { User, Guest, MilestoneStatus } from '../../../store/types';
import { Checkbox } from '../../ui/checkbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../../ui/dropdown-menu';
import { GuestReassignmentDialog } from '../../reassignment';

interface GuestCardProps {
    guest: Guest;
    workers: User[];
    currentUser: User;
    bulkReassignMode: boolean;
    isSelected: boolean;
    onDragStart: (e: React.DragEvent, guestId: string) => void;
    onReassignWorker: (guestId: string, workerId: string, zoneId?: string) => void;
    onToggleSelection: (guestId: string) => void;
}

export function GuestCard({
    guest,
    workers,
    currentUser,
    bulkReassignMode,
    isSelected,
    onDragStart,
    onReassignWorker,
    onToggleSelection,
}: GuestCardProps) {
    const getProgressPercentage = (milestones: Guest['milestones']) => {
        const completed = milestones.filter(m => m.status === MilestoneStatus.COMPLETED).length;
        return Math.round((completed / milestones.length) * 100);
    };

    const progress = getProgressPercentage(guest.milestones);
    const assignedWorker = workers.find(w => w._id === guest.assignedToId);

    return (
        <Card
            className={`cursor-move hover:shadow-md transition-shadow bg-white ${
                bulkReassignMode && isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : ''
            }`}
            draggable={!bulkReassignMode}
            onDragStart={e => !bulkReassignMode && onDragStart(e, guest._id)}
            onClick={() => bulkReassignMode && onToggleSelection(guest._id)}
        >
            <CardContent className="p-3 space-y-2">
                <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                        {bulkReassignMode && (
                            <Checkbox checked={isSelected} onCheckedChange={() => onToggleSelection(guest._id)} />
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

                <div className="space-y-1">
                    <div className="text-sm">{progress}% complete</div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="text-xs text-gray-600">
                        <strong>Assigned:</strong> {assignedWorker?.name || 'Unassigned'}
                    </div>

                    <div className="text-xs bg-yellow-50 border border-yellow-200 rounded p-2">
                        <strong>Next:</strong> {guest.nextAction}
                    </div>

                    <div className="text-xs text-gray-500">Last contact: {guest.lastContact?.toLocaleString()}</div>
                </div>
            </CardContent>
        </Card>
    );
}
