import React from 'react';
import {
    LineChart as RechartsLineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '../../ui/card';

interface TrendChartProps {
    data: Array<{
        month: string;
        newGuests: number;
        converted: number;
    }>;
}

export function TrendChart({ data }: TrendChartProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Monthly Trends</CardTitle>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                    <RechartsLineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="newGuests" stroke="#3B82F6" strokeWidth={2} name="New Guests" />
                        <Line type="monotone" dataKey="converted" stroke="#10B981" strokeWidth={2} name="Converted" />
                    </RechartsLineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
