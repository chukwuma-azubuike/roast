import React, { memo, useState } from 'react';
import { Users } from 'lucide-react';
import { Guest, AssimilationStage } from '../../store/types';
import { GuestCard } from './GuestCard';

interface KanbanColumnProps {
    title: string;
    stage: AssimilationStage;
    guests: Guest[];
    onGuestMove: (guestId: string, newStage: AssimilationStage) => void;
    onViewGuest: (guestId: string) => void;
}

export const KanbanColumn = memo(function KanbanColumn({
    title,
    stage,
    guests,
    onGuestMove,
    onViewGuest,
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
        if (draggedGuest) {
            onGuestMove(draggedGuest, stage);
        }
        setDraggedGuest(null);
    };

    const getStageColor = () => {
        switch (stage) {
            case 'invited':
                return 'border-blue-200 bg-blue-50';
            case 'attended':
                return 'border-green-200 bg-green-50';
            case 'discipled':
                return 'border-purple-200 bg-purple-50';
            case 'joined':
                return 'border-gray-200 bg-gray-50';
        }
    };

    const getBadgeColor = () => {
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

    return (
        <div
            className={`flex-1 min-w-[280px] ${getStageColor()} border-2 border-dashed rounded-lg p-4 transition-colors`}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
        >
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold flex items-center space-x-2">
                    <span>{title}</span>
                    <div className={`px-2 py-0.5 rounded-full text-xs font-medium ${getBadgeColor()}`}>
                        {guests.length}
                    </div>
                </h3>
            </div>

            <div className="space-y-3">
                {guests.map(guest => (
                    <GuestCard key={guest.id} guest={guest} onViewGuest={onViewGuest} onDragStart={handleDragStart} />
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
});
