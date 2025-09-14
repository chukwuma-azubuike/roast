import React, { useState } from 'react';
import { Settings, Plus, Edit3, Trash2, Save, X, Check } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from './ui/alert-dialog';
import { toast } from 'sonner';
import { User } from '../store/types';

interface PipelineSettingsProps {
    currentUser: User;
}

interface PipelineStage {
    id: string;
    name: string;
    description: string;
    order: number;
    color: string;
    isDefault: boolean;
    milestones: {
        id: string;
        title: string;
        description: string;
        required: boolean;
        order: number;
    }[];
}

interface NotificationRule {
    id: string;
    name: string;
    description: string;
    triggerEvent: 'stagnant_guest' | 'milestone_completed' | 'stage_transition' | 'new_assignment';
    conditions: {
        daysSinceContact?: number;
        stage?: string;
        priority?: 'low' | 'medium' | 'high';
    };
    recipients: ('worker' | 'coordinator' | 'admin')[];
    isActive: boolean;
}

// Mock pipeline stages data
const mockPipelineStages: PipelineStage[] = [
    {
        id: 'invited',
        name: 'Invited',
        description: 'Guest has been invited to church but has not yet attended',
        order: 1,
        color: '#3B82F6',
        isDefault: true,
        milestones: [
            {
                id: 'm1',
                title: 'Initial Contact',
                description: 'First interaction with guest',
                required: true,
                order: 1,
            },
            { id: 'm2', title: 'Phone Call', description: 'Follow-up phone call made', required: true, order: 2 },
            {
                id: 'm3',
                title: 'Service Invitation',
                description: 'Guest invited to attend service',
                required: true,
                order: 3,
            },
        ],
    },
    {
        id: 'attended',
        name: 'Attended',
        description: 'Guest has attended at least one church service',
        order: 2,
        color: '#10B981',
        isDefault: true,
        milestones: [
            {
                id: 'm4',
                title: 'First Visit',
                description: 'Guest attended their first service',
                required: true,
                order: 1,
            },
            { id: 'm5', title: 'Welcome Meeting', description: 'Met with welcome team', required: false, order: 2 },
            {
                id: 'm6',
                title: 'Small Group Invitation',
                description: 'Invited to join small group',
                required: true,
                order: 3,
            },
        ],
    },
    {
        id: 'discipled',
        name: 'Discipled',
        description: 'Guest is actively participating in discipleship activities',
        order: 3,
        color: '#8B5CF6',
        isDefault: true,
        milestones: [
            {
                id: 'm7',
                title: 'Small Group Attendance',
                description: 'Regularly attending small group',
                required: true,
                order: 1,
            },
            {
                id: 'm8',
                title: 'Bible Study Started',
                description: 'Enrolled in Bible study program',
                required: true,
                order: 2,
            },
            { id: 'm9', title: 'Baptism Preparation', description: 'Preparing for baptism', required: false, order: 3 },
        ],
    },
    {
        id: 'joined',
        name: 'Joined Workforce',
        description: 'Guest has become an active member and joined ministry',
        order: 4,
        color: '#6B7280',
        isDefault: true,
        milestones: [
            {
                id: 'm10',
                title: 'Baptism Completed',
                description: 'Guest has been baptized',
                required: false,
                order: 1,
            },
            {
                id: 'm11',
                title: 'Ministry Assignment',
                description: 'Assigned to a ministry team',
                required: true,
                order: 2,
            },
            {
                id: 'm12',
                title: 'Leadership Training',
                description: 'Completed leadership training',
                required: false,
                order: 3,
            },
        ],
    },
];

// Mock data for notification rules
const mockNotificationRules: NotificationRule[] = [
    {
        id: 'n1',
        name: 'Stagnant Guest Alert',
        description: "Alert coordinator when a guest hasn't been contacted in 7 days",
        triggerEvent: 'stagnant_guest',
        conditions: { daysSinceContact: 7 },
        recipients: ['coordinator'],
        isActive: true,
    },
    {
        id: 'n2',
        name: 'Milestone Celebration',
        description: 'Notify team when important milestones are completed',
        triggerEvent: 'milestone_completed',
        conditions: { priority: 'high' },
        recipients: ['worker', 'coordinator'],
        isActive: true,
    },
    {
        id: 'n3',
        name: 'Stage Transition Alert',
        description: 'Alert admin when guests move to final stage',
        triggerEvent: 'stage_transition',
        conditions: { stage: 'joined' },
        recipients: ['admin'],
        isActive: true,
    },
];

export function PipelineSettings({ currentUser }: PipelineSettingsProps) {
    const [stages, setStages] = useState<PipelineStage[]>(mockPipelineStages);
    const [notificationRules, setNotificationRules] = useState<NotificationRule[]>(mockNotificationRules);
    const [editingStage, setEditingStage] = useState<string | null>(null);
    const [newStageName, setNewStageName] = useState('');
    const [isAddingStage, setIsAddingStage] = useState(false);

    const handleAddStage = () => {
        if (!newStageName.trim()) {
            toast.error('Stage name is required');
            return;
        }

        const newStage: PipelineStage = {
            id: `stage_${Date.now()}`,
            name: newStageName,
            description: '',
            order: stages.length + 1,
            color: '#6366F1',
            isDefault: false,
            milestones: [],
        };

        setStages([...stages, newStage]);
        setNewStageName('');
        setIsAddingStage(false);
        toast.success('Stage added successfully');
    };

    const handleDeleteStage = (stageId: string) => {
        const stage = stages.find(s => s.id === stageId);
        if (stage?.isDefault) {
            toast.error('Cannot delete default stages');
            return;
        }

        setStages(stages.filter(s => s.id !== stageId));
        toast.success('Stage deleted successfully');
    };

    const handleUpdateStageName = (stageId: string, newName: string) => {
        setStages(stages.map(stage => (stage.id === stageId ? { ...stage, name: newName } : stage)));
        setEditingStage(null);
        toast.success('Stage updated successfully');
    };

    const handleAddMilestone = (stageId: string) => {
        const newMilestone = {
            id: `milestone_${Date.now()}`,
            title: 'New Milestone',
            description: '',
            required: false,
            order: stages.find(s => s.id === stageId)?.milestones.length || 0,
        };

        setStages(
            stages.map(stage =>
                stage.id === stageId ? { ...stage, milestones: [...stage.milestones, newMilestone] } : stage
            )
        );
        toast.success('Milestone added');
    };

    const handleDeleteMilestone = (stageId: string, milestoneId: string) => {
        setStages(
            stages.map(stage =>
                stage.id === stageId
                    ? { ...stage, milestones: stage.milestones.filter(m => m.id !== milestoneId) }
                    : stage
            )
        );
        toast.success('Milestone deleted');
    };

    const handleToggleNotificationRule = (ruleId: string) => {
        setNotificationRules(rules =>
            rules.map(rule => (rule.id === ruleId ? { ...rule, isActive: !rule.isActive } : rule))
        );
        toast.success('Notification rule updated');
    };

    const StageEditor = ({ stage }: { stage: PipelineStage }) => (
        <Card key={stage.id} className="mb-4">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: stage.color }} />
                        {editingStage === stage.id ? (
                            <div className="flex items-center space-x-2">
                                <Input
                                    value={stage.name}
                                    onChange={e =>
                                        setStages(
                                            stages.map(s => (s.id === stage.id ? { ...s, name: e.target.value } : s))
                                        )
                                    }
                                    className="w-40"
                                />
                                <Button size="sm" onClick={() => handleUpdateStageName(stage.id, stage.name)}>
                                    <Check className="w-4 h-4" />
                                </Button>
                                <Button size="sm" variant="outline" onClick={() => setEditingStage(null)}>
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-2">
                                <CardTitle>{stage.name}</CardTitle>
                                {stage.isDefault && <Badge variant="secondary">Default</Badge>}
                            </div>
                        )}
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingStage(stage.id)}
                            disabled={editingStage === stage.id}
                        >
                            <Edit3 className="w-4 h-4" />
                        </Button>
                        {!stage.isDefault && (
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button size="sm" variant="outline">
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Delete Stage</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Are you sure you want to delete this stage? This action cannot be undone.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => handleDeleteStage(stage.id)}>
                                            Delete
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        )}
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div>
                        <Label>Description</Label>
                        <Textarea
                            value={stage.description}
                            onChange={e =>
                                setStages(
                                    stages.map(s => (s.id === stage.id ? { ...s, description: e.target.value } : s))
                                )
                            }
                            placeholder="Stage description..."
                            rows={2}
                        />
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <Label>Milestones</Label>
                            <Button size="sm" variant="outline" onClick={() => handleAddMilestone(stage.id)}>
                                <Plus className="w-4 h-4 mr-1" />
                                Add Milestone
                            </Button>
                        </div>
                        <div className="space-y-2">
                            {stage.milestones.map(milestone => (
                                <div
                                    key={milestone.id}
                                    className="flex items-center justify-between p-2 border rounded"
                                >
                                    <div className="flex-1">
                                        <Input
                                            value={milestone.title}
                                            onChange={e =>
                                                setStages(
                                                    stages.map(s =>
                                                        s.id === stage.id
                                                            ? {
                                                                  ...s,
                                                                  milestones: s.milestones.map(m =>
                                                                      m.id === milestone.id
                                                                          ? { ...m, title: e.target.value }
                                                                          : m
                                                                  ),
                                                              }
                                                            : s
                                                    )
                                                )
                                            }
                                            className="mb-1"
                                        />
                                        <div className="flex items-center space-x-2">
                                            <Switch
                                                checked={milestone.required}
                                                onCheckedChange={checked =>
                                                    setStages(
                                                        stages.map(s =>
                                                            s.id === stage.id
                                                                ? {
                                                                      ...s,
                                                                      milestones: s.milestones.map(m =>
                                                                          m.id === milestone.id
                                                                              ? { ...m, required: checked }
                                                                              : m
                                                                      ),
                                                                  }
                                                                : s
                                                        )
                                                    )
                                                }
                                            />
                                            <Label className="text-sm">Required</Label>
                                        </div>
                                    </div>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handleDeleteMilestone(stage.id, milestone.id)}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );

    return (
        <div className="p-4 max-w-4xl mx-auto">
            <div className="flex items-center space-x-3 mb-6">
                <Settings className="w-6 h-6" />
                <h1 className="text-2xl font-bold">Pipeline Settings</h1>
            </div>

            <Tabs defaultValue="stages" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="stages">Pipeline Stages</TabsTrigger>
                    <TabsTrigger value="milestones">Milestone Templates</TabsTrigger>
                    <TabsTrigger value="notifications">Notification Rules</TabsTrigger>
                </TabsList>

                <TabsContent value="stages" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Assimilation Pipeline Stages</CardTitle>
                            <p className="text-sm text-gray-600">
                                Define the stages guests go through in their journey to joining the workforce.
                            </p>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {stages
                                    .sort((a, b) => a.order - b.order)
                                    .map(stage => (
                                        <StageEditor key={stage.id} stage={stage} />
                                    ))}

                                {isAddingStage ? (
                                    <Card className="border-dashed">
                                        <CardContent className="p-4">
                                            <div className="flex items-center space-x-2">
                                                <Input
                                                    placeholder="Stage name"
                                                    value={newStageName}
                                                    onChange={e => setNewStageName(e.target.value)}
                                                    className="flex-1"
                                                />
                                                <Button onClick={handleAddStage}>
                                                    <Save className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    onClick={() => {
                                                        setIsAddingStage(false);
                                                        setNewStageName('');
                                                    }}
                                                >
                                                    <X className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ) : (
                                    <Button
                                        variant="outline"
                                        className="w-full border-dashed"
                                        onClick={() => setIsAddingStage(true)}
                                    >
                                        <Plus className="w-4 h-4 mr-2" />
                                        Add New Stage
                                    </Button>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="milestones">
                    <Card>
                        <CardHeader>
                            <CardTitle>Milestone Templates</CardTitle>
                            <p className="text-sm text-gray-600">
                                Configure milestone templates that can be used across different stages.
                            </p>
                        </CardHeader>
                        <CardContent>
                            <div className="text-center py-8 text-gray-500">
                                <Settings className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                <p>Milestone template management coming soon</p>
                                <p className="text-sm">Create reusable milestone templates for consistent tracking</p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="notifications" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Notification Rules</CardTitle>
                            <p className="text-sm text-gray-600">
                                Configure when and how notifications are sent to workers, coordinators, and admins.
                            </p>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {notificationRules.map(rule => (
                                    <div key={rule.id} className="p-4 border rounded-lg">
                                        <div className="flex items-start justify-between mb-2">
                                            <div className="flex-1">
                                                <div className="flex items-center space-x-2 mb-1">
                                                    <h3 className="font-medium">{rule.name}</h3>
                                                    <Badge variant={rule.isActive ? 'default' : 'secondary'}>
                                                        {rule.isActive ? 'Active' : 'Inactive'}
                                                    </Badge>
                                                </div>
                                                <p className="text-sm text-gray-600 mb-2">{rule.description}</p>
                                                <div className="flex items-center space-x-4 text-xs text-gray-500">
                                                    <span>Recipients: {rule.recipients.join(', ')}</span>
                                                    <span>Trigger: {rule.triggerEvent.replace('_', ' ')}</span>
                                                </div>
                                            </div>
                                            <Switch
                                                checked={rule.isActive}
                                                onCheckedChange={() => handleToggleNotificationRule(rule.id)}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
