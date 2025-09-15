import { Users } from 'lucide-react';
import { Label } from '../ui/label';
import { User } from '../../store/types';
import { WorkerCard } from './WorkerCard';

interface WorkerListProps {
    users?: User[];
    selectedWorker: string;
    onWorkerSelect: (workerId: string) => void;
}

export function WorkerList({ users, selectedWorker, onWorkerSelect }: WorkerListProps) {
    if (!users?.length) {
        return (
            <div className="text-center py-8 text-gray-500">
                <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No available workers found</p>
                <p className="text-sm">Try adjusting your search or zone selection</p>
            </div>
        );
    }

    return (
        <div>
            <Label className="text-sm font-medium">Available Workers</Label>
            <div className="mt-2 space-y-2 max-h-60 overflow-y-auto">
                {users.map(worker => (
                    <WorkerCard
                        key={worker._id}
                        worker={worker}
                        isSelected={selectedWorker === worker._id}
                        onClick={() => onWorkerSelect(worker._id)}
                    />
                ))}
            </div>
        </div>
    );
}
