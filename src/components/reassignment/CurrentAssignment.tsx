import { Label } from '../ui/label';
import { Card, CardContent } from '../ui/card';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Guest, User } from '../../store/types';

interface CurrentAssignmentProps {
    guest: Guest;
    currentAssignedWorker?: User;
}

export function CurrentAssignment({ guest, currentAssignedWorker }: CurrentAssignmentProps) {
    return (
        <div>
            <Label className="text-sm font-medium">Current Assignment</Label>
            <Card className="mt-2">
                <CardContent className="p-3">
                    <div className="flex items-center space-x-3">
                        <Avatar className="w-10 h-10">
                            <AvatarFallback>
                                {guest.name
                                    .split(' ')
                                    .map(n => n[0])
                                    .join('')}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                            <h3 className="font-medium">{guest.name}</h3>
                            <p className="text-sm text-gray-500">
                                Currently assigned to {currentAssignedWorker?.name || 'Unassigned'}
                                {currentAssignedWorker && ` in ${currentAssignedWorker?.zoneIds?.[0]}`}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
