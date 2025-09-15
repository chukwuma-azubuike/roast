import { LayoutGrid, List } from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from '../../ui/toggle-group';

interface ViewModeToggleProps {
    viewMode: 'kanban' | 'list';
    onViewModeChange: (value: 'kanban' | 'list') => void;
}

export function ViewModeToggle({ viewMode, onViewModeChange }: ViewModeToggleProps) {
    return (
        <ToggleGroup
            type="single"
            value={viewMode}
            onValueChange={value => {
                if (value) {
                    onViewModeChange(value as 'kanban' | 'list');
                }
            }}
        >
            <ToggleGroupItem value="kanban" aria-label="Kanban view">
                <LayoutGrid className="w-4 h-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="list" aria-label="List view">
                <List className="w-4 h-4" />
            </ToggleGroupItem>
        </ToggleGroup>
    );
}
