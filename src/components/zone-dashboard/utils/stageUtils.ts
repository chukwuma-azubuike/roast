import { Guest } from '../../../store/types';

export const getStageColor = (stage: Guest['assimilationStage'], type: 'bg' | 'badge' | 'card' = 'bg') => {
    const colors = {
        invited: {
            bg: 'bg-blue-500',
            badge: 'bg-blue-100 text-blue-800',
            card: 'border-blue-200 bg-blue-50',
        },
        attended: {
            bg: 'bg-green-500',
            badge: 'bg-green-100 text-green-800',
            card: 'border-green-200 bg-green-50',
        },
        discipled: {
            bg: 'bg-purple-500',
            badge: 'bg-purple-100 text-purple-800',
            card: 'border-purple-200 bg-purple-50',
        },
        joined: {
            bg: 'bg-gray-500',
            badge: 'bg-gray-100 text-gray-800',
            card: 'border-gray-200 bg-gray-50',
        },
    };

    return colors[stage][type];
};

export const getStageText = (stage: Guest['assimilationStage']) => {
    const texts = {
        invited: 'Invited',
        attended: 'Attended',
        discipled: 'Discipled',
        joined: 'Joined Workforce',
    };

    return texts[stage];
};
