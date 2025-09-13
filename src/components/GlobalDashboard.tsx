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

// Mock data for global analytics
const zonePerformanceData = [
    { zone: 'Central', invited: 45, attended: 32, discipled: 18, joined: 12, conversion: 27 },
    { zone: 'North', invited: 38, attended: 28, discipled: 15, joined: 8, conversion: 21 },
    { zone: 'South', invited: 52, attended: 35, discipled: 22, joined: 15, conversion: 29 },
    { zone: 'East', invited: 41, attended: 29, discipled: 16, joined: 10, conversion: 24 },
    { zone: 'West', invited: 36, attended: 24, discipled: 14, joined: 9, conversion: 25 },
];

const monthlyTrendsData = [
    { month: 'Jul', newGuests: 28, converted: 5 },
    { month: 'Aug', newGuests: 35, converted: 8 },
    { month: 'Sep', newGuests: 42, converted: 12 },
    { month: 'Oct', newGuests: 38, converted: 10 },
    { month: 'Nov', newGuests: 45, converted: 15 },
    { month: 'Dec', newGuests: 52, converted: 18 },
];

const stageDistribution = [
    { name: 'Invited', value: 212, color: '#3B82F6' },
    { name: 'Attended', value: 148, color: '#10B981' },
    { name: 'Discipled', value: 85, color: '#8B5CF6' },
    { name: 'Joined', value: 54, color: '#6B7280' },
];

const dropOffAnalysis = [
    { stage: 'Invited → Attended', dropOff: 30, reason: 'No follow-up call' },
    { stage: 'Attended → Discipled', dropOff: 43, reason: 'Not invited to small group' },
    { stage: 'Discipled → Joined', dropOff: 36, reason: 'Lack of mentorship' },
];

const topPerformers = [
    { name: 'John Worker', zone: 'Central', conversions: 8, trend: 'up' },
    { name: 'Mary Helper', zone: 'South', conversions: 7, trend: 'up' },
    { name: 'Paul Evangelist', zone: 'North', conversions: 6, trend: 'stable' },
    { name: 'Sarah Minister', zone: 'East', conversions: 5, trend: 'down' },
    { name: 'David Pastor', zone: 'West', conversions: 5, trend: 'up' },
];

export function GlobalDashboard() {
    const [timeRange, setTimeRange] = useState('6months');
    const [selectedZone, setSelectedZone] = useState('all');

    const totalGuests = stageDistribution.reduce((sum, stage) => sum + stage.value, 0);
    const conversionRate = Math.round(
        ((stageDistribution.find(s => s.name === 'Joined')?.value || 0) / totalGuests) * 100
    );
    const avgTimeToConversion = 42; // days
    const activeWorkers = 25;

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
                                <p className="text-2xl font-bold">{totalGuests.toLocaleString()}</p>
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
                                <p className="text-2xl font-bold">{conversionRate}%</p>
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
                                <p className="text-2xl font-bold">{avgTimeToConversion}d</p>
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
                                <p className="text-2xl font-bold">{activeWorkers}</p>
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
                                            data={stageDistribution}
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="value"
                                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                        >
                                            {stageDistribution.map((entry, index) => (
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
                                    {topPerformers.map((performer, index) => (
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
                                                    {performer.trend === 'up' ? (
                                                        <TrendingUp className="w-3 h-3 text-green-500" />
                                                    ) : performer.trend === 'down' ? (
                                                        <TrendingDown className="w-3 h-3 text-red-500" />
                                                    ) : (
                                                        <div className="w-3 h-3 bg-gray-400 rounded-full" />
                                                    )}
                                                    <span className="text-xs text-gray-500">
                                                        {performer.trend === 'up'
                                                            ? 'Rising'
                                                            : performer.trend === 'down'
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
                                <BarChart data={zonePerformanceData}>
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
                                <LineChart data={monthlyTrendsData}>
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
                                    {dropOffAnalysis.map((item, index) => (
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
