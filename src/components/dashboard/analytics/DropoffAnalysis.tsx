import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../ui/card';
import { ProgressBar } from '../../shared/ProgressBar';
import { cn } from '../../ui/utils';

interface DropoffAnalysisProps {
    data: Array<{
        stage: string;
        dropOff: number;
        reason: string;
    }>;
}

export function DropoffAnalysis({ data }: DropoffAnalysisProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Drop-off Analysis</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {data.map((item, index) => (
                        <div key={index} className="p-4 border rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                                <h4 className="font-medium">{item.stage}</h4>
                                <span className="text-lg font-bold text-red-600">{item.dropOff}% drop-off</span>
                            </div>
                            <p className="text-sm text-gray-600">
                                <strong>Primary reason:</strong> {item.reason}
                            </p>
                            <ProgressBar progress={item.dropOff} showLabel={false} barClassName={cn('bg-red-500')} />
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
