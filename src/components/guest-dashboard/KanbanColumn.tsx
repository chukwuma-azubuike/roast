import React, { useState } from 'react';
import { Phone, MessageCircle, Clock, MoreVertical, Users } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Guest, MilestoneStatus } from '../../store/types';
interface KanbanColumnProps {
    title: string;
    stage: Guest['assimilationStage'];
    guests?: Guest[];
    onGuestMove: (guestId: string, newStage: Guest['assimilationStage']) => void;
    onViewGuest: (guestId: string) => void;
}

export function KanbanColumn({ title, stage, guests, onGuestMove, onViewGuest }: KanbanColumnProps) {
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
        const completed = milestones.filter(m => m.status === MilestoneStatus.COMPLETED).length;
        return Math.round((completed / milestones.length) * 100);
    };

    const getDaysSinceContact = (lastContact: Date) => {
        const today = new Date();

        const diffTime = today.getTime() - lastContact?.getTime();
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
                        {guests?.length}
                    </Badge>
                </h3>
            </div>

            <div className="space-y-3">
                {guests?.map(guest => {
                    const progress = getProgressPercentage(guest.milestones);
                    const daysSinceContact = getDaysSinceContact(guest?.lastContact as any);

                    return (
                        <Card
                            key={guest._id}
                            className="cursor-move hover:shadow-md transition-shadow bg-white"
                            draggable
                            onDragStart={e => handleDragStart(e, guest._id)}
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
                                            <DropdownMenuItem onClick={() => onViewGuest(guest._id)}>
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

                {guests?.length === 0 && (
                    <div className="text-center py-8 text-gray-400">
                        <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No guests in this stage</p>
                    </div>
                )}
            </div>
        </div>
    );
}
