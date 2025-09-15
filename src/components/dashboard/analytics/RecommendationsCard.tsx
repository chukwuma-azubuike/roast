import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../ui/card';

interface RecommendationProps {
    title: string;
    description: string;
    type: 'info' | 'success' | 'warning';
}

export function Recommendation({ title, description, type }: RecommendationProps) {
    const colors = {
        info: 'bg-blue-50 border-blue-400 text-blue-900',
        success: 'bg-green-50 border-green-400 text-green-900',
        warning: 'bg-purple-50 border-purple-400 text-purple-900',
    };

    return (
        <div className={`p-3 border-l-4 rounded ${colors[type]}`}>
            <p className="font-medium">{title}</p>
            <p className={`text-sm ${type === 'info' ? 'text-blue-800' : 
                type === 'success' ? 'text-green-800' : 'text-purple-800'}`}>
                {description}
            </p>
        </div>
    );
}

interface RecommendationsCardProps {
    recommendations: Array<{
        title: string;
        description: string;
        type: 'info' | 'success' | 'warning';
    }>;
}

export function RecommendationsCard({ recommendations }: RecommendationsCardProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {recommendations.map((rec, index) => (
                        <Recommendation key={index} {...rec} />
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
