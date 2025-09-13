import React, { useState, useMemo, useCallback } from 'react';
import { useGetGuestsQuery, useUpdateGuestMutation } from '../../store/api';
import { GuestList } from './GuestList';
import { SearchAndFilter } from './SearchAndFilter';
import { KanbanColumn } from './KanbanColumn';
import { StatsCard } from './StatsCard';
import { AssimilationStage } from '../../store/types';
import { toast } from 'sonner';

interface MyGuestsDashboardProps {
    currentUserId: string;
    onViewGuest: (guestId: string) => void;
}

export function MyGuestsDashboard({ currentUserId, onViewGuest }: MyGuestsDashboardProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
    const [stageFilter, setStageFilter] = useState<AssimilationStage | 'all'>('all');

    // RTK Query hooks
    const { data: guests = [], isLoading } = useGetGuestsQuery({ workerId: currentUserId });
    const [updateGuest] = useUpdateGuestMutation();

    // Memoized filtered guests
    const filteredGuests = useMemo(() => {
        let filtered = guests;

        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(
                guest =>
                    `${guest.firstName} ${guest.lastName || ''}`.toLowerCase().includes(term) ||
                    guest.phone.includes(term) ||
                    (guest.address && guest.address.toLowerCase().includes(term))
            );
        }

        if (stageFilter !== 'all') {
            filtered = filtered.filter(guest => guest.assimilationStage === stageFilter);
        }

        return filtered;
    }, [guests, searchTerm, stageFilter]);

    // Memoized stage counts
    const stageCounts = useMemo(
        () => ({
            invited: guests.filter(g => g.assimilationStage === 'invited').length,
            attended: guests.filter(g => g.assimilationStage === 'attended').length,
            discipled: guests.filter(g => g.assimilationStage === 'discipled').length,
            joined: guests.filter(g => g.assimilationStage === 'joined').length,
        }),
        [guests]
    );

    // Memoized guests by stage for Kanban view
    const guestsByStage = useMemo(
        () => ({
            invited: filteredGuests.filter(g => g.assimilationStage === 'invited'),
            attended: filteredGuests.filter(g => g.assimilationStage === 'attended'),
            discipled: filteredGuests.filter(g => g.assimilationStage === 'discipled'),
            joined: filteredGuests.filter(g => g.assimilationStage === 'joined'),
        }),
        [filteredGuests]
    );

    // Callbacks
    const handleStageChange = useCallback(
        async (guestId: string, newStage: AssimilationStage) => {
            try {
                await updateGuest({
                    id: guestId,
                    assimilationStage: newStage,
                    lastContact: new Date().toISOString(),
                }).unwrap();
                toast.success(`Guest moved to ${newStage} stage`);
            } catch (error) {
                toast.error('Failed to update guest stage');
            }
        },
        [updateGuest]
    );

    const handleSearchChange = useCallback((value: string) => {
        setSearchTerm(value);
    }, []);

    const handleViewModeChange = useCallback((mode: 'kanban' | 'list') => {
        setViewMode(mode);
    }, []);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="p-4 max-w-6xl mx-auto space-y-6">
            {/* Header with Stats */}
            <div>
                <h1 className="text-2xl font-bold mb-4">My Guests</h1>
                <div className="grid grid-cols-4 gap-4">
                    <StatsCard stage={AssimilationStage.INVITED} count={stageCounts.invited} />
                    <StatsCard stage={AssimilationStage.ATTENDED} count={stageCounts.attended} />
                    <StatsCard stage={AssimilationStage.DISCIPLED} count={stageCounts.discipled} />
                    <StatsCard stage={AssimilationStage.JOINED} count={stageCounts.joined} />
                </div>
            </div>

            <SearchAndFilter
                searchTerm={searchTerm}
                onSearchChange={handleSearchChange}
                viewMode={viewMode}
                onViewModeChange={handleViewModeChange}
                stageFilter={stageFilter}
                onStageFilterChange={viewMode === 'list' ? setStageFilter : undefined}
            />

            {/* Content */}
            {viewMode === 'kanban' ? (
                <div className="flex space-x-4 overflow-x-auto">
                    <KanbanColumn
                        title="Invited"
                        stage={AssimilationStage.INVITED}
                        guests={guestsByStage.invited}
                        onGuestMove={handleStageChange}
                        onViewGuest={onViewGuest}
                    />
                    <KanbanColumn
                        title="Attended"
                        stage={AssimilationStage.ATTENDED}
                        guests={guestsByStage.attended}
                        onGuestMove={handleStageChange}
                        onViewGuest={onViewGuest}
                    />
                    <KanbanColumn
                        title="Discipled"
                        stage={AssimilationStage.DISCIPLED}
                        guests={guestsByStage.discipled}
                        onGuestMove={handleStageChange}
                        onViewGuest={onViewGuest}
                    />
                    <KanbanColumn
                        title="Joined Workforce"
                        stage={AssimilationStage.JOINED}
                        guests={guestsByStage.joined}
                        onGuestMove={handleStageChange}
                        onViewGuest={onViewGuest}
                    />
                </div>
            ) : (
                <GuestList guests={filteredGuests} onStageChange={handleStageChange} onViewGuest={onViewGuest} />
            )}
        </div>
    );
}
