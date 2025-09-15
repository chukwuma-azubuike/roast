import React from 'react';
import { Card, CardContent } from '../ui/card';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
    title: string;
    value: string | number;
    icon?: LucideIcon;
    trend?: {
        value: number;
        label: string;
        direction: 'up' | 'down' | 'neutral';
    };
    iconColor?: string;
    className?: string;
}

export function StatsCard({ title, value, icon: Icon, trend, iconColor = 'text-blue-500', className = '' }: StatsCardProps) {
    return (
        <Card className={className}>
            <CardContent className="p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-600">{title}</p>
                        <p className="text-2xl font-bold">
                            {typeof value === 'number' ? value.toLocaleString() : value}
                        </p>
                        {trend && (
                            <p
                                className={`text-xs flex items-center ${
                                    trend.direction === 'up'
                                        ? 'text-green-600'
                                        : trend.direction === 'down'
                                        ? 'text-red-600'
                                        : 'text-gray-600'
                                }`}
                            >
                                {trend.value}
                                {trend.label}
                            </p>
                        )}
                    </div>
                    {Icon && <Icon className={`w-8 h-8 ${iconColor}`} />}
                </div>
            </CardContent>
        </Card>
    );
}
