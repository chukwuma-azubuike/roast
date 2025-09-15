import { User, Role } from '../../store/types';

interface PermissionNoticeProps {
    currentUser: User;
}

export function PermissionNotice({ currentUser }: PermissionNoticeProps) {
    return (
        <div className="text-xs text-gray-500 text-center p-3 bg-gray-50 rounded">
            {currentUser.role === Role.ZONAL_COORDINATOR
                ? 'As a coordinator, you can only reassign guests within your zone'
                : 'As an admin, you can reassign guests to any worker in any zone'}
        </div>
    );
}
