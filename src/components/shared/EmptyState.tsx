import React from 'react';
import { Card } from '../ui/card';
import { Users } from 'lucide-react';

interface EmptyStateProps {
    icon?: React.ReactNode;
    title: string;
    description?: string;
    action?: React.ReactNode;
}

export function EmptyState({ 
    icon = <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />,
    title,
    description,
    action
}: EmptyStateProps) {
    return (
        <Card className="p-8 text-center">
            {icon}
            <p className="text-gray-600 font-medium">{title}</p>
            {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
            {action && <div className="mt-4">{action}</div>}
        </Card>
    );
}
