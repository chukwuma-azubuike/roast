import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { useLocalStorage, useOnlineStatus } from '../../../hooks/shared';
import { User } from '../../../store/types';

interface GuestFormData {
    name: string;
    phone: string;
    address?: string;
    prayerRequest?: string;
    zoneId: string;
    serviceToAttend?: {
        tag: string; // Service tag like "COZA_SUNDAY"
        date: string;
    };
}

interface UseGuestFormProps {
    currentUser: User;
    onGuestCaptured: () => void;
}

export function useGuestForm({ currentUser, onGuestCaptured }: UseGuestFormProps) {
    const [formData, setFormData] = useState<GuestFormData>({
        name: '',
        phone: '',
        address: '',
        prayerRequest: '',
        serviceToAttend: {
            tag: '',
            date: '',
        },
        zoneId: currentUser.zoneIds[0],
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const isOnline = useOnlineStatus();
    const [offlineGuests, setOfflineGuests] = useLocalStorage<
        Array<
            GuestFormData & {
                id: string;
                assignedWorker: string;
                createdAt: string;
                synced: boolean;
            }
        >
    >('offlineGuests', []);

    const handleInputChange = useCallback((field: keyof GuestFormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    }, []);

    const resetForm = useCallback(() => {
        setFormData({
            name: '',
            phone: '',
            address: '',
            prayerRequest: '',
            zoneId: currentUser.zoneIds[0] || '',
        });
    }, [currentUser.zoneIds]);

    const handleSubmit = useCallback(
        async (e: React.FormEvent) => {
            e.preventDefault();

            if (!formData.name.trim() || !formData.phone.trim()) {
                toast.error('Name and phone number are required');
                return;
            }

            setIsSubmitting(true);

            try {
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 1000));

                if (!isOnline) {
                    const newGuest = {
                        ...formData,
                        id: `offline_${Date.now()}`,
                        assignedWorker: currentUser._id,
                        createdAt: new Date().toISOString(),
                        synced: false,
                    };
                    setOfflineGuests(prev => [...prev, newGuest]);
                    toast.success('Guest saved offline. Will sync when connection is restored.');
                } else {
                    toast.success('Guest captured successfully!');
                }

                resetForm();
                onGuestCaptured();
            } catch (error) {
                toast.error('Failed to capture guest. Please try again.');
            } finally {
                setIsSubmitting(false);
            }
        },
        [formData, isOnline, currentUser._id, resetForm, onGuestCaptured, setOfflineGuests]
    );

    return {
        formData,
        isSubmitting,
        isOnline,
        handleInputChange,
        handleSubmit,
    };
}
