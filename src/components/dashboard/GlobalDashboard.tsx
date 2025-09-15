import React, { useState } from 'react';
import { BarChart3, Users, Award, Calendar } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { useGetGlobalAnalyticsQuery } from '../../store/api';
import { StatsCard } from '../shared/StatsCard';
import { EmptyState } from '../shared/EmptyState';
import { useDebounce } from '../../hooks/shared';
import { DistributionChart } from './charts/DistributionChart';
import { ZonePerformanceChart } from './charts/ZonePerformanceChart';
import { TrendChart } from './charts/TrendChart';
import { TopPerformers } from './performers/TopPerformers';
import { DropoffAnalysis } from './analytics/DropoffAnalysis';
import { RecommendationsCard } from './analytics/RecommendationsCard';

export function GlobalDashboard() {
    const [timeRange, setTimeRange] = useState('6months');
    const [selectedZone, setSelectedZone] = useState('all');
    const debouncedZone = useDebounce(selectedZone, 300);

    const {
        data: analytics,
        isLoading,
        error,
    } = useGetGlobalAnalyticsQuery({
        timeRange,
        zoneId: debouncedZone === 'all' ? undefined : debouncedZone,
    });

    if (isLoading) {
        return (
            <div className="p-4">
                <div className="animate-pulse space-y-4">
                    <div className="h-8 bg-gray-200 rounded w-1/4" />
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[...Array(4)].map((_, i) => (
                            <StatsCard key={i} title="" value="" className="animate-pulse" />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return <EmptyState title="Error loading analytics data" />;
    }

    if (!analytics) {
        return null;
    }

    const recommendations = [
        {
            title: 'Improve Follow-up Process',
            description: "30% of invited guests aren't being followed up. Consider automated reminders.",
            type: 'info' as const,
        },
        {
            title: 'Small Group Integration',
            description: 'South Zone shows best attendance-to-discipleship conversion. Replicate their model.',
            type: 'success' as const,
        },
        {
            title: 'Mentorship Program',
            description: '36% drop-off from discipled to joined suggests need for better mentorship matching.',
            type: 'warning' as const,
        },
    ];

    return (
        <div className="p-4 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Global Dashboard</h1>
                <div className="flex space-x-2">
                    <Select value={timeRange} onValueChange={setTimeRange}>
                        <SelectTrigger className="w-32">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="1month">1 Month</SelectItem>
                            <SelectItem value="3months">3 Months</SelectItem>
                            <SelectItem value="6months">6 Months</SelectItem>
                            <SelectItem value="1year">1 Year</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select value={selectedZone} onValueChange={setSelectedZone}>
                        <SelectTrigger className="w-32">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Zones</SelectItem>
                            <SelectItem value="central">Central</SelectItem>
                            <SelectItem value="north">North</SelectItem>
                            <SelectItem value="south">South</SelectItem>
                            <SelectItem value="east">East</SelectItem>
                            <SelectItem value="west">West</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatsCard
                    title="Total Guests"
                    value={analytics.totalGuests}
                    icon={Users}
                    trend={{ value: 12, label: '% this month', direction: 'up' }}
                    iconColor="text-blue-500"
                />
                <StatsCard
                    title="Conversion Rate"
                    value={`${analytics.conversionRate}%`}
                    icon={BarChart3}
                    trend={{ value: 3, label: '% this month', direction: 'up' }}
                    iconColor="text-green-500"
                />
                <StatsCard
                    title="Avg. Conversion Time"
                    value={`${analytics.avgTimeToConversion}d`}
                    icon={Calendar}
                    trend={{ value: -5, label: 'd this month', direction: 'down' }}
                    iconColor="text-purple-500"
                />
                <StatsCard
                    title="Active Workers"
                    value={analytics.activeWorkers}
                    icon={Award}
                    trend={{ value: 2, label: ' this month', direction: 'up' }}
                    iconColor="text-orange-500"
                />
            </div>

            <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="zones">Zone Performance</TabsTrigger>
                    <TabsTrigger value="trends">Trends</TabsTrigger>
                    <TabsTrigger value="analytics">Analytics</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <DistributionChart data={analytics.stageDistribution} />
                        <TopPerformers performers={analytics.topPerformers} />
                    </div>
                </TabsContent>

                <TabsContent value="zones">
                    <ZonePerformanceChart data={analytics.zonePerformance} />
                </TabsContent>

                <TabsContent value="trends">
                    <TrendChart data={analytics.monthlyTrends} />
                </TabsContent>

                <TabsContent value="analytics">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <DropoffAnalysis data={analytics.dropOffAnalysis} />
                        <RecommendationsCard recommendations={recommendations} />
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
