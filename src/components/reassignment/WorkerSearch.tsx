import { Search } from 'lucide-react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';

interface WorkerSearchProps {
    searchTerm: string;
    onSearchChange: (value: string) => void;
}

export function WorkerSearch({ searchTerm, onSearchChange }: WorkerSearchProps) {
    return (
        <div>
            <Label className="text-sm font-medium">Search Workers</Label>
            <div className="relative mt-2">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                    placeholder="Search by name or email..."
                    value={searchTerm}
                    onChange={e => onSearchChange(e.target.value)}
                    className="pl-10"
                />
            </div>
        </div>
    );
}
