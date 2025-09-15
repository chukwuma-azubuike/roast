import { Guest } from '../../../store/types';

interface UseGuestFilteringProps {
    guests: Guest[];
    searchTerm: string;
    stageFilter: Guest['assimilationStage'] | 'all';
    zoneId: string;
}

export function useGuestFiltering({ guests, searchTerm, stageFilter, zoneId }: UseGuestFilteringProps) {
    const filterGuests = () => {
        let filtered = guests;

        if (searchTerm) {
            filtered = filtered.filter(
                guest =>
                    guest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    guest.phone.includes(searchTerm) ||
                    (guest.address && guest.address.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }

        if (stageFilter !== 'all') {
            filtered = filtered.filter(guest => guest.assimilationStage === stageFilter);
        }

        // Filter by zone
        filtered = filtered.filter(guest => guest.zoneId === zoneId);

        return filtered;
    };

    const groupGuestsByStage = (filteredGuests: Guest[]) => {
        return {
            invited: filteredGuests.filter(g => g.assimilationStage === 'invited'),
            attended: filteredGuests.filter(g => g.assimilationStage === 'attended'),
            discipled: filteredGuests.filter(g => g.assimilationStage === 'discipled'),
            joined: filteredGuests.filter(g => g.assimilationStage === 'joined'),
        };
    };

    const calculateZoneStats = (zoneGuests: Guest[]) => {
        const totalGuests = zoneGuests.length;
        const groupedGuests = groupGuestsByStage(zoneGuests);
        const conversionRate = totalGuests > 0 ? Math.round((groupedGuests.joined.length / totalGuests) * 100) : 0;
        const activeThisWeek = zoneGuests.filter(g => {
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            return g.lastContact ? new Date(g.lastContact) >= weekAgo : false;
        }).length;

        return {
            totalGuests,
            conversionRate,
            activeThisWeek,
        };
    };

    const filteredGuests = filterGuests();
    const groupedGuests = groupGuestsByStage(filteredGuests);
    const stats = calculateZoneStats(filteredGuests);

    return {
        filteredGuests,
        groupedGuests,
        stats,
    };
}
