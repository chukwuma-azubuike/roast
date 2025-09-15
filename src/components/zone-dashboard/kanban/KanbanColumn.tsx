import React, { useState } from 'react';
import { Users } from 'lucide-react';
import { User, Guest, AssimilationStage } from '../../../store/types';
import { getStageColor } from '../utils/stageUtils';
import { Badge } from '../../ui/badge';
import { GuestCard } from './GuestCard';

interface KanbanColumnProps {
    title: string;
    stage: AssimilationStage;
    guests: Guest[];
    workers: User[];
    currentUser: User;
    bulkReassignMode: boolean;
    selectedGuests: string[];
    onGuestMove: (guestId: string, newStage: AssimilationStage) => void;
    onReassignWorker: (guestId: string, workerId: string, zoneId?: string) => void;
    onToggleGuestSelection: (guestId: string) => void;
}

export function KanbanColumn({
    title,
    stage,
    guests,
    workers,
    currentUser,
    bulkReassignMode,
    selectedGuests,
    onGuestMove,
    onReassignWorker,
    onToggleGuestSelection,
}: KanbanColumnProps) {
    const [draggedGuest, setDraggedGuest] = useState<string | null>(null);

    const handleDragStart = (e: React.DragEvent, guestId: string) => {
        setDraggedGuest(guestId);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        if (draggedGuest && draggedGuest !== stage) {
            onGuestMove(draggedGuest, stage);
        }
        setDraggedGuest(null);
    };

    return (
        <div
            className={`flex-1 min-w-[280px] ${getStageColor(
                stage,
                'card'
            )} border-2 border-dashed rounded-lg p-4 transition-colors`}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
        >
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold flex items-center space-x-2">
                    <span>{title}</span>
                    <Badge variant="secondary" className={getStageColor(stage, 'badge')}>
                        {guests.length}
                    </Badge>
                </h3>
            </div>

            <div className="space-y-3">
                {guests.map(guest => (
                    <GuestCard
                        key={guest._id}
                        guest={guest}
                        workers={workers}
                        currentUser={currentUser}
                        bulkReassignMode={bulkReassignMode}
                        isSelected={selectedGuests.includes(guest._id)}
                        onDragStart={handleDragStart}
                        onReassignWorker={onReassignWorker}
                        onToggleSelection={onToggleGuestSelection}
                    />
                ))}

                {guests.length === 0 && (
                    <div className="text-center py-8 text-gray-400">
                        <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No guests in this stage</p>
                    </div>
                )}
            </div>
        </div>
    );
}
