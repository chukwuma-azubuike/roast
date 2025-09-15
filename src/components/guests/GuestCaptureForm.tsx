import React from 'react';
import { Save } from 'lucide-react';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { MessageSquare, MapPin, User, Phone } from 'lucide-react';
import { User as UserType } from '../../store/types';
import { useGetZonesQuery } from '../../store/api';
import { FormField } from './form/FormField';
import { FormWrapper } from './form/FormWrapper';
import { QuickTips } from './form/QuickTips';
import { ZoneSelection } from './form/ZoneSelection';
import { useGuestForm } from './hooks/useGuestForm';

interface GuestCaptureFormProps {
    currentUser: UserType;
    onGuestCaptured: () => void;
}

const QUICK_TIPS = [
    'Keep conversations natural and friendly',
    'Ask permission before capturing contact details',
    'Focus on building genuine connections',
    'Follow up within 24-48 hours',
];

export function GuestCaptureForm({ currentUser, onGuestCaptured }: GuestCaptureFormProps) {
    const { data: zones } = useGetZonesQuery();
    const { formData, isSubmitting, isOnline, handleInputChange, handleSubmit } = useGuestForm({
        currentUser,
        onGuestCaptured,
    });

    const defaultZone = zones?.find(z => z._id === (currentUser?.zoneIds as string[])?.[0]);

    return (
        <FormWrapper title="Capture New Guest" subtitle="Quick entry form for street evangelism">
            <form onSubmit={handleSubmit} className="space-y-4">
                <FormField
                    id="name"
                    label="Name"
                    icon={User}
                    value={formData.name}
                    onChange={value => handleInputChange('name', value)}
                    placeholder="Enter guest's full name"
                    required
                    autoComplete="name"
                />

                <FormField
                    id="phone"
                    label="Phone Number"
                    icon={Phone}
                    value={formData.phone}
                    onChange={value => handleInputChange('phone', value)}
                    placeholder="Enter phone number"
                    required
                    type="tel"
                    autoComplete="tel"
                />

                <ZoneSelection
                    selectedZone={formData.zoneId}
                    onZoneChange={value => handleInputChange('zoneId', value)}
                    zones={zones}
                    defaultZoneName={defaultZone?.name}
                />

                <div className="space-y-2">
                    <Label htmlFor="address" className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4" />
                        <span>Address (Optional)</span>
                    </Label>
                    <Textarea
                        id="address"
                        value={formData.address}
                        onChange={e => handleInputChange('address', e.target.value)}
                        placeholder="Enter address for follow-up visits"
                        rows={2}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="prayerRequest" className="flex items-center space-x-1">
                        <MessageSquare className="w-4 h-4" />
                        <span>Prayer Request (Optional)</span>
                    </Label>
                    <Textarea
                        id="prayerRequest"
                        value={formData.prayerRequest}
                        onChange={e => handleInputChange('prayerRequest', e.target.value)}
                        placeholder="Any specific prayer needs or concerns"
                        rows={3}
                    />
                </div>

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                    <Save className="w-4 h-4 mr-2" />
                    {isSubmitting ? 'Saving...' : !isOnline ? 'Save Offline' : 'Capture Guest'}
                </Button>

                {!isOnline && (
                    <p className="text-xs text-orange-600 text-center">
                        Guest will be saved locally and synced when you're back online
                    </p>
                )}
            </form>
            <QuickTips tips={QUICK_TIPS} />
        </FormWrapper>
    );
}
