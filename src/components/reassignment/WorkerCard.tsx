import { User } from '../../store/types';
import { Card, CardContent } from '../ui/card';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { useWorkerFiltering } from './hooks/useWorkerFiltering';

interface WorkerCardProps {
    worker: User;
    isSelected: boolean;
    onClick: () => void;
}

export function WorkerCard({ worker, isSelected, onClick }: WorkerCardProps) {
    const { getWorkloadColor, getWorkloadLabel } = useWorkerFiltering({
        currentUser: {} as User, // Not needed for just workload calculations
        selectedZone: '',
        searchTerm: ''
    });

    return (
        <Card
            className={`cursor-pointer transition-colors ${
                isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:bg-gray-50'
            }`}
            onClick={onClick}
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
                                worker.guestCount ?? 0
                            )}`}
                        >
                            {worker.guestCount} guests
                        </div>
                        <div className="text-xs text-gray-500">
                            {getWorkloadLabel(worker.guestCount ?? 0)} workload
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
