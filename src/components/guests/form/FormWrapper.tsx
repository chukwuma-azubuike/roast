import React from 'react';
import { Card, CardContent } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { useOnlineStatus } from '../../../hooks/shared';

interface FormWrapperProps {
    title: string;
    subtitle?: string;
    children: React.ReactNode;
}

export function FormWrapper({ title, subtitle, children }: FormWrapperProps) {
    const isOnline = useOnlineStatus();

    return (
        <div className="p-4 max-w-lg mx-auto">
            <Card>
                <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h2 className="text-xl font-semibold">{title}</h2>
                            {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
                        </div>
                        {!isOnline && (
                            <Badge variant="outline" className="text-orange-600 border-orange-200">
                                Offline Mode
                            </Badge>
                        )}
                    </div>
                    {children}
                </CardContent>
            </Card>
        </div>
    );
}
