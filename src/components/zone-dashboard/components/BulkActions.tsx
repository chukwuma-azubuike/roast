import { UserCheck, X } from 'lucide-react';
import { Button } from '../../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { User, Role } from '../../../store/types';

interface BulkActionsProps {
    bulkReassignMode: boolean;
    selectedGuests: string[];
    workers: User[];
    onBulkReassignStart: () => void;
    onBulkReassignCancel: () => void;
    onWorkerSelect: (workerId: string) => void;
}

export function BulkActions({
    bulkReassignMode,
    selectedGuests,
    workers,
    onBulkReassignStart,
    onBulkReassignCancel,
    onWorkerSelect,
}: BulkActionsProps) {
    if (!bulkReassignMode) {
        return (
            <Button variant="outline" onClick={onBulkReassignStart}>
                <UserCheck className="w-4 h-4 mr-2" />
                Bulk Reassign
            </Button>
        );
    }

    return (
        <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">{selectedGuests.length} selected</span>
            <Select onValueChange={onWorkerSelect}>
                <SelectTrigger className="w-40">
                    <SelectValue placeholder="Assign to..." />
                </SelectTrigger>
                <SelectContent>
                    {workers
                        .filter(u => u.role === Role.WORKER)
                        .map(worker => (
                            <SelectItem key={worker._id} value={worker._id}>
                                {worker.name}
                            </SelectItem>
                        ))}
                </SelectContent>
            </Select>
            <Button variant="outline" onClick={onBulkReassignCancel}>
                <X className="w-4 h-4" />
            </Button>
        </div>
    );
}
