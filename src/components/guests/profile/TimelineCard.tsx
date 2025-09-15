import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../ui/card';
import { Button } from '../../ui/button';
import { Textarea } from '../../ui/textarea';
import { Badge } from '../../ui/badge';
import { Clock, Plus, Save, X, Phone, MessageCircle, MapPin, MessageSquare } from 'lucide-react';
import { ContactChannel } from '../../../store/types';

import { Engagement } from '../../../store/types';

interface TimelineCardProps {
    engagements: Engagement[];
    onAddNote: (note: string) => Promise<void>;
}

export function TimelineCard({ engagements, onAddNote }: TimelineCardProps) {
    const [newNote, setNewNote] = useState('');
    const [isAddingNote, setIsAddingNote] = useState(false);

    const handleAddNote = async () => {
        if (!newNote.trim()) return;

        try {
            await onAddNote(newNote);
            setNewNote('');
            setIsAddingNote(false);
        } catch (error) {
            // Error handling is done in the parent component
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
            case 'milestone':
                return <Clock className="w-4 h-4" />;
            default:
                return <MessageSquare className="w-4 h-4" />;
        }
    };

    const formatTimelineDate = (date: string | Date) => {
        const now = new Date();
        const eventDate = new Date(date);
        const diffMs = now.getTime() - eventDate.getTime();
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffHours / 24);

        if (diffHours < 1) return 'Just now';
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return eventDate.toLocaleDateString();
    };

    return (
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
                                        {item.type}
                                    </Badge>
                                    <span className="text-xs text-gray-500">{formatTimelineDate(item.timestamp)}</span>
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
    );
}
