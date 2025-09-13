import React, { useState } from 'react';
import {
    ArrowLeft,
    Phone,
    MessageCircle,
    MapPin,
    Calendar,
    CheckCircle,
    Circle,
    Plus,
    Clock,
    User,
    MessageSquare,
    Edit3,
    Save,
    X,
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { Progress } from './ui/progress';
import { Checkbox } from './ui/checkbox';
import { toast } from 'sonner@2.0.3';
import type { Guest } from '../App';

interface GuestProfileProps {
    guestId: string | null;
    onBack: () => void;
}

// Mock guest data - in real app this would be fetched by ID
const mockGuest: Guest = {
    id: 'guest1',
    name: 'Sarah Johnson',
    phone: '+1 (555) 123-4567',
    zone: 'zone1',
    assignedWorker: 'user1',
    stage: 'invited',
    createdAt: new Date('2024-12-10'),
    lastContact: new Date('2024-12-10'),
    nextAction: 'Follow-up call tomorrow',
    address: '123 Main St, Anytown, State 12345',
    prayerRequest: 'Pray for her mother who is recovering from surgery. Also seeking guidance about career change.',
    milestones: [
        { id: 'm1', title: 'Initial Contact', completed: true, completedAt: new Date('2024-12-10') },
        { id: 'm2', title: 'First Phone Call', completed: false },
        { id: 'm3', title: 'Service Invitation', completed: false },
        { id: 'm4', title: 'First Visit', completed: false },
        { id: 'm5', title: 'Small Group Invitation', completed: false },
        { id: 'm6', title: 'Bible Study Started', completed: false },
        { id: 'm7', title: 'Baptism Preparation', completed: false },
        { id: 'm8', title: 'Join Ministry Team', completed: false },
    ],
    timeline: [
        {
            id: 't1',
            type: 'note',
            description:
                'Met during street evangelism. Interested in learning more about faith. Very friendly and open to conversation.',
            createdAt: new Date('2024-12-10T14:30:00'),
            createdBy: 'user1',
        },
        {
            id: 't2',
            type: 'call',
            description: 'Initial contact call. Confirmed interest in attending Sunday service.',
            createdAt: new Date('2024-12-10T16:45:00'),
            createdBy: 'user1',
        },
    ],
};

export function GuestProfile({ guestId, onBack }: GuestProfileProps) {
    const [guest, setGuest] = useState<Guest>(mockGuest);
    const [newNote, setNewNote] = useState('');
    const [isAddingNote, setIsAddingNote] = useState(false);

    if (!guestId) {
        return (
            <div className="p-4 text-center">
                <p>Guest not found</p>
                <Button onClick={onBack} className="mt-4">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                </Button>
            </div>
        );
    }

    const getStageColor = (stage: Guest['stage']) => {
        switch (stage) {
            case 'invited':
                return 'bg-blue-100 text-blue-800';
            case 'attended':
                return 'bg-green-100 text-green-800';
            case 'discipled':
                return 'bg-purple-100 text-purple-800';
            case 'joined':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getProgressPercentage = () => {
        const completed = guest.milestones.filter(m => m.completed).length;
        return Math.round((completed / guest.milestones.length) * 100);
    };

    const handleMilestoneToggle = (milestoneId: string) => {
        setGuest(prev => ({
            ...prev,
            milestones: prev.milestones.map(m =>
                m.id === milestoneId
                    ? { ...m, completed: !m.completed, completedAt: m.completed ? undefined : new Date() }
                    : m
            ),
        }));
        toast.success('Milestone updated');
    };

    const handleAddNote = () => {
        if (!newNote.trim()) return;

        const note = {
            id: `t${Date.now()}`,
            type: 'note' as const,
            description: newNote,
            createdAt: new Date(),
            createdBy: 'user1',
        };

        setGuest(prev => ({
            ...prev,
            timeline: [note, ...prev.timeline],
            lastContact: new Date(),
        }));

        setNewNote('');
        setIsAddingNote(false);
        toast.success('Note added');
    };

    const formatTimelineDate = (date: Date) => {
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffHours / 24);

        if (diffHours < 1) return 'Just now';
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return date.toLocaleDateString();
    };

    const getTimelineIcon = (type: string) => {
        switch (type) {
            case 'call':
                return <Phone className="w-4 h-4" />;
            case 'whatsapp':
                return <MessageCircle className="w-4 h-4" />;
            case 'visit':
                return <MapPin className="w-4 h-4" />;
            case 'milestone':
                return <CheckCircle className="w-4 h-4" />;
            default:
                return <MessageSquare className="w-4 h-4" />;
        }
    };

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
                                {guest.name
                                    .split(' ')
                                    .map(n => n[0])
                                    .join('')}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                            <h1 className="text-2xl font-bold mb-2">{guest.name}</h1>
                            <div className="flex items-center space-x-2 mb-2">
                                <Badge variant="secondary" className={getStageColor(guest.stage)}>
                                    {guest.stage.charAt(0).toUpperCase() + guest.stage.slice(1)}
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
                            <span className="text-sm">Added {guest.createdAt.toLocaleDateString()}</span>
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
                            <div key={milestone.id} className="flex items-center space-x-3">
                                <Checkbox
                                    checked={milestone.completed}
                                    onCheckedChange={() => handleMilestoneToggle(milestone.id)}
                                />
                                <div className="flex-1">
                                    <span className={milestone.completed ? 'line-through text-gray-500' : ''}>
                                        {milestone.title}
                                    </span>
                                    {milestone.completed && milestone.completedAt && (
                                        <span className="text-xs text-gray-500 ml-2">
                                            ✓ {milestone.completedAt.toLocaleDateString()}
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
                        {guest.timeline.map((item, index) => (
                            <div key={item.id} className="flex space-x-3">
                                <div className="flex flex-col items-center">
                                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                                        {getTimelineIcon(item.type)}
                                    </div>
                                    {index < guest.timeline.length - 1 && <div className="w-px bg-gray-200 h-8 mt-2" />}
                                </div>
                                <div className="flex-1 pb-4">
                                    <div className="flex items-center justify-between mb-1">
                                        <Badge variant="outline" className="capitalize">
                                            {item.type}
                                        </Badge>
                                        <span className="text-xs text-gray-500">
                                            {formatTimelineDate(item.createdAt)}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-700">{item.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {guest.timeline.length === 0 && (
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
