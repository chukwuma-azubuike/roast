import React, { useState } from 'react';
import { UserX } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Button } from '../ui/button';
import { toast } from 'sonner';
import { User, Guest } from '../../store/types';
import { useGetUsersQuery, useGetZonesQuery } from '../../store/api';
import { CurrentAssignment } from './CurrentAssignment';
import { ZoneSelector } from './ZoneSelector';
import { WorkerSearch } from './WorkerSearch';
import { WorkerList } from './WorkerList';
import { PermissionNotice } from './PermissionNotice';
import { useWorkerFiltering } from './hooks/useWorkerFiltering';

interface GuestReassignmentDialogProps {
    guest: Guest;
    currentUser: User;
    onReassign: (guestId: string, workerId: string, zoneId?: string) => void;
    children: React.ReactNode;
}

export function GuestReassignmentDialog({ guest, currentUser, onReassign, children }: GuestReassignmentDialogProps) {
    const [open, setOpen] = useState(false);
    const [selectedZone, setSelectedZone] = useState<string>(guest.zoneId);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedWorker, setSelectedWorker] = useState<string>('');

    const { data: zones } = useGetZonesQuery();
    const { data: users } = useGetUsersQuery({ zoneId: selectedZone });

    const { getAvailableWorkers } = useWorkerFiltering({
        users,
        currentUser,
        selectedZone,
        searchTerm,
        excludeUserId: guest.assignedToId || undefined
    });

    const availableWorkers = getAvailableWorkers();
    const currentAssignedWorker = users?.find(w => w._id === guest.assignedToId);

    const handleReassign = () => {
        if (!selectedWorker) {
            toast.error('Please select a worker');
            return;
        }

        const newWorker = users?.find(w => w._id === selectedWorker);
        const newZone = selectedZone !== guest.zoneId ? selectedZone : undefined;

        onReassign(guest._id, selectedWorker, newZone);

        toast.success(
            `Guest reassigned to ${newWorker?.name}${newZone ? ` in ${zones?.find(z => z._id === newZone)?.name}` : ''}`
        );

        setOpen(false);
        setSelectedWorker('');
        setSearchTerm('');
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center space-x-2">
                        <UserX className="w-5 h-5" />
                        <span>Reassign Guest</span>
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    <CurrentAssignment guest={guest} currentAssignedWorker={currentAssignedWorker} />

                    <ZoneSelector
                        currentUser={currentUser}
                        zones={zones}
                        selectedZone={selectedZone}
                        onZoneChange={setSelectedZone}
                    />

                    <WorkerSearch searchTerm={searchTerm} onSearchChange={setSearchTerm} />

                    <WorkerList
                        users={availableWorkers}
                        selectedWorker={selectedWorker}
                        onWorkerSelect={setSelectedWorker}
                    />

                    {/* Action Buttons */}
                    <div className="flex space-x-3 pt-4">
                        <Button onClick={handleReassign} disabled={!selectedWorker} className="flex-1">
                            Reassign Guest
                        </Button>
                        <Button variant="outline" onClick={() => setOpen(false)} className="flex-1">
                            Cancel
                        </Button>
                    </div>

                    <PermissionNotice currentUser={currentUser} />
                </div>
            </DialogContent>
        </Dialog>
    );
}
