import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { User, Role, Zone } from '../../store/types';

interface ZoneSelectorProps {
    currentUser: User;
    zones?: Zone[];
    selectedZone: string;
    onZoneChange: (zoneId: string) => void;
}

export function ZoneSelector({ currentUser, zones, selectedZone, onZoneChange }: ZoneSelectorProps) {
    if (currentUser.role !== Role.ADMIN && currentUser.role !== Role.PASTOR) {
        return null;
    }

    return (
        <div>
            <Label className="text-sm font-medium">Target Zone</Label>
            <Select value={selectedZone} onValueChange={onZoneChange}>
                <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select zone" />
                </SelectTrigger>
                <SelectContent>
                    {zones?.map(zone => (
                        <SelectItem key={zone._id} value={zone._id}>
                            {zone.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}
