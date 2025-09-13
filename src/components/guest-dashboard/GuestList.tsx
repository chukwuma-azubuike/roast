import React, { memo } from 'react';
import { Badge } from '../ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { AssimilationStage, Guest } from '../../store/types';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../ui/select';
import { Button } from '../ui/button';
import { Phone, MessageCircle, MoreVertical } from 'lucide-react';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuItem, DropdownMenuContent } from '../ui/dropdown-menu';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { formatTimeAgo } from '../../lib/utils';

interface GuestListProps {
    guests: Guest[];
    onStageChange: (guestId: string, newStage: AssimilationStage) => void;
    onViewGuest: (guestId: string) => void;
}

export const GuestList = memo(function GuestList({ guests, onStageChange, onViewGuest }: GuestListProps) {
    const getStageColor = (stage: AssimilationStage) => {
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

    const getStageText = (stage: AssimilationStage) => {
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
        const completed = milestones.filter(m => m.status === 'COMPLETED').length;
        return Math.round((completed / milestones.length) * 100);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    <span>My Guests</span>
                    <Badge variant="outline">{guests.length} guests</Badge>
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
                        {guests.map(guest => {
                            const progress = getProgressPercentage(guest.milestones);

                            return (
                                <TableRow key={guest.id}>
                                    <TableCell>
                                        <div className="flex items-center space-x-3">
                                            <Avatar className="w-8 h-8">
                                                <AvatarFallback className="text-xs">
                                                    {guest.firstName[0]}
                                                    {guest.lastName?.[0] || ''}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <div className="font-medium">{`${guest.firstName} ${guest.lastName || ''}`}</div>
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
                                                onStageChange(guest.id, newStage as AssimilationStage)
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
                                            {guest.lastContact
                                                ? formatTimeAgo(new Date(guest.lastContact))
                                                : 'No contact yet'}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {guest.nextAction && (
                                            <div className="text-sm bg-yellow-50 border border-yellow-200 rounded px-2 py-1">
                                                {guest.nextAction}
                                            </div>
                                        )}
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
    );
});
