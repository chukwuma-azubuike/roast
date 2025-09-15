import React, { useState } from 'react';
import {
    ArrowLeft,
    Phone,
    MessageCircle,
    MapPin,
    Calendar,
    CheckCircle,
    Plus,
    Clock,
    MessageSquare,
    Save,
    X,
} from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Textarea } from '../ui/textarea';
import { Progress } from '../ui/progress';
import { Checkbox } from '../ui/checkbox';
import { toast } from 'sonner';
import { Guest, MilestoneStatus, ContactChannel } from '../../store/types';
import { formatTimeAgo } from '../../lib/utils';
import {
    useAddEngagementMutation,
    useGetEngagementsForGuestQuery,
    useGetGuestByIdQuery,
    useUpdateGuestMutation,
} from '../../store/api';

interface GuestProfileProps {
    guestId: string | null;
    onBack: () => void;
}

export function GuestProfile({ guestId, onBack }: GuestProfileProps) {
    const [newNote, setNewNote] = useState('');
    const [isAddingNote, setIsAddingNote] = useState(false);

    // RTK Query hooks
    const { data: guest, isLoading: isLoadingGuest } = useGetGuestByIdQuery(guestId!, { skip: !guestId });
    const { data: engagements = [] } = useGetEngagementsForGuestQuery(guestId!, { skip: !guestId });
    const [updateGuest] = useUpdateGuestMutation();
    const [addEngagement] = useAddEngagementMutation();

    if (!guestId || isLoadingGuest) {
        return (
            <div className="p-4 text-center">
                <p>{!guestId ? 'Guest not found' : 'Loading...'}</p>
                <Button onClick={onBack} className="mt-4">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                </Button>
            </div>
        );
    }

    const getStageColor = (stage: Guest['assimilationStage']) => {
        switch (stage) {
            case 'invited':
                return 'bg-blue-100 text-blue-800';
            case 'attended':
                return 'bg-green-100 text-green-800';
            case 'discipled':
                return 'bg-purple-100 text-purple-800';
            case 'joined':
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getProgressPercentage = () => {
        if (!guest) return 0;
        const completed = guest.milestones.filter(m => m.status === MilestoneStatus.COMPLETED).length;
        return Math.round((completed / guest.milestones.length) * 100);
    };

    const handleMilestoneToggle = async (milestoneId: string) => {
        if (!guest) return;

        const updatedMilestones = guest.milestones.map(m =>
            m._id === milestoneId
                ? {
                      ...m,
                      status:
                          m.status === MilestoneStatus.COMPLETED ? MilestoneStatus.PENDING : MilestoneStatus.COMPLETED,
                      completedAt: m.status === MilestoneStatus.COMPLETED ? undefined : new Date().toISOString(),
                  }
                : m
        );

        try {
            await updateGuest({
                _id: guest._id,
                milestones: updatedMilestones,
                lastContact: new Date().toISOString(),
            }).unwrap();
            toast.success('Milestone updated');
        } catch (error) {
            toast.error('Failed to update milestone');
        }
    };

    const handleAddNote = async () => {
        if (!guest || !newNote.trim()) return;

        try {
            await addEngagement({
                guestId: guest._id,
                workerId: guest.assignedToId!,
                type: ContactChannel.CALL,
                notes: newNote,
            }).unwrap();

            setNewNote('');
            setIsAddingNote(false);
            toast.success('Note added');
        } catch (error) {
            toast.error('Failed to add note');
        }
    };

    const getTimelineIcon = (type: string) => {
        switch (type) {
            case ContactChannel.CALL:
                return <Phone className="w-4 h-4" />;
            case ContactChannel.WHATSAPP:
                return <MessageCircle className="w-4 h-4" />;
            case ContactChannel.VISIT:
                return <MapPin className="w-4 h-4" />;
            default:
                return <MessageSquare className="w-4 h-4" />;
        }
    };

    if (!guest) return null;

    return (
        <div className="p-4 max-w-2xl mx-auto">
            {/* Header */}
            <div className="flex items-center mb-6">
                <Button variant="ghost" size="sm" onClick={onBack}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                </Button>
            </div>

            {/* Guest Info Card */}
            <Card className="mb-6">
                <CardContent className="p-6">
                    <div className="flex items-start space-x-4 mb-4">
                        <Avatar className="w-16 h-16">
                            <AvatarFallback className="text-lg">
                                {guest.name.split(' ')[0]}
                                {guest.name.split(' ')[1]}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                            <h1 className="text-2xl font-bold mb-2">{`${guest.name || ''}`}</h1>
                            <div className="flex items-center space-x-2 mb-2">
                                <Badge variant="secondary" className={getStageColor(guest.assimilationStage)}>
                                    {guest.assimilationStage.charAt(0).toUpperCase() + guest.assimilationStage.slice(1)}
                                </Badge>
                                <span className="text-sm text-gray-500">{getProgressPercentage()}% complete</span>
                            </div>
                            <Progress value={getProgressPercentage()} className="mb-3" />
                        </div>
                    </div>

                    {/* Contact Actions */}
                    <div className="flex space-x-2 mb-4">
                        <Button className="flex-1" onClick={() => window.open(`tel:${guest.phone}`, '_self')}>
                            <Phone className="w-4 h-4 mr-2" />
                            Call
                        </Button>
                        <Button
                            variant="outline"
                            className="flex-1"
                            onClick={() => window.open(`https://wa.me/${guest.phone.replace(/\D/g, '')}`, '_blank')}
                        >
                            <MessageCircle className="w-4 h-4 mr-2" />
                            WhatsApp
                        </Button>
                    </div>

                    {/* Contact Details */}
                    <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                            <Phone className="w-4 h-4 text-gray-500" />
                            <span>{guest.phone}</span>
                        </div>
                        {guest.address && (
                            <div className="flex items-start space-x-2">
                                <MapPin className="w-4 h-4 text-gray-500 mt-0.5" />
                                <span className="text-sm">{guest.address}</span>
                            </div>
                        )}
                        <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4 text-gray-500" />
                            <span className="text-sm">Added {new Date(guest.createdAt).toLocaleDateString()}</span>
                        </div>
                    </div>

                    {/* Prayer Request */}
                    {guest.prayerRequest && (
                        <div className="mt-4 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                            <h4 className="font-medium text-blue-900 mb-1">Prayer Request</h4>
                            <p className="text-sm text-blue-800">{guest.prayerRequest}</p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Milestones */}
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                        <CheckCircle className="w-5 h-5" />
                        <span>Assimilation Milestones</span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {guest.milestones.map((milestone, index) => (
                            <div key={milestone._id} className="flex items-center space-x-3">
                                <Checkbox
                                    checked={milestone.status === MilestoneStatus.COMPLETED}
                                    onCheckedChange={() => handleMilestoneToggle(milestone._id)}
                                />
                                <div className="flex-1">
                                    <span
                                        className={
                                            milestone.status === MilestoneStatus.COMPLETED
                                                ? 'line-through text-gray-500'
                                                : ''
                                        }
                                    >
                                        {milestone.title}
                                    </span>
                                    {milestone.status === MilestoneStatus.COMPLETED && milestone.completedAt && (
                                        <span className="text-xs text-gray-500 ml-2">
                                            ✓ {new Date(milestone.completedAt).toLocaleDateString()}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Timeline */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center space-x-2">
                            <Clock className="w-5 h-5" />
                            <span>Engagement Timeline</span>
                        </CardTitle>
                        <Button size="sm" onClick={() => setIsAddingNote(true)} disabled={isAddingNote}>
                            <Plus className="w-4 h-4 mr-1" />
                            Add Note
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {/* Add Note Form */}
                    {isAddingNote && (
                        <div className="mb-4 p-4 border rounded-lg bg-gray-50">
                            <Textarea
                                placeholder="Add a note about your interaction..."
                                value={newNote}
                                onChange={e => setNewNote(e.target.value)}
                                rows={3}
                                className="mb-3"
                            />
                            <div className="flex space-x-2">
                                <Button size="sm" onClick={handleAddNote}>
                                    <Save className="w-4 h-4 mr-1" />
                                    Save
                                </Button>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                        setIsAddingNote(false);
                                        setNewNote('');
                                    }}
                                >
                                    <X className="w-4 h-4 mr-1" />
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Timeline Items */}
                    <div className="space-y-4">
                        {engagements.map((item, index) => (
                            <div key={item._id} className="flex space-x-3">
                                <div className="flex flex-col items-center">
                                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                                        {getTimelineIcon(item.type)}
                                    </div>
                                    {index < engagements.length - 1 && <div className="w-px bg-gray-200 h-8 mt-2" />}
                                </div>
                                <div className="flex-1 pb-4">
                                    <div className="flex items-center justify-between mb-1">
                                        <Badge variant="outline" className="capitalize">
                                            {item.type.toLowerCase()}
                                        </Badge>
                                        <span className="text-xs text-gray-500">
                                            {formatTimeAgo(new Date(item.timestamp))}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-700">{item.notes}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {engagements.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                            <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
                            <p>No interactions recorded yet</p>
                            <p className="text-sm">Add your first note to start tracking engagement</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
