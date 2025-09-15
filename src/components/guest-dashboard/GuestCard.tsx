import React, { memo } from 'react';
import { Phone, MessageCircle, Clock, MoreVertical } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Button } from '../ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Guest } from '../../store/types';
import { formatTimeAgo } from '../../lib/utils';

interface GuestCardProps {
    guest: Guest;
    onViewGuest: (guestId: string) => void;
    onDragStart?: (e: React.DragEvent, guestId: string) => void;
    className?: string;
}

export const GuestCard = memo(function GuestCard({ guest, onViewGuest, onDragStart, className }: GuestCardProps) {
    const progress = React.useMemo(() => {
        const completed = guest.milestones.filter(m => m.status === 'COMPLETED').length;
        return Math.round((completed / guest.milestones.length) * 100);
    }, [guest.milestones]);

    const handleCall = (e: React.MouseEvent) => {
        e.stopPropagation();
        window.open(`tel:${guest.phone}`, '_self');
    };

    const handleWhatsApp = (e: React.MouseEvent) => {
        e.stopPropagation();
        window.open(`https://wa.me/${guest.phone.replace(/\D/g, '')}`, '_blank');
    };

    return (
        <Card
            className={`cursor-move hover:shadow-md transition-shadow bg-white ${className || ''}`}
            draggable={!!onDragStart}
            onDragStart={e => onDragStart?.(e, guest._id)}
        >
            <CardContent className="p-3">
                <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                        <Avatar className="w-8 h-8">
                            <AvatarFallback className="text-xs">
                                {guest.name.split(' ')[0]}
                                {guest.name.split(' ')[1]}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <h4 className="font-medium text-sm">{`${guest.name || ''}`}</h4>
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
                            <DropdownMenuItem onClick={() => onViewGuest(guest._id)}>View Profile</DropdownMenuItem>
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

                    {guest.nextAction && (
                        <div className="text-xs bg-yellow-50 border border-yellow-200 rounded p-2">
                            <strong>Next:</strong> {guest.nextAction}
                        </div>
                    )}

                    <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center space-x-1 text-gray-600">
                            <Clock className="w-3 h-3" />
                            <span>
                                {guest.lastContact ? formatTimeAgo(new Date(guest.lastContact)) : 'No contact yet'}
                            </span>
                        </div>
                        <div className="flex space-x-1">
                            <Button size="sm" variant="outline" className="h-6 px-2" onClick={handleCall}>
                                <Phone className="w-3 h-3" />
                            </Button>
                            <Button size="sm" variant="outline" className="h-6 px-2" onClick={handleWhatsApp}>
                                <MessageCircle className="w-3 h-3" />
                            </Button>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
});
