import React from 'react';
import { Card, CardContent } from '../../ui/card';

interface QuickTipsProps {
    tips: string[];
}

export function QuickTips({ tips }: QuickTipsProps) {
    return (
        <Card className="mt-4">
            <CardContent className="pt-4">
                <h3 className="font-medium mb-2">Quick Tips</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                    {tips.map((tip, index) => (
                        <li key={index}>• {tip}</li>
                    ))}
                </ul>
            </CardContent>
        </Card>
    );
}
