import React, { useState } from 'react';
import { Trophy, Medal, Award, Star, TrendingUp, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { User, Role } from '../store/types';

interface LeaderboardsProps {
    currentUser: User;
}

// Mock leaderboard data
const workerLeaderboard = [
    {
        id: 'worker1',
        name: 'John Worker',
        zone: 'Central',
        avatar: 'JW',
        stats: {
            guestsCaptured: 28,
            conversions: 8,
            callsMade: 156,
            visitsMade: 24,
            milestoneCompletions: 45,
            consistency: 95,
        },
        badges: ['Top Evangelist', 'Consistent Caller', 'Conversion King'],
        trend: 'up',
        points: 2850,
    },
    {
        id: 'worker2',
        name: 'Mary Helper',
        zone: 'South',
        avatar: 'MH',
        stats: {
            guestsCaptured: 25,
            conversions: 7,
            callsMade: 142,
            visitsMade: 31,
            milestoneCompletions: 42,
            consistency: 88,
        },
        badges: ['Visit Champion', 'Faithful Follower'],
        trend: 'up',
        points: 2720,
    },
    {
        id: 'worker3',
        name: 'Paul Evangelist',
        zone: 'North',
        avatar: 'PE',
        stats: {
            guestsCaptured: 32,
            conversions: 6,
            callsMade: 134,
            visitsMade: 19,
            milestoneCompletions: 38,
            consistency: 92,
        },
        badges: ['Guest Magnet', 'Street Warrior'],
        trend: 'stable',
        points: 2680,
    },
    {
        id: 'worker4',
        name: 'Sarah Minister',
        zone: 'East',
        avatar: 'SM',
        stats: {
            guestsCaptured: 22,
            conversions: 5,
            callsMade: 118,
            visitsMade: 16,
            milestoneCompletions: 35,
            consistency: 85,
        },
        badges: ['Rising Star'],
        trend: 'up',
        points: 2420,
    },
    {
        id: 'worker5',
        name: 'David Pastor',
        zone: 'West',
        avatar: 'DP',
        stats: {
            guestsCaptured: 19,
            conversions: 5,
            callsMade: 95,
            visitsMade: 22,
            milestoneCompletions: 32,
            consistency: 78,
        },
        badges: ['Steady Eddie'],
        trend: 'down',
        points: 2180,
    },
];

const zoneLeaderboard = [
    {
        zone: 'South Zone',
        coordinator: 'Pastor Mike',
        stats: {
            totalGuests: 89,
            conversions: 24,
            conversionRate: 27,
            activeWorkers: 6,
            avgResponseTime: '2.3 hours',
        },
        points: 8950,
        trend: 'up',
    },
    {
        zone: 'Central Zone',
        coordinator: 'Elder Sarah',
        stats: {
            totalGuests: 76,
            conversions: 19,
            conversionRate: 25,
            activeWorkers: 5,
            avgResponseTime: '1.8 hours',
        },
        points: 8200,
        trend: 'up',
    },
    {
        zone: 'North Zone',
        coordinator: 'Deacon John',
        stats: {
            totalGuests: 68,
            conversions: 16,
            conversionRate: 24,
            activeWorkers: 4,
            avgResponseTime: '3.1 hours',
        },
        points: 7680,
        trend: 'stable',
    },
    {
        zone: 'East Zone',
        coordinator: 'Minister Lisa',
        stats: {
            totalGuests: 62,
            conversions: 14,
            conversionRate: 23,
            activeWorkers: 4,
            avgResponseTime: '2.7 hours',
        },
        points: 7020,
        trend: 'down',
    },
    {
        zone: 'West Zone',
        coordinator: 'Pastor David',
        stats: {
            totalGuests: 55,
            conversions: 12,
            conversionRate: 22,
            activeWorkers: 3,
            avgResponseTime: '4.2 hours',
        },
        points: 6240,
        trend: 'down',
    },
];

const achievements = [
    {
        id: 'first_guest',
        title: 'First Guest',
        description: 'Capture your first guest',
        icon: Users,
        rarity: 'common',
        points: 100,
    },
    {
        id: 'conversion_master',
        title: 'Conversion Master',
        description: 'Convert 10 guests to workforce',
        icon: Trophy,
        rarity: 'legendary',
        points: 1000,
    },
    {
        id: 'consistent_caller',
        title: 'Consistent Caller',
        description: 'Make calls for 30 days straight',
        icon: Star,
        rarity: 'rare',
        points: 500,
    },
    {
        id: 'visit_champion',
        title: 'Visit Champion',
        description: 'Complete 50 home visits',
        icon: Award,
        rarity: 'epic',
        points: 750,
    },
];

export function Leaderboards({ currentUser }: LeaderboardsProps) {
    const [selectedPeriod, setSelectedPeriod] = useState('month');
    const [activeTab, setActiveTab] = useState('workers');

    const getBadgeColor = (rarity: string) => {
        switch (rarity) {
            case 'common':
                return 'bg-gray-100 text-gray-800';
            case 'rare':
                return 'bg-blue-100 text-blue-800';
            case 'epic':
                return 'bg-purple-100 text-purple-800';
            case 'legendary':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getRankIcon = (position: number) => {
        switch (position) {
            case 1:
                return <Trophy className="w-6 h-6 text-yellow-500" />;
            case 2:
                return <Medal className="w-6 h-6 text-gray-400" />;
            case 3:
                return <Award className="w-6 h-6 text-orange-500" />;
            default:
                return (
                    <div className="w-6 h-6 flex items-center justify-center bg-gray-200 rounded-full text-sm font-medium">
                        {position}
                    </div>
                );
        }
    };

    const getTrendIcon = (trend: string) => {
        switch (trend) {
            case 'up':
                return <TrendingUp className="w-4 h-4 text-green-500" />;
            case 'down':
                return <TrendingUp className="w-4 h-4 text-red-500 rotate-180" />;
            default:
                return <div className="w-4 h-4 bg-gray-400 rounded-full" />;
        }
    };

    // Find current user's position
    const currentUserPosition = workerLeaderboard.findIndex(worker => worker.id === currentUser._id) + 1;
    const currentUserData = workerLeaderboard.find(worker => worker.id === currentUser._id);

    return (
        <div className="p-4 max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Leaderboards</h1>
                <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                    <SelectTrigger className="w-32">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="week">This Week</SelectItem>
                        <SelectItem value="month">This Month</SelectItem>
                        <SelectItem value="quarter">This Quarter</SelectItem>
                        <SelectItem value="year">This Year</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Current User Stats */}
            {currentUser.role === Role.WORKER && currentUserData && (
                <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-3">
                                {getRankIcon(currentUserPosition)}
                                <div>
                                    <h3 className="font-bold text-lg">Your Ranking</h3>
                                    <p className="text-sm text-gray-600">
                                        {currentUserPosition === 1
                                            ? "You're in the lead!"
                                            : currentUserPosition <= 3
                                              ? "You're in the top 3!"
                                              : `Position ${currentUserPosition} of ${workerLeaderboard.length}`}
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-2xl font-bold text-blue-600">{currentUserData.points}</div>
                                <div className="text-sm text-gray-600">Points</div>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div className="text-center">
                                <div className="text-lg font-bold">{currentUserData.stats.conversions}</div>
                                <div className="text-xs text-gray-600">Conversions</div>
                            </div>
                            <div className="text-center">
                                <div className="text-lg font-bold">{currentUserData.stats.guestsCaptured}</div>
                                <div className="text-xs text-gray-600">Guests Captured</div>
                            </div>
                            <div className="text-center">
                                <div className="text-lg font-bold">{currentUserData.stats.consistency}%</div>
                                <div className="text-xs text-gray-600">Consistency</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="workers">Workers</TabsTrigger>
                    <TabsTrigger value="zones">Zones</TabsTrigger>
                    <TabsTrigger value="achievements">Achievements</TabsTrigger>
                </TabsList>

                <TabsContent value="workers" className="space-y-4">
                    {workerLeaderboard.map((worker, index) => (
                        <Card
                            key={worker.id}
                            className={worker.id === currentUser._id ? 'ring-2 ring-blue-500 bg-blue-50' : ''}
                        >
                            <CardContent className="p-4">
                                <div className="flex items-start sm:items-center space-x-4">
                                    <div className="space-y-4">
                                        <div className="flex items-center space-x-3">
                                            {getRankIcon(index + 1)}
                                            <Avatar className="w-12 h-12">
                                                <AvatarFallback>{worker.avatar}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <h3 className="font-semibold">{worker.name}</h3>
                                                <p className="text-sm text-gray-600">{worker.zone} Zone</p>
                                            </div>
                                        </div>
                                        <div className="sm:hidden">
                                            <div className="flex items-center space-x-2 mb-1">
                                                <span className="font-bold">{worker.points}</span>
                                                {getTrendIcon(worker.trend)}
                                            </div>
                                            <div className="text-xs text-start text-gray-500">points</div>
                                        </div>
                                    </div>

                                    <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                                        <div>
                                            <div className="font-bold text-blue-600">{worker.stats.conversions}</div>
                                            <div className="text-xs text-gray-600">Conversions</div>
                                        </div>
                                        <div>
                                            <div className="font-bold text-green-600">
                                                {worker.stats.guestsCaptured}
                                            </div>
                                            <div className="text-xs text-gray-600">Guests</div>
                                        </div>
                                        <div>
                                            <div className="font-bold text-purple-600">{worker.stats.callsMade}</div>
                                            <div className="text-xs text-gray-600">Calls</div>
                                        </div>
                                        <div>
                                            <div className="font-bold text-orange-600">{worker.stats.visitsMade}</div>
                                            <div className="text-xs text-gray-600">Visits</div>
                                        </div>
                                    </div>

                                    <div className="text-right hidden sm:block">
                                        <div className="flex items-center space-x-2 mb-1">
                                            <span className="font-bold">{worker.points}</span>
                                            {getTrendIcon(worker.trend)}
                                        </div>
                                        <div className="text-xs text-gray-500">points</div>
                                    </div>
                                </div>

                                {worker.badges.length > 0 && (
                                    <div className="mt-3 flex flex-wrap gap-1">
                                        {worker.badges.map((badge, badgeIndex) => (
                                            <Badge key={badgeIndex} variant="secondary" className="text-xs">
                                                {badge}
                                            </Badge>
                                        ))}
                                    </div>
                                )}

                                <div className="mt-3">
                                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                                        <span>Consistency</span>
                                        <span>{worker.stats.consistency}%</span>
                                    </div>
                                    <Progress value={worker.stats.consistency} className="h-2" />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </TabsContent>

                <TabsContent value="zones" className="space-y-4">
                    {zoneLeaderboard.map((zone, index) => (
                        <Card key={zone.zone}>
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center space-x-3">
                                        {getRankIcon(index + 1)}
                                        <div>
                                            <h3 className="font-semibold">{zone.zone}</h3>
                                            <p className="text-sm text-gray-600">Led by {zone.coordinator}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="flex items-center space-x-2">
                                            <span className="font-bold">{zone.points}</span>
                                            {getTrendIcon(zone.trend)}
                                        </div>
                                        <div className="text-xs text-gray-500">points</div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="text-center">
                                        <div className="font-bold text-blue-600">{zone.stats.totalGuests}</div>
                                        <div className="text-xs text-gray-600">Total Guests</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="font-bold text-green-600">{zone.stats.conversions}</div>
                                        <div className="text-xs text-gray-600">Conversions</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="font-bold text-purple-600">{zone.stats.conversionRate}%</div>
                                        <div className="text-xs text-gray-600">Conversion Rate</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="font-bold text-orange-600">{zone.stats.activeWorkers}</div>
                                        <div className="text-xs text-gray-600">Workers</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </TabsContent>

                <TabsContent value="achievements" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {achievements.map(achievement => {
                            const Icon = achievement.icon;
                            return (
                                <Card key={achievement.id}>
                                    <CardContent className="p-4">
                                        <div className="flex items-start space-x-3">
                                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                                <Icon className="w-6 h-6 text-blue-600" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between mb-1">
                                                    <h3 className="font-semibold">{achievement.title}</h3>
                                                    <Badge
                                                        variant="outline"
                                                        className={getBadgeColor(achievement.rarity)}
                                                    >
                                                        {achievement.rarity}
                                                    </Badge>
                                                </div>
                                                <p className="text-sm text-gray-600 mb-2">{achievement.description}</p>
                                                <div className="text-sm font-medium text-blue-600">
                                                    {achievement.points} points
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>

                    <Card className="mt-6">
                        <CardHeader>
                            <CardTitle>Coming Soon</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2 text-sm text-gray-600">
                                <p>• Monthly challenges with special rewards</p>
                                <p>• Team-based competitions between zones</p>
                                <p>• Milestone celebrations and recognition events</p>
                                <p>• Seasonal achievement campaigns</p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
