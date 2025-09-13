import React, { memo } from 'react';
import { Search, LayoutGrid, List } from 'lucide-react';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { ToggleGroup, ToggleGroupItem } from '../ui/toggle-group';
import { AssimilationStage } from '../../store/types';

interface SearchAndFilterProps {
    searchTerm: string;
    onSearchChange: (value: string) => void;
    viewMode: 'kanban' | 'list';
    onViewModeChange: (value: 'kanban' | 'list') => void;
    stageFilter?: AssimilationStage | 'all';
    onStageFilterChange?: (value: AssimilationStage | 'all') => void;
}

export const SearchAndFilter = memo(function SearchAndFilter({
    searchTerm,
    onSearchChange,
    viewMode,
    onViewModeChange,
    stageFilter,
    onStageFilterChange,
}: SearchAndFilterProps) {
    return (
        <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                    placeholder="Search guests by name, phone, or address..."
                    value={searchTerm}
                    onChange={e => onSearchChange(e.target.value)}
                    className="pl-10"
                />
            </div>
            {viewMode === 'list' && onStageFilterChange && (
                <Select value={stageFilter} onValueChange={onStageFilterChange}>
                    <SelectTrigger className="w-min">
                        <SelectValue placeholder="Filter by stage" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Stages</SelectItem>
                        <SelectItem value="invited">Invited</SelectItem>
                        <SelectItem value="attended">Attended</SelectItem>
                        <SelectItem value="discipled">Discipled</SelectItem>
                        <SelectItem value="joined">Joined Workforce</SelectItem>
                    </SelectContent>
                </Select>
            )}

            <ToggleGroup
                type="single"
                value={viewMode}
                onValueChange={value => value && onViewModeChange(value as 'kanban' | 'list')}
            >
                <ToggleGroupItem value="kanban" aria-label="Kanban view">
                    <LayoutGrid className="w-4 h-4" />
                </ToggleGroupItem>
                <ToggleGroupItem value="list" aria-label="List view">
                    <List className="w-4 h-4" />
                </ToggleGroupItem>
            </ToggleGroup>
        </div>
    );
});
