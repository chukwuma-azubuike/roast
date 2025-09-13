import React, { useState } from 'react';
import { Save, MapPin, Phone, User, MessageSquare } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { toast } from 'sonner@2.0.3';
import type { User } from '../App';

interface GuestCaptureFormProps {
    currentUser: User;
    onGuestCaptured: () => void;
}

export function GuestCaptureForm({ currentUser, onGuestCaptured }: GuestCaptureFormProps) {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        address: '',
        prayerRequest: '',
        zone: currentUser.zone || '',
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isOffline, setIsOffline] = useState(!navigator.onLine);

    // Mock zones data
    const zones = [
        { id: 'zone1', name: 'Central Zone' },
        { id: 'zone2', name: 'North Zone' },
        { id: 'zone3', name: 'South Zone' },
        { id: 'zone4', name: 'East Zone' },
        { id: 'zone5', name: 'West Zone' },
    ];

    // Listen for online/offline status
    React.useEffect(() => {
        const handleOnline = () => setIsOffline(false);
        const handleOffline = () => setIsOffline(true);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name.trim() || !formData.phone.trim()) {
            toast.error('Name and phone number are required');
            return;
        }

        setIsSubmitting(true);

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            if (isOffline) {
                // Save to localStorage for offline sync
                const offlineGuests = JSON.parse(localStorage.getItem('offlineGuests') || '[]');
                const newGuest = {
                    ...formData,
                    id: `offline_${Date.now()}`,
                    assignedWorker: currentUser.id,
                    createdAt: new Date().toISOString(),
                    synced: false,
                };
                offlineGuests.push(newGuest);
                localStorage.setItem('offlineGuests', JSON.stringify(offlineGuests));
                toast.success('Guest saved offline. Will sync when connection is restored.');
            } else {
                toast.success('Guest captured successfully!');
            }

            // Reset form
            setFormData({
                name: '',
                phone: '',
                address: '',
                prayerRequest: '',
                zone: currentUser.zone || '',
            });

            onGuestCaptured();
        } catch (error) {
            toast.error('Failed to capture guest. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="p-4 max-w-lg mx-auto">
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center space-x-2">
                            <User className="w-5 h-5" />
                            <span>Capture New Guest</span>
                        </CardTitle>
                        {isOffline && (
                            <Badge variant="outline" className="text-orange-600 border-orange-200">
                                Offline Mode
                            </Badge>
                        )}
                    </div>
                    <p className="text-sm text-gray-600">Quick entry form for street evangelism</p>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Name Field */}
                        <div className="space-y-2">
                            <Label htmlFor="name" className="flex items-center space-x-1">
                                <User className="w-4 h-4" />
                                <span>Name *</span>
                            </Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={e => handleInputChange('name', e.target.value)}
                                placeholder="Enter guest's full name"
                                required
                                autoComplete="name"
                            />
                        </div>

                        {/* Phone Field */}
                        <div className="space-y-2">
                            <Label htmlFor="phone" className="flex items-center space-x-1">
                                <Phone className="w-4 h-4" />
                                <span>Phone Number *</span>
                            </Label>
                            <Input
                                id="phone"
                                type="tel"
                                value={formData.phone}
                                onChange={e => handleInputChange('phone', e.target.value)}
                                placeholder="Enter phone number"
                                required
                                autoComplete="tel"
                            />
                        </div>

                        {/* Zone Selection */}
                        <div className="space-y-2">
                            <Label className="flex items-center space-x-1">
                                <MapPin className="w-4 h-4" />
                                <span>Zone</span>
                            </Label>
                            <Select value={formData.zone} onValueChange={value => handleInputChange('zone', value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select zone" />
                                </SelectTrigger>
                                <SelectContent>
                                    {zones.map(zone => (
                                        <SelectItem key={zone.id} value={zone.id}>
                                            {zone.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {currentUser.zone && (
                                <p className="text-xs text-gray-500">
                                    Auto-assigned to your zone: {zones.find(z => z.id === currentUser.zone)?.name}
                                </p>
                            )}
                        </div>

                        {/* Address Field */}
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

                        {/* Prayer Request Field */}
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

                        {/* Submit Button */}
                        <Button type="submit" className="w-full" disabled={isSubmitting}>
                            <Save className="w-4 h-4 mr-2" />
                            {isSubmitting ? 'Saving...' : isOffline ? 'Save Offline' : 'Capture Guest'}
                        </Button>

                        {isOffline && (
                            <p className="text-xs text-orange-600 text-center">
                                Guest will be saved locally and synced when you're back online
                            </p>
                        )}
                    </form>
                </CardContent>
            </Card>

            {/* Quick Tips */}
            <Card className="mt-4">
                <CardContent className="pt-4">
                    <h3 className="font-medium mb-2">Quick Tips</h3>
                    <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Keep conversations natural and friendly</li>
                        <li>• Ask permission before capturing contact details</li>
                        <li>• Focus on building genuine connections</li>
                        <li>• Follow up within 24-48 hours</li>
                    </ul>
                </CardContent>
            </Card>
        </div>
    );
}
