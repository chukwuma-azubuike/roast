import { Search } from 'lucide-react';
import { Input } from '../../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Guest } from '../../../store/types';

interface SearchAndFilterProps {
    searchTerm: string;
    onSearchChange: (value: string) => void;
    stageFilter: Guest['assimilationStage'] | 'all';
    onStageFilterChange: (value: Guest['assimilationStage'] | 'all') => void;
    viewMode: 'kanban' | 'list';
}

export function SearchAndFilter({
    searchTerm,
    onSearchChange,
    stageFilter,
    onStageFilterChange,
    viewMode,
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
            {viewMode === 'list' && (
                <Select
                    value={stageFilter}
                    onValueChange={value => onStageFilterChange(value as Guest['assimilationStage'] | 'all')}
                >
                    <SelectTrigger className="w-48">
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
        </div>
    );
}
