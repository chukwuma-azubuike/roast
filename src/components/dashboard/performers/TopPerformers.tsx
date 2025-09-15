import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../ui/card';
import { TopPerformerCard } from './TopPerformerCard';
import { TrendDirection } from '../../../store/types';

interface TopPerformersProps {
    performers: Array<{
        name: string;
        zone: string;
        conversions: number;
        trend: TrendDirection;
    }>;
}

export function TopPerformers({ performers }: TopPerformersProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Top Performing Workers</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {performers.map((performer, index) => (
                        <TopPerformerCard key={performer.name} {...performer} rank={index + 1} />
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
