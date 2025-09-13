import React, { useState } from 'react';
import { Bell, Clock, Phone, User as UserIcon, CheckCircle, X, AlertTriangle, Info, MessageSquare } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { toast } from 'sonner';
import type { User } from '../App';

interface NotificationCenterProps {
    currentUser: User;
}

interface Notification {
    id: string;
    type: 'follow_up' | 'stagnant' | 'milestone' | 'welcome' | 'reminder' | 'assignment';
    title: string;
    message: string;
    guestName?: string;
    guestId?: string;
    createdAt: Date;
    isRead: boolean;
    priority: 'low' | 'medium' | 'high';
    actionRequired: boolean;
}

// Mock notifications data
const mockNotifications: Notification[] = [
    {
        id: 'n1',
        type: 'follow_up',
        title: 'Follow-up Due',
        message: "Sarah Johnson needs a follow-up call - it's been 2 days since last contact",
        guestName: 'Sarah Johnson',
        guestId: 'guest1',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        isRead: false,
        priority: 'high',
        actionRequired: true,
    },
    {
        id: 'n2',
        type: 'milestone',
        title: 'Milestone Completed',
        message: 'Mike Chen completed "First Visit" milestone',
        guestName: 'Mike Chen',
        guestId: 'guest2',
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
        isRead: false,
        priority: 'medium',
        actionRequired: false,
    },
    {
        id: 'n3',
        type: 'stagnant',
        title: 'Guest Needs Attention',
        message: "Emily Rodriguez hasn't had contact in 7 days and may be losing interest",
        guestName: 'Emily Rodriguez',
        guestId: 'guest3',
        createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
        isRead: true,
        priority: 'high',
        actionRequired: true,
    },
    {
        id: 'n4',
        type: 'assignment',
        title: 'New Guest Assigned',
        message: 'Lisa Zhang has been assigned to you for follow-up',
        guestName: 'Lisa Zhang',
        guestId: 'guest5',
        createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
        isRead: true,
        priority: 'medium',
        actionRequired: true,
    },
    {
        id: 'n5',
        type: 'reminder',
        title: 'Weekly Report Due',
        message: 'Your weekly guest activity report is due tomorrow',
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        isRead: true,
        priority: 'low',
        actionRequired: true,
    },
    {
        id: 'n6',
        type: 'welcome',
        title: 'Welcome Message Sent',
        message: 'Welcome message sent to David Kim via WhatsApp',
        guestName: 'David Kim',
        guestId: 'guest4',
        createdAt: new Date(Date.now() - 36 * 60 * 60 * 1000), // 1.5 days ago
        isRead: true,
        priority: 'low',
        actionRequired: false,
    },
];

// Mock notification settings
const notificationSettings = {
    followUpReminders: true,
    milestoneUpdates: true,
    stagnantGuestAlerts: true,
    newAssignments: true,
    weeklyReports: true,
    welcomeMessages: false,
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
};

export function NotificationCenter({ currentUser }: NotificationCenterProps) {
    const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
    const [settings, setSettings] = useState(notificationSettings);
    const [activeTab, setActiveTab] = useState('all');

    // Filter notifications based on user role
    const userNotifications = notifications.filter(notification => {
        if (currentUser.role === 'worker') {
            return ['follow_up', 'milestone', 'assignment', 'reminder', 'welcome'].includes(notification.type);
        } else if (currentUser.role === 'coordinator') {
            return ['stagnant', 'milestone', 'assignment', 'reminder'].includes(notification.type);
        }
        return true; // Admin/Pastor see all
    });

    // Categorize notifications
    const categorizedNotifications = {
        all: userNotifications,
        unread: userNotifications.filter(n => !n.isRead),
        actionRequired: userNotifications.filter(n => n.actionRequired),
        today: userNotifications.filter(n => {
            const today = new Date();
            const notifDate = new Date(n.createdAt);
            return notifDate.toDateString() === today.toDateString();
        }),
    };

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case 'follow_up':
                return <Phone className="w-5 h-5" />;
            case 'stagnant':
                return <AlertTriangle className="w-5 h-5" />;
            case 'milestone':
                return <CheckCircle className="w-5 h-5" />;
            case 'welcome':
                return <MessageSquare className="w-5 h-5" />;
            case 'reminder':
                return <Clock className="w-5 h-5" />;
            case 'assignment':
                return <UserIcon className="w-5 h-5" />;
            default:
                return <Info className="w-5 h-5" />;
        }
    };

    const getNotificationColor = (type: string, priority: string) => {
        if (priority === 'high') return 'bg-red-100 text-red-600 border-red-200';
        if (priority === 'medium') return 'bg-yellow-100 text-yellow-600 border-yellow-200';

        switch (type) {
            case 'follow_up':
                return 'bg-blue-100 text-blue-600 border-blue-200';
            case 'stagnant':
                return 'bg-red-100 text-red-600 border-red-200';
            case 'milestone':
                return 'bg-green-100 text-green-600 border-green-200';
            case 'welcome':
                return 'bg-purple-100 text-purple-600 border-purple-200';
            case 'reminder':
                return 'bg-orange-100 text-orange-600 border-orange-200';
            case 'assignment':
                return 'bg-indigo-100 text-indigo-600 border-indigo-200';
            default:
                return 'bg-gray-100 text-gray-600 border-gray-200';
        }
    };

    const markAsRead = (notificationId: string) => {
        setNotifications(prev => prev.map(n => (n.id === notificationId ? { ...n, isRead: true } : n)));
    };

    const dismissNotification = (notificationId: string) => {
        setNotifications(prev => prev.filter(n => n.id !== notificationId));
        toast.success('Notification dismissed');
    };

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        toast.success('All notifications marked as read');
    };

    const formatTime = (date: Date) => {
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffHours / 24);

        if (diffHours < 1) return 'Just now';
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return date.toLocaleDateString();
    };

    const NotificationCard = ({ notification }: { notification: Notification }) => {
        const icon = getNotificationIcon(notification.type);
        const colorClass = getNotificationColor(notification.type, notification.priority);

        return (
            <Card
                className={`${
                    !notification.isRead ? 'border-l-4 border-l-blue-500 bg-blue-50' : ''
                } hover:shadow-md transition-shadow`}
            >
                <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                        <div className={`w-10 h-10 rounded-lg border flex items-center justify-center ${colorClass}`}>
                            {icon}
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-1">
                                <h3 className="font-medium text-sm">{notification.title}</h3>
                                <div className="flex items-center space-x-2">
                                    {notification.priority === 'high' && (
                                        <Badge variant="destructive" className="text-xs">
                                            High
                                        </Badge>
                                    )}
                                    {notification.actionRequired && (
                                        <Badge variant="outline" className="text-xs">
                                            Action Required
                                        </Badge>
                                    )}
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-6 w-6 p-0"
                                        onClick={() => dismissNotification(notification.id)}
                                    >
                                        <X className="w-3 h-3" />
                                    </Button>
                                </div>
                            </div>

                            <p className="text-sm text-gray-600 mb-2">{notification.message}</p>

                            <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-500">{formatTime(notification.createdAt)}</span>

                                {notification.actionRequired && (
                                    <div className="flex space-x-2">
                                        {notification.type === 'follow_up' && notification.guestId && (
                                            <>
                                                <Button size="sm" variant="outline" className="h-7 text-xs">
                                                    <Phone className="w-3 h-3 mr-1" />
                                                    Call
                                                </Button>
                                                <Button size="sm" variant="outline" className="h-7 text-xs">
                                                    View Profile
                                                </Button>
                                            </>
                                        )}
                                        {notification.type === 'assignment' && (
                                            <Button size="sm" variant="outline" className="h-7 text-xs">
                                                Accept
                                            </Button>
                                        )}
                                        {notification.type === 'reminder' && (
                                            <Button size="sm" variant="outline" className="h-7 text-xs">
                                                Complete
                                            </Button>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {!notification.isRead && (
                        <div className="mt-3">
                            <Button
                                size="sm"
                                variant="ghost"
                                className="h-7 text-xs"
                                onClick={() => markAsRead(notification.id)}
                            >
                                Mark as read
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        );
    };

    const unreadCount = categorizedNotifications.unread.length;
    const actionRequiredCount = categorizedNotifications.actionRequired.length;

    return (
        <div className="p-4 max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                    <Bell className="w-6 h-6" />
                    <h1 className="text-2xl font-bold">Notifications</h1>
                    {unreadCount > 0 && <Badge variant="destructive">{unreadCount} unread</Badge>}
                </div>

                {unreadCount > 0 && (
                    <Button variant="outline" onClick={markAllAsRead}>
                        Mark all as read
                    </Button>
                )}
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="all">All ({categorizedNotifications.all.length})</TabsTrigger>
                    <TabsTrigger value="unread">Unread ({unreadCount})</TabsTrigger>
                    <TabsTrigger value="actionRequired">Action Required ({actionRequiredCount})</TabsTrigger>
                    <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="space-y-3 mt-4">
                    {categorizedNotifications.all.length === 0 ? (
                        <Card>
                            <CardContent className="p-8 text-center">
                                <Bell className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                                <p className="text-gray-500">No notifications</p>
                            </CardContent>
                        </Card>
                    ) : (
                        categorizedNotifications.all.map(notification => (
                            <NotificationCard key={notification.id} notification={notification} />
                        ))
                    )}
                </TabsContent>

                <TabsContent value="unread" className="space-y-3 mt-4">
                    {categorizedNotifications.unread.length === 0 ? (
                        <Card>
                            <CardContent className="p-8 text-center">
                                <CheckCircle className="w-12 h-12 mx-auto mb-3 text-green-400" />
                                <p className="text-gray-500">All caught up!</p>
                                <p className="text-sm text-gray-400">No unread notifications</p>
                            </CardContent>
                        </Card>
                    ) : (
                        categorizedNotifications.unread.map(notification => (
                            <NotificationCard key={notification.id} notification={notification} />
                        ))
                    )}
                </TabsContent>

                <TabsContent value="actionRequired" className="space-y-3 mt-4">
                    {categorizedNotifications.actionRequired.length === 0 ? (
                        <Card>
                            <CardContent className="p-8 text-center">
                                <CheckCircle className="w-12 h-12 mx-auto mb-3 text-green-400" />
                                <p className="text-gray-500">Nothing needs your attention</p>
                                <p className="text-sm text-gray-400">All action items completed</p>
                            </CardContent>
                        </Card>
                    ) : (
                        categorizedNotifications.actionRequired.map(notification => (
                            <NotificationCard key={notification.id} notification={notification} />
                        ))
                    )}
                </TabsContent>

                <TabsContent value="settings" className="mt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Notification Preferences</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div>
                                <h3 className="font-medium mb-3">Notification Types</h3>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="followUp">Follow-up Reminders</Label>
                                        <Switch
                                            id="followUp"
                                            checked={settings.followUpReminders}
                                            onCheckedChange={checked =>
                                                setSettings(prev => ({ ...prev, followUpReminders: checked }))
                                            }
                                        />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="milestones">Milestone Updates</Label>
                                        <Switch
                                            id="milestones"
                                            checked={settings.milestoneUpdates}
                                            onCheckedChange={checked =>
                                                setSettings(prev => ({ ...prev, milestoneUpdates: checked }))
                                            }
                                        />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="stagnant">Stagnant Guest Alerts</Label>
                                        <Switch
                                            id="stagnant"
                                            checked={settings.stagnantGuestAlerts}
                                            onCheckedChange={checked =>
                                                setSettings(prev => ({ ...prev, stagnantGuestAlerts: checked }))
                                            }
                                        />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="assignments">New Assignments</Label>
                                        <Switch
                                            id="assignments"
                                            checked={settings.newAssignments}
                                            onCheckedChange={checked =>
                                                setSettings(prev => ({ ...prev, newAssignments: checked }))
                                            }
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="font-medium mb-3">Delivery Methods</h3>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="email">Email Notifications</Label>
                                        <Switch
                                            id="email"
                                            checked={settings.emailNotifications}
                                            onCheckedChange={checked =>
                                                setSettings(prev => ({ ...prev, emailNotifications: checked }))
                                            }
                                        />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="push">Push Notifications</Label>
                                        <Switch
                                            id="push"
                                            checked={settings.pushNotifications}
                                            onCheckedChange={checked =>
                                                setSettings(prev => ({ ...prev, pushNotifications: checked }))
                                            }
                                        />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="sms">SMS Notifications</Label>
                                        <Switch
                                            id="sms"
                                            checked={settings.smsNotifications}
                                            onCheckedChange={checked =>
                                                setSettings(prev => ({ ...prev, smsNotifications: checked }))
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
