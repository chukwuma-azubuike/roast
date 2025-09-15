import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Label } from '../../ui/label';
import { MapPin } from 'lucide-react';

interface ZoneData {
    _id: string;
    name: string;
}

interface ZoneSelectionProps {
    selectedZone: string;
    onZoneChange: (value: string) => void;
    zones?: ZoneData[];
    defaultZoneName?: string;
}

export function ZoneSelection({ selectedZone, onZoneChange, zones, defaultZoneName }: ZoneSelectionProps) {
    return (
        <div className="space-y-2">
            <Label className="flex items-center space-x-1">
                <MapPin className="w-4 h-4" />
                <span>Zone</span>
            </Label>
            <Select value={selectedZone} onValueChange={onZoneChange}>
                <SelectTrigger>
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
            {defaultZoneName && (
                <p className="text-xs text-gray-500">
                    Auto-assigned to your zone: {defaultZoneName}
                </p>
            )}
        </div>
    );
}
