import React, { useState } from 'react';
import { User, Guest, Role } from '../../store/types';
import { useGetGuestsQuery, useGetUsersQuery, useGetZonesQuery, useUpdateGuestMutation } from '../../store/api';
import { Card, CardContent } from '../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { toast } from 'sonner';

import { ZoneStats } from './components/ZoneStats';
import { PipelineInstructions } from './components/PipelineInstructions';
import { SearchAndFilter } from './components/SearchAndFilter';
import { ViewModeToggle } from './components/ViewModeToggle';
import { BulkActions } from './components/BulkActions';
import { ListView } from './list/ListView';
import { KanbanColumn } from './kanban/KanbanColumn';
import { useGuestFiltering } from './hooks/useGuestFiltering';
import { AssimilationStage } from '../../store/types';

interface ZoneDashboardProps {
    currentUser: User;
}

export function ZoneDashboard({ currentUser }: ZoneDashboardProps) {
    const [selectedZone, setSelectedZone] = useState<string>(currentUser.zoneIds?.[0] || '');
    const [bulkReassignMode, setBulkReassignMode] = useState(false);
    const [selectedGuests, setSelectedGuests] = useState<string[]>([]);
    const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
    const [searchTerm, setSearchTerm] = useState('');
    const [stageFilter, setStageFilter] = useState<Guest['assimilationStage'] | 'all'>('all');

    // RTK Queries
    const { data: guests = [], isLoading: loadingGuests } = useGetGuestsQuery({ zoneId: selectedZone });
    const { data: users = [] } = useGetUsersQuery({});
    const { data: zones = [] } = useGetZonesQuery();
    const [updateGuest] = useUpdateGuestMutation();

    const { filteredGuests, groupedGuests, stats } = useGuestFiltering({
        guests,
        searchTerm,
        stageFilter,
        zoneId: selectedZone,
    });

    const handleGuestMove = async (guestId: string, newStage: Guest['assimilationStage']) => {
        try {
            await updateGuest({ _id: guestId, assimilationStage: newStage, lastContact: new Date().toISOString() });
            toast.success(`Guest moved to ${newStage} stage`);
        } catch (error) {
            toast.error('Failed to update guest stage');
        }
    };

    const handleReassignWorker = async (guestId: string, workerId: string, zoneId?: string) => {
        try {
            await updateGuest({
                _id: guestId,
                assignedToId: workerId,
                zoneId: zoneId || selectedZone,
                lastContact: new Date().toISOString(),
            });

            // If guest was moved to a different zoneId, update selected zoneId to follow the guest
            if (
                zoneId &&
                zoneId !== selectedZone &&
                (currentUser.role === Role.ADMIN || currentUser.role === Role.PASTOR)
            ) {
                setSelectedZone(zoneId);
            }

            toast.success('Worker reassigned successfully');
        } catch (error) {
            toast.error('Failed to reassign worker');
        }
    };

    const handleBulkReassign = async (workerId: string) => {
        if (selectedGuests.length === 0) {
            toast.error('Please select guests to reassign');
            return;
        }

        try {
            await Promise.all(
                selectedGuests.map(guestId =>
                    updateGuest({
                        _id: guestId,
                        assignedToId: workerId,
                        lastContact: new Date().toISOString(),
                    })
                )
            );

            const worker = users.find(w => w._id === workerId);
            toast.success(`${selectedGuests.length} guests reassigned to ${worker?.name}`);
            setSelectedGuests([]);
            setBulkReassignMode(false);
        } catch (error) {
            toast.error('Failed to reassign some guests');
        }
    };

    const toggleGuestSelection = (guestId: string) => {
        setSelectedGuests(prev => (prev.includes(guestId) ? prev.filter(_id => _id !== guestId) : [...prev, guestId]));
    };

    return (
        <div className="p-4 space-y-4">
            {/* Header */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-2xl font-bold">{zones.find(z => z._id === selectedZone)?.name} Dashboard</h1>

                    {/* Zone Selector */}
                    {(currentUser.role === Role.ADMIN || currentUser.role === Role.PASTOR) && (
                        <Select value={selectedZone} onValueChange={setSelectedZone}>
                            <SelectTrigger className="w-48">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {zones.map(zone => (
                                    <SelectItem key={zone._id} value={zone._id}>
                                        {zone.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                </div>

                <ZoneStats
                    totalGuests={stats.totalGuests}
                    conversionRate={stats.conversionRate}
                    activeThisWeek={stats.activeThisWeek}
                    totalWorkers={users.filter(u => u.role === Role.WORKER).length}
                />
            </div>

            {/* Instructions - Only show for Kanban view */}
            {viewMode === 'kanban' && <PipelineInstructions />}

            <div className="flex items-center space-x-2 w-full justify-between">
                <BulkActions
                    bulkReassignMode={bulkReassignMode}
                    selectedGuests={selectedGuests}
                    workers={users}
                    onBulkReassignStart={() => setBulkReassignMode(true)}
                    onBulkReassignCancel={() => {
                        setBulkReassignMode(false);
                        setSelectedGuests([]);
                    }}
                    onWorkerSelect={handleBulkReassign}
                />

                <ViewModeToggle
                    viewMode={viewMode}
                    onViewModeChange={value => {
                        setViewMode(value);
                        setSearchTerm('');
                        setStageFilter('all');
                        setBulkReassignMode(false);
                        setSelectedGuests([]);
                    }}
                />
            </div>

            <SearchAndFilter
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                stageFilter={stageFilter}
                onStageFilterChange={value => setStageFilter(value)}
                viewMode={viewMode}
            />

            {/* View Content */}
            {viewMode === 'kanban' ? (
                <div className="flex space-x-4 overflow-x-auto pb-4">
                    {Object.entries(groupedGuests).map(([stage, stageGuests]) => (
                        <KanbanColumn
                            key={stage}
                            title={stage === 'joined' ? 'Joined Workforce' : stage.charAt(0).toUpperCase() + stage.slice(1)}
                            stage={stage as AssimilationStage}
                            guests={stageGuests}
                            workers={users}
                            currentUser={currentUser}
                            bulkReassignMode={bulkReassignMode}
                            selectedGuests={selectedGuests}
                            onGuestMove={handleGuestMove}
                            onReassignWorker={handleReassignWorker}
                            onToggleGuestSelection={toggleGuestSelection}
                        />
                    ))}
                </div>
            ) : (
                <ListView
                    guests={filteredGuests}
                    users={users}
                    currentUser={currentUser}
                    bulkReassignMode={bulkReassignMode}
                    selectedGuests={selectedGuests}
                    onGuestMove={handleGuestMove}
                    onReassignWorker={handleReassignWorker}
                    onToggleGuestSelection={toggleGuestSelection}
                />
            )}
        </div>
    );
}
