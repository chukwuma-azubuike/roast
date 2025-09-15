import React from 'react';
import { TrendDirection } from '../../../store/types';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface TopPerformerCardProps {
    name: string;
    zone: string;
    conversions: number;
    trend: TrendDirection;
    rank: number;
}

export function TopPerformerCard({ name, zone, conversions, trend, rank }: TopPerformerCardProps) {
    return (
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
                    {rank}
                </div>
                <div>
                    <p className="font-medium">{name}</p>
                    <p className="text-sm text-gray-500">{zone} Zone</p>
                </div>
            </div>
            <div className="text-right">
                <p className="font-medium">{conversions} conversions</p>
                <div className="flex items-center space-x-1">
                    {trend === TrendDirection.UP ? (
                        <TrendingUp className="w-3 h-3 text-green-500" />
                    ) : trend === TrendDirection.DOWN ? (
                        <TrendingDown className="w-3 h-3 text-red-500" />
                    ) : (
                        <div className="w-3 h-3 bg-gray-400 rounded-full" />
                    )}
                    <span className="text-xs text-gray-500">
                        {trend === TrendDirection.UP
                            ? 'Rising'
                            : trend === TrendDirection.DOWN
                            ? 'Declining'
                            : 'Stable'}
                    </span>
                </div>
            </div>
        </div>
    );
}
