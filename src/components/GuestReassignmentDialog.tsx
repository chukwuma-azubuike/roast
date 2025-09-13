import React, { useState } from 'react';
import { UserX, Users, Search } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { toast } from 'sonner';
import type { User, Guest } from '../App';

interface GuestReassignmentDialogProps {
    guest: Guest;
    currentUser: User;
    onReassign: (guestId: string, workerId: string, zoneId?: string) => void;
    children: React.ReactNode;
}

// Mock data for workers and zones
const mockAllWorkers = [
    {
        id: 'worker1',
        name: 'John Worker',
        zone: 'zone1',
        zoneName: 'Central Zone',
        email: 'john@church.org',
        guestCount: 12,
    },
    {
        id: 'worker2',
        name: 'Mary Helper',
        zone: 'zone1',
        zoneName: 'Central Zone',
        email: 'mary@church.org',
        guestCount: 8,
    },
    {
        id: 'worker3',
        name: 'Paul Evangelist',
        zone: 'zone2',
        zoneName: 'North Zone',
        email: 'paul@church.org',
        guestCount: 15,
    },
    {
        id: 'worker4',
        name: 'Sarah Minister',
        zone: 'zone2',
        zoneName: 'North Zone',
        email: 'sarah@church.org',
        guestCount: 6,
    },
    {
        id: 'worker5',
        name: 'David Pastor',
        zone: 'zone3',
        zoneName: 'South Zone',
        email: 'david@church.org',
        guestCount: 10,
    },
    {
        id: 'worker6',
        name: 'Lisa Zhang',
        zone: 'zone3',
        zoneName: 'South Zone',
        email: 'lisa@church.org',
        guestCount: 14,
    },
    {
        id: 'worker7',
        name: 'Michael Brown',
        zone: 'zone4',
        zoneName: 'East Zone',
        email: 'michael@church.org',
        guestCount: 9,
    },
    {
        id: 'worker8',
        name: 'Jennifer Lee',
        zone: 'zone5',
        zoneName: 'West Zone',
        email: 'jen@church.org',
        guestCount: 7,
    },
];

const mockZones = [
    { id: 'zone1', name: 'Central Zone' },
    { id: 'zone2', name: 'North Zone' },
    { id: 'zone3', name: 'South Zone' },
    { id: 'zone4', name: 'East Zone' },
    { id: 'zone5', name: 'West Zone' },
];

export function GuestReassignmentDialog({ guest, currentUser, onReassign, children }: GuestReassignmentDialogProps) {
    const [open, setOpen] = useState(false);
    const [selectedZone, setSelectedZone] = useState<string>(guest.zone);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedWorker, setSelectedWorker] = useState<string>('');

    // Filter workers based on user role and permissions
    const getAvailableWorkers = () => {
        let workers = mockAllWorkers;

        // Coordinators can only reassign within their zone
        if (currentUser.role === 'coordinator') {
            workers = workers.filter(worker => worker.zone === currentUser.zone);
        }
        // Admins and pastors can reassign to any zone
        else if (currentUser.role === 'admin' || currentUser.role === 'pastor') {
            if (selectedZone) {
                workers = workers.filter(worker => worker.zone === selectedZone);
            }
        }

        // Filter by search term
        if (searchTerm) {
            workers = workers.filter(
                worker =>
                    worker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    worker.email.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        return workers.filter(worker => worker.id !== guest.assignedWorker);
    };

    const availableWorkers = getAvailableWorkers();
    const currentAssignedWorker = mockAllWorkers.find(w => w.id === guest.assignedWorker);

    const handleReassign = () => {
        if (!selectedWorker) {
            toast.error('Please select a worker');
            return;
        }

        const newWorker = mockAllWorkers.find(w => w.id === selectedWorker);
        const newZone = selectedZone !== guest.zone ? selectedZone : undefined;

        onReassign(guest.id, selectedWorker, newZone);

        toast.success(
            `Guest reassigned to ${newWorker?.name}${
                newZone ? ` in ${mockZones.find(z => z.id === newZone)?.name}` : ''
            }`
        );

        setOpen(false);
        setSelectedWorker('');
        setSearchTerm('');
    };

    const getWorkloadColor = (guestCount: number) => {
        if (guestCount <= 5) return 'text-green-600';
        if (guestCount <= 10) return 'text-yellow-600';
        return 'text-red-600';
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
                    {/* Current Assignment */}
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
                                            {currentAssignedWorker && ` in ${currentAssignedWorker.zoneName}`}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Zone Selection (Admin/Pastor only) */}
                    {(currentUser.role === 'admin' || currentUser.role === 'pastor') && (
                        <div>
                            <Label className="text-sm font-medium">Target Zone</Label>
                            <Select value={selectedZone} onValueChange={setSelectedZone}>
                                <SelectTrigger className="mt-2">
                                    <SelectValue placeholder="Select zone" />
                                </SelectTrigger>
                                <SelectContent>
                                    {mockZones.map(zone => (
                                        <SelectItem key={zone.id} value={zone.id}>
                                            {zone.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}

                    {/* Worker Search */}
                    <div>
                        <Label className="text-sm font-medium">Search Workers</Label>
                        <div className="relative mt-2">
                            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                            <Input
                                placeholder="Search by name or email..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </div>

                    {/* Available Workers */}
                    <div>
                        <Label className="text-sm font-medium">Available Workers</Label>
                        <div className="mt-2 space-y-2 max-h-60 overflow-y-auto">
                            {availableWorkers.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                    <p>No available workers found</p>
                                    <p className="text-sm">Try adjusting your search or zone selection</p>
                                </div>
                            ) : (
                                availableWorkers.map(worker => (
                                    <Card
                                        key={worker.id}
                                        className={`cursor-pointer transition-colors ${
                                            selectedWorker === worker.id
                                                ? 'ring-2 ring-blue-500 bg-blue-50'
                                                : 'hover:bg-gray-50'
                                        }`}
                                        onClick={() => setSelectedWorker(worker.id)}
                                    >
                                        <CardContent className="p-3">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-3">
                                                    <Avatar className="w-10 h-10">
                                                        <AvatarFallback>
                                                            {worker.name
                                                                .split(' ')
                                                                .map(n => n[0])
                                                                .join('')}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <h3 className="font-medium">{worker.name}</h3>
                                                        <p className="text-sm text-gray-500">{worker.email}</p>
                                                        <p className="text-xs text-gray-400">{worker.zoneName}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div
                                                        className={`text-sm font-medium ${getWorkloadColor(
                                                            worker.guestCount
                                                        )}`}
                                                    >
                                                        {worker.guestCount} guests
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        {worker.guestCount <= 5
                                                            ? 'Light'
                                                            : worker.guestCount <= 10
                                                              ? 'Moderate'
                                                              : 'Heavy'}{' '}
                                                        workload
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-3 pt-4">
                        <Button onClick={handleReassign} disabled={!selectedWorker} className="flex-1">
                            Reassign Guest
                        </Button>
                        <Button variant="outline" onClick={() => setOpen(false)} className="flex-1">
                            Cancel
                        </Button>
                    </div>

                    {/* Permission Notice */}
                    <div className="text-xs text-gray-500 text-center p-3 bg-gray-50 rounded">
                        {currentUser.role === 'coordinator'
                            ? 'As a coordinator, you can only reassign guests within your zone'
                            : 'As an admin, you can reassign guests to any worker in any zone'}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
