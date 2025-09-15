import React from 'react';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '../../ui/card';

interface ZonePerformanceChartProps {
    data: Array<{
        zone: string;
        invited: number;
        attended: number;
        discipled: number;
        joined: number;
    }>;
}

export function ZonePerformanceChart({ data }: ZonePerformanceChartProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Zone Performance Comparison</CardTitle>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                    <RechartsBarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="zone" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="invited" fill="#3B82F6" name="Invited" />
                        <Bar dataKey="attended" fill="#10B981" name="Attended" />
                        <Bar dataKey="discipled" fill="#8B5CF6" name="Discipled" />
                        <Bar dataKey="joined" fill="#6B7280" name="Joined" />
                    </RechartsBarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
