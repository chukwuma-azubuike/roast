import { Card, CardContent } from '../../ui/card';

interface StatCardProps {
    value: number;
    label: string;
    color: string;
    valueUnit?: string;
}

export function StatCard({ value, label, color, valueUnit = '' }: StatCardProps) {
    return (
        <Card>
            <CardContent className="p-4 text-center">
                <div className={`text-2xl font-bold ${color}`}>
                    {value}
                    {valueUnit}
                </div>
                <div className="text-sm text-gray-600">{label}</div>
            </CardContent>
        </Card>
    );
}

interface ZoneStatsProps {
    totalGuests: number;
    conversionRate: number;
    activeThisWeek: number;
    totalWorkers: number;
}

export function ZoneStats({ totalGuests, conversionRate, activeThisWeek, totalWorkers }: ZoneStatsProps) {
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard value={totalGuests} label="Total Guests" color="text-blue-600" />
            <StatCard value={conversionRate} label="Conversion Rate" color="text-green-600" valueUnit="%" />
            <StatCard value={activeThisWeek} label="Active This Week" color="text-purple-600" />
            <StatCard value={totalWorkers} label="Active Workers" color="text-orange-600" />
        </div>
    );
}
