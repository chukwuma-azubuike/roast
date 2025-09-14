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
import { PipelineStage } from '../store/types';
import {
    useGetPipelineStagesQuery,
    useGetNotificationRulesQuery,
    useUpdatePipelineStageMutation,
    useCreatePipelineStageMutation,
    useDeletePipelineStageMutation,
    useUpdateNotificationRuleMutation,
} from '../store/api';

export default function PipelineSettings() {
    const { data: stages = [], isLoading: isLoadingStages } = useGetPipelineStagesQuery();
    const { data: notificationRules = [], isLoading: isLoadingRules } = useGetNotificationRulesQuery();
    const [updatePipelineStage] = useUpdatePipelineStageMutation();
    const [createPipelineStage] = useCreatePipelineStageMutation();
    const [deletePipelineStage] = useDeletePipelineStageMutation();
    const [updateNotificationRule] = useUpdateNotificationRuleMutation();
    const [editingStage, setEditingStage] = useState<string | null>(null);
    const [newStageName, setNewStageName] = useState('');
    const [isAddingStage, setIsAddingStage] = useState(false);

    const handleAddStage = async () => {
        if (!newStageName.trim()) {
            toast.error('Stage name is required');
            return;
        }

        try {
            await createPipelineStage({
                name: newStageName,
                description: '',
                order: stages.length + 1,
                color: '#6366F1',
                isDefault: false,
                milestones: [],
            }).unwrap();

            setNewStageName('');
            setIsAddingStage(false);
            toast.success('Stage added successfully');
        } catch (error) {
            toast.error('Failed to add stage');
        }
    };

    const handleDeleteStage = async (stageId: string) => {
        const stage = stages.find(s => s.id === stageId);
        if (stage?.isDefault) {
            toast.error('Cannot delete default stages');
            return;
        }

        try {
            await deletePipelineStage(stageId).unwrap();
            toast.success('Stage deleted successfully');
        } catch (error) {
            toast.error('Failed to delete stage');
        }
    };

    const handleUpdateStageName = async (stageId: string, newName: string) => {
        try {
            await updatePipelineStage({ id: stageId, name: newName }).unwrap();
            setEditingStage(null);
            toast.success('Stage updated successfully');
        } catch (error) {
            toast.error('Failed to update stage');
        }
    };

    const handleAddMilestone = async (stageId: string) => {
        const stage = stages.find(s => s.id === stageId);
        if (!stage) return;

        const newMilestone = {
            id: `milestone_${Date.now()}`,
            title: 'New Milestone',
            description: '',
            required: false,
            order: stage.milestones.length || 0,
        };

        try {
            await updatePipelineStage({
                id: stageId,
                milestones: [...stage.milestones, newMilestone],
            }).unwrap();
            toast.success('Milestone added');
        } catch (error) {
            toast.error('Failed to add milestone');
        }
    };

    const handleDeleteMilestone = async (stageId: string, milestoneId: string) => {
        const stage = stages.find(s => s.id === stageId);
        if (!stage) return;

        try {
            await updatePipelineStage({
                id: stageId,
                milestones: stage.milestones.filter(m => m.id !== milestoneId),
            }).unwrap();
            toast.success('Milestone deleted');
        } catch (error) {
            toast.error('Failed to delete milestone');
        }
    };

    const handleToggleNotificationRule = async (ruleId: string) => {
        const rule = notificationRules.find(r => r.id === ruleId);
        if (!rule) return;

        try {
            await updateNotificationRule({ id: ruleId, isActive: !rule.isActive }).unwrap();
            toast.success('Notification rule updated');
        } catch (error) {
            toast.error('Failed to update notification rule');
        }
    };

    const StageEditor = ({
        stage,
        editingStage,
        setEditingStage,
        handleUpdateStageName,
        handleAddMilestone,
        handleDeleteMilestone,
        handleDeleteStage,
    }: {
        stage: PipelineStage;
        editingStage: string | null;
        setEditingStage: (id: string | null) => void;
        handleUpdateStageName: (id: string, name: string) => void;
        handleAddMilestone: (id: string) => void;
        handleDeleteMilestone: (stageId: string, milestoneId: string) => void;
        handleDeleteStage: (id: string) => void;
    }) => {
        const [updatePipelineStage] = useUpdatePipelineStageMutation();
        const [localName, setLocalName] = useState(stage.name);

        return (
            <Card key={stage.id} className="mb-4">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: stage.color }} />
                            {editingStage === stage.id ? (
                                <div className="flex items-center space-x-2">
                                    <Input
                                        value={localName}
                                        onChange={e => setLocalName(e.target.value)}
                                        className="w-40"
                                    />
                                    <Button size="sm" onClick={() => handleUpdateStageName(stage.id, localName)}>
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
                                                Are you sure you want to delete this stage? This action cannot be
                                                undone.
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
                                    updatePipelineStage({
                                        id: stage.id,
                                        description: e.target.value,
                                    })
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
                                                    updatePipelineStage({
                                                        id: stage.id,
                                                        milestones: stage.milestones.map(m =>
                                                            m.id === milestone.id ? { ...m, title: e.target.value } : m
                                                        ),
                                                    })
                                                }
                                                className="mb-1"
                                            />
                                            <div className="flex items-center space-x-2">
                                                <Switch
                                                    checked={milestone.required}
                                                    onCheckedChange={checked =>
                                                        updatePipelineStage({
                                                            id: stage.id,
                                                            milestones: stage.milestones.map(m =>
                                                                m.id === milestone.id ? { ...m, required: checked } : m
                                                            ),
                                                        })
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
    };

    // Loading State
    if (isLoadingStages || isLoadingRules) {
        return (
            <div className="p-4 flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
            </div>
        );
    }

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
                                {stages.map(stage => (
                                    <StageEditor
                                        key={stage.id}
                                        stage={stage}
                                        editingStage={editingStage}
                                        setEditingStage={setEditingStage}
                                        handleUpdateStageName={handleUpdateStageName}
                                        handleAddMilestone={handleAddMilestone}
                                        handleDeleteMilestone={handleDeleteMilestone}
                                        handleDeleteStage={handleDeleteStage}
                                    />
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
