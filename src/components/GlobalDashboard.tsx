import React, { useState } from 'react';
import { BarChart3, TrendingUp, TrendingDown, Users, Award, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell,
} from 'recharts';
import { useGetGlobalAnalyticsQuery } from '../store/api';
import { TrendDirection } from '../store/types';


export function GlobalDashboard() {
    const [timeRange, setTimeRange] = useState('6months');
    const [selectedZone, setSelectedZone] = useState('all');

    const { data: analytics, isLoading, error } = useGetGlobalAnalyticsQuery({
        timeRange,
        zoneId: selectedZone === 'all' ? undefined : selectedZone,
    });

    if (isLoading) {
        return (
            <div className="p-4">
                <div className="animate-pulse space-y-4">
                    <div className="h-8 bg-gray-200 rounded w-1/4" />
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[...Array(4)].map((_, i) => (
                            <Card key={i}>
                                <CardContent className="p-4">
                                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-2" />
                                    <div className="h-6 bg-gray-200 rounded w-3/4" />
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <Card className="m-4">
                <CardContent className="p-8 text-center">
                    <p className="text-red-500">Error loading analytics data</p>
                </CardContent>
            </Card>
        );
    }

    if (!analytics) {
        return null;
    }

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
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Total Guests</p>
                                <p className="text-2xl font-bold">{analytics.totalGuests.toLocaleString()}</p>
                                <p className="text-xs text-green-600 flex items-center">
                                    <TrendingUp className="w-3 h-3 mr-1" />
                                    +12% this month
                                </p>
                            </div>
                            <Users className="w-8 h-8 text-blue-500" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Conversion Rate</p>
                                <p className="text-2xl font-bold">{analytics.conversionRate}%</p>
                                <p className="text-xs text-green-600 flex items-center">
                                    <TrendingUp className="w-3 h-3 mr-1" />
                                    +3% this month
                                </p>
                            </div>
                            <BarChart3 className="w-8 h-8 text-green-500" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Avg. Conversion Time</p>
                                <p className="text-2xl font-bold">{analytics.avgTimeToConversion}d</p>
                                <p className="text-xs text-red-600 flex items-center">
                                    <TrendingDown className="w-3 h-3 mr-1" />
                                    -5d this month
                                </p>
                            </div>
                            <Calendar className="w-8 h-8 text-purple-500" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Active Workers</p>
                                <p className="text-2xl font-bold">{analytics.activeWorkers}</p>
                                <p className="text-xs text-green-600 flex items-center">
                                    <TrendingUp className="w-3 h-3 mr-1" />
                                    +2 this month
                                </p>
                            </div>
                            <Award className="w-8 h-8 text-orange-500" />
                        </div>
                    </CardContent>
                </Card>
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
                        {/* Pipeline Distribution */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Guest Distribution by Stage</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie
                                            data={analytics.stageDistribution}
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="value"
                                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                        >
                                            {analytics.stageDistribution.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        {/* Top Performers */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Top Performing Workers</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {analytics.topPerformers.map((performer, index) => (
                                        <div
                                            key={performer.name}
                                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                        >
                                            <div className="flex items-center space-x-3">
                                                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
                                                    {index + 1}
                                                </div>
                                                <div>
                                                    <p className="font-medium">{performer.name}</p>
                                                    <p className="text-sm text-gray-500">{performer.zone} Zone</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-medium">{performer.conversions} conversions</p>
                                                <div className="flex items-center space-x-1">
                                                    {performer.trend === TrendDirection.UP ? (
                                                        <TrendingUp className="w-3 h-3 text-green-500" />
                                                    ) : performer.trend === TrendDirection.DOWN ? (
                                                        <TrendingDown className="w-3 h-3 text-red-500" />
                                                    ) : (
                                                        <div className="w-3 h-3 bg-gray-400 rounded-full" />
                                                    )}
                                                    <span className="text-xs text-gray-500">
                                                        {performer.trend === TrendDirection.UP
                                                            ? 'Rising'
                                                            : performer.trend === TrendDirection.DOWN
                                                              ? 'Declining'
                                                              : 'Stable'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="zones">
                    <Card>
                        <CardHeader>
                            <CardTitle>Zone Performance Comparison</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={400}>
                                <BarChart data={analytics.zonePerformance}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="zone" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="invited" fill="#3B82F6" name="Invited" />
                                    <Bar dataKey="attended" fill="#10B981" name="Attended" />
                                    <Bar dataKey="discipled" fill="#8B5CF6" name="Discipled" />
                                    <Bar dataKey="joined" fill="#6B7280" name="Joined" />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="trends">
                    <Card>
                        <CardHeader>
                            <CardTitle>Monthly Trends</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={400}>
                                <LineChart data={analytics.monthlyTrends}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip />
                                    <Line
                                        type="monotone"
                                        dataKey="newGuests"
                                        stroke="#3B82F6"
                                        strokeWidth={2}
                                        name="New Guests"
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="converted"
                                        stroke="#10B981"
                                        strokeWidth={2}
                                        name="Converted"
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="analytics">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Drop-off Analysis */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Drop-off Analysis</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {analytics.dropOffAnalysis.map((item, index) => (
                                        <div key={index} className="p-4 border rounded-lg">
                                            <div className="flex items-center justify-between mb-2">
                                                <h4 className="font-medium">{item.stage}</h4>
                                                <span className="text-lg font-bold text-red-600">
                                                    {item.dropOff}% drop-off
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-600">
                                                <strong>Primary reason:</strong> {item.reason}
                                            </p>
                                            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                                                <div
                                                    className="bg-red-500 h-2 rounded-full"
                                                    style={{ width: `${item.dropOff}%` }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Recommendations */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Recommendations</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <div className="p-3 bg-blue-50 border-l-4 border-blue-400 rounded">
                                        <p className="font-medium text-blue-900">Improve Follow-up Process</p>
                                        <p className="text-sm text-blue-800">
                                            30% of invited guests aren't being followed up. Consider automated
                                            reminders.
                                        </p>
                                    </div>
                                    <div className="p-3 bg-green-50 border-l-4 border-green-400 rounded">
                                        <p className="font-medium text-green-900">Small Group Integration</p>
                                        <p className="text-sm text-green-800">
                                            South Zone shows best attendance-to-discipleship conversion. Replicate their
                                            model.
                                        </p>
                                    </div>
                                    <div className="p-3 bg-purple-50 border-l-4 border-purple-400 rounded">
                                        <p className="font-medium text-purple-900">Mentorship Program</p>
                                        <p className="text-sm text-purple-800">
                                            36% drop-off from discipled to joined suggests need for better mentorship
                                            matching.
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
