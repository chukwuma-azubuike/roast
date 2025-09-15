import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../ui/card';
import { Checkbox } from '../../ui/checkbox';
import { CheckCircle } from 'lucide-react';
import { Milestone, MilestoneStatus } from '../../../store/types';

interface MilestonesCardProps {
    milestones: Milestone[];
    onToggle: (milestoneId: string) => void;
}

export function MilestonesCard({ milestones, onToggle }: MilestonesCardProps) {
    return (
        <Card className="mb-6">
            <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5" />
                    <span>Assimilation Milestones</span>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {milestones?.map(milestone => (
                        <div key={milestone._id} className="flex items-center space-x-3">
                            <Checkbox
                                checked={milestone.status === MilestoneStatus.COMPLETED}
                                onCheckedChange={() => onToggle(milestone._id)}
                            />
                            <div className="flex-1">
                                <span
                                    className={
                                        milestone.status === MilestoneStatus.COMPLETED
                                            ? 'line-through text-gray-500'
                                            : ''
                                    }
                                >
                                    {milestone.title}
                                </span>
                                {milestone.status === MilestoneStatus.COMPLETED && milestone.completedAt && (
                                    <span className="text-xs text-gray-500 ml-2">
                                        ✓ {new Date(milestone.completedAt).toLocaleString()}
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
