import React from 'react';
import { Button } from '../../ui/button';
import { EmptyState } from '../../shared/EmptyState';
import { ArrowLeft } from 'lucide-react';
import { Guest, MilestoneStatus, ContactChannel } from '../../../store/types';
import {
    useGetGuestByIdQuery,
    useUpdateGuestMutation,
    useGetEngagementsForGuestQuery,
    useAddEngagementMutation,
} from '../../../store/api';
import { toast } from 'sonner';
import { GuestHeader } from './GuestHeader';
import { MilestonesCard } from './MilestonesCard';
import { TimelineCard } from './TimelineCard';
import { Card, CardContent } from '../../ui/card';

interface GuestProfileProps {
    guestId: string | null;
    onBack: () => void;
}

function GuestProfile({ guestId, onBack }: GuestProfileProps) {
    const { data: guest, isLoading } = useGetGuestByIdQuery(guestId || '');
    const { data: engagements = [] } = useGetEngagementsForGuestQuery(guestId || '', { skip: !guestId });
    const [updateGuest] = useUpdateGuestMutation();
    const [addEngagement] = useAddEngagementMutation();

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
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getProgressPercentage = () => {
        if (!guest?.milestones?.length) return 0;
        const completed = guest.milestones.filter(m => m.status === MilestoneStatus.COMPLETED).length;
        return Math.round((completed / guest.milestones.length) * 100);
    };

    const handleMilestoneToggle = async (milestoneId: string) => {
        if (!guest) return;

        try {
            const updatedMilestones = guest.milestones.map(m =>
                m._id === milestoneId
                    ? {
                          ...m,
                          status:
                              m.status === MilestoneStatus.COMPLETED
                                  ? MilestoneStatus.PENDING
                                  : MilestoneStatus.COMPLETED,
                          completedAt: m.status === MilestoneStatus.COMPLETED ? undefined : new Date().toISOString(),
                      }
                    : m
            );

            await updateGuest({
                _id: guest._id,
                milestones: updatedMilestones,
                lastContact: new Date().toISOString(),
            });
            toast.success('Milestone updated');
        } catch (error) {
            toast.error('Failed to update milestone');
        }
    };

    const handleAddNote = async (note: string) => {
        if (!guest) return;

        try {
            await addEngagement({
                guestId: guest._id,
                workerId: 'user1', // Should come from auth context in real app
                type: ContactChannel.WHATSAPP, // Using WhatsApp as the default channel
                notes: note,
            });
            toast.success('Note added');
        } catch (error) {
            toast.error('Failed to add note');
            throw error; // Re-throw to handle in the component
        }
    };

    if (!guestId || !guest || isLoading) {
        return (
            <div className="p-4 max-w-2xl mx-auto space-y-6">
                <div>
                    <p>{!guest && !isLoading && 'Guest not found'}</p>
                    <Button size="sm" onClick={onBack}>
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back
                    </Button>
                </div>
                <div className="animate-pulse space-y-4">
                    {[...Array(4)].map((_, i) => (
                        <Card key={i}>
                            <CardContent className="p-4">
                                <div className="flex items-start space-x-4">
                                    <div className="w-10 h-10 rounded-lg bg-gray-200" />
                                    <div className="space-y-4 flex-1">
                                        <div className="h-5 bg-gray-200 rounded w-3/4" />
                                        <div className="h-3 bg-gray-200 rounded w-1/2" />
                                        <div className="h-3 bg-gray-200 rounded w-1/2" />
                                        <div className="h-3 bg-gray-200 rounded w-3/4 " />
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
        <div className="p-4 max-w-2xl mx-auto space-y-6">
            {/* Header with Back Button */}
            <div className="flex items-center mb-6">
                <Button size="sm" onClick={onBack}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                </Button>
            </div>

            {/* Guest Info Section */}
            <GuestHeader
                guest={guest}
                stageColor={getStageColor(guest.assimilationStage)}
                progressPercentage={getProgressPercentage()}
                onCall={() => window.open(`tel:${guest.phone}`, '_self')}
                onWhatsApp={() => window.open(`https://wa.me/${guest.phone.replace(/\D/g, '')}`, '_blank')}
            />

            {/* Milestones Section */}
            <MilestonesCard milestones={guest.milestones} onToggle={handleMilestoneToggle} />

            {/* Timeline Section */}
            <TimelineCard engagements={engagements} onAddNote={handleAddNote} />
        </div>
    );
}

export default GuestProfile;
