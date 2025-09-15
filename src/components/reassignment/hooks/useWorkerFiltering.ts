import { User, Role } from '../../../store/types';

interface UseWorkerFilteringProps {
    users?: User[];
    currentUser: User;
    selectedZone: string;
    searchTerm: string;
    excludeUserId?: string;
}

export function useWorkerFiltering({
    users,
    currentUser,
    selectedZone,
    searchTerm,
    excludeUserId
}: UseWorkerFilteringProps) {
    const getAvailableWorkers = () => {
        let workers = users;

        // Coordinators can only reassign within their zone
        if (currentUser.role === Role.ZONAL_COORDINATOR) {
            workers = workers?.filter(worker => worker.zoneIds?.includes(selectedZone));
        }
        // Admins and pastors can reassign to any zone
        else if (currentUser.role === Role.ADMIN || currentUser.role === Role.PASTOR) {
            if (selectedZone) {
                workers = workers?.filter(worker => worker.zoneIds?.includes(selectedZone));
            }
        }

        // Filter by search term
        if (searchTerm) {
            workers = workers?.filter(
                worker =>
                    worker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    worker.email?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Exclude specific user (e.g., current assignee)
        if (excludeUserId) {
            workers = workers?.filter(worker => worker._id !== excludeUserId);
        }

        return workers;
    };

    const getWorkloadColor = (guestCount: number) => {
        if (guestCount <= 5) return 'text-green-600';
        if (guestCount <= 10) return 'text-yellow-600';
        return 'text-red-600';
    };

    const getWorkloadLabel = (guestCount: number) => {
        if (guestCount <= 5) return 'Light';
        if (guestCount <= 10) return 'Moderate';
        return 'Heavy';
    };

    return {
        getAvailableWorkers,
        getWorkloadColor,
        getWorkloadLabel
    };
}
