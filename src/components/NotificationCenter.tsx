import React, { useState } from 'react';
import { Bell, Clock, Phone, User as UserIcon, CheckCircle, X, AlertTriangle, Info, MessageSquare } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { toast } from 'sonner';
import { User, Role, NotificationProps, NotificationType, NotificationPriority } from '../store/types';

interface NotificationSettings {
    followUpReminders: boolean;
    milestoneUpdates: boolean;
    stagnantGuestAlerts: boolean;
    newAssignments: boolean;
    weeklyReports: boolean;
    welcomeMessages: boolean;
    emailNotifications: boolean;
    pushNotifications: boolean;
    smsNotifications: boolean;
}
import { useGetNotificationsQuery, useMarkNotificationAsReadMutation } from '../store/api';

interface NotificationCenterProps {
    currentUser: User;
}

// Notification settings
const defaultNotificationSettings: NotificationSettings = {
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
    const [settings, setSettings] = useState(defaultNotificationSettings);
    const [activeTab, setActiveTab] = useState('all');
    const { data: notifications = [], isLoading, error } = useGetNotificationsQuery();
    const [markNotificationRead] = useMarkNotificationAsReadMutation();

    // Filter notifications based on user role
    const userNotifications =
        notifications?.filter(notification => {
            if (currentUser.role === Role.WORKER) {
                return [
                    NotificationType.FOLLOW_UP,
                    NotificationType.MILESTONE,
                    NotificationType.ASSIGNMENT,
                    NotificationType.REMINDER,
                    NotificationType.WELCOME,
                ].includes(notification.type);
            } else if (currentUser.role === Role.ZONAL_COORDINATOR) {
                return [
                    NotificationType.STAGNANT,
                    NotificationType.MILESTONE,
                    NotificationType.ASSIGNMENT,
                    NotificationType.REMINDER,
                ].includes(notification.type);
            }
            return true; // Admin/Pastor see all
        }) ?? [];

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

    const getNotificationIcon = (type: NotificationType) => {
        switch (type) {
            case NotificationType.FOLLOW_UP:
                return <Phone className="w-5 h-5" />;
            case NotificationType.STAGNANT:
                return <AlertTriangle className="w-5 h-5" />;
            case NotificationType.MILESTONE:
                return <CheckCircle className="w-5 h-5" />;
            case NotificationType.WELCOME:
                return <MessageSquare className="w-5 h-5" />;
            case NotificationType.REMINDER:
                return <Clock className="w-5 h-5" />;
            case NotificationType.ASSIGNMENT:
                return <UserIcon className="w-5 h-5" />;
            default:
                return <Info className="w-5 h-5" />;
        }
    };

    const getNotificationColor = (type: NotificationType, priority: NotificationPriority) => {
        if (priority === NotificationPriority.HIGH) return 'bg-red-100 text-red-600 border-red-200';
        if (priority === NotificationPriority.MEDIUM) return 'bg-yellow-100 text-yellow-600 border-yellow-200';

        switch (type) {
            case NotificationType.FOLLOW_UP:
                return 'bg-blue-100 text-blue-600 border-blue-200';
            case NotificationType.STAGNANT:
                return 'bg-red-100 text-red-600 border-red-200';
            case NotificationType.MILESTONE:
                return 'bg-green-100 text-green-600 border-green-200';
            case NotificationType.WELCOME:
                return 'bg-purple-100 text-purple-600 border-purple-200';
            case NotificationType.REMINDER:
                return 'bg-orange-100 text-orange-600 border-orange-200';
            case NotificationType.ASSIGNMENT:
                return 'bg-indigo-100 text-indigo-600 border-indigo-200';
            default:
                return 'bg-gray-100 text-gray-600 border-gray-200';
        }
    };

    const markAsRead = async (notificationId: string) => {
        try {
            await markNotificationRead(notificationId).unwrap();
            toast.success('Notification marked as read');
        } catch (error) {
            toast.error('Failed to mark notification as read');
        }
    };

    const dismissNotification = async (notificationId: string) => {
        try {
            // We should have a dismiss mutation, but for now we'll mark as read
            await markNotificationRead(notificationId).unwrap();
            toast.success('Notification dismissed');
        } catch (error) {
            toast.error('Failed to dismiss notification');
        }
    };

    const markAllAsRead = async () => {
        try {
            await Promise.all(userNotifications.filter(n => !n.isRead).map(n => markNotificationRead(n._id).unwrap()));
            toast.success('All notifications marked as read');
        } catch (error) {
            toast.error('Failed to mark all as read');
        }
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

    const NotificationCard = ({ notification }: { notification: NotificationProps }) => {
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
                                    {notification.priority === NotificationPriority.HIGH && (
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
                                        onClick={() => dismissNotification(notification._id)}
                                    >
                                        <X className="w-3 h-3" />
                                    </Button>
                                </div>
                            </div>

                            <p className="text-sm text-gray-600 mb-2">{notification.message}</p>

                            <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-500">
                                    {formatTime(new Date(notification.createdAt))}
                                </span>

                                {notification.actionRequired && (
                                    <div className="flex space-x-2">
                                        {notification.type === NotificationType.FOLLOW_UP && notification.guestId && (
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
                                        {notification.type === NotificationType.ASSIGNMENT && (
                                            <Button size="sm" variant="outline" className="h-7 text-xs">
                                                Accept
                                            </Button>
                                        )}
                                        {notification.type === NotificationType.REMINDER && (
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
                                onClick={() => markAsRead(notification._id)}
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

    if (isLoading) {
        return (
            <div className="p-4 max-w-4xl mx-auto">
                <div className="animate-pulse space-y-4">
                    {[...Array(3)].map((_, i) => (
                        <Card key={i}>
                            <CardContent className="p-4">
                                <div className="flex items-start space-x-3">
                                    <div className="w-10 h-10 rounded-lg bg-gray-200" />
                                    <div className="flex-1">
                                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                                        <div className="h-3 bg-gray-200 rounded w-1/2" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        );
    }

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
                            <NotificationCard key={notification._id} notification={notification} />
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
                            <NotificationCard key={notification._id} notification={notification} />
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
                            <NotificationCard key={notification._id} notification={notification} />
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
