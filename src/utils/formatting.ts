import { MilestoneStatus } from '../store/types';

export const formatDateDiff = (date: Date) => {
    const today = new Date();
    const diffTime = today.getTime() - date.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    return `${diffDays} days ago`;
};

export const calculateProgress = (milestones: { status: MilestoneStatus }[]) => {
    const completed = milestones.filter(m => m.status === MilestoneStatus.COMPLETED).length;
    return Math.round((completed / milestones.length) * 100);
};

export const getStageColors = (stage: string) => {
    const colors = {
        invited: {
            bg: 'bg-blue-100',
            text: 'text-blue-800',
            border: 'border-blue-200',
            bgLight: 'bg-blue-50',
        },
        attended: {
            bg: 'bg-green-100',
            text: 'text-green-800',
            border: 'border-green-200',
            bgLight: 'bg-green-50',
        },
        discipled: {
            bg: 'bg-purple-100',
            text: 'text-purple-800',
            border: 'border-purple-200',
            bgLight: 'bg-purple-50',
        },
        joined: {
            bg: 'bg-gray-100',
            text: 'text-gray-800',
            border: 'border-gray-200',
            bgLight: 'bg-gray-50',
        },
    };

    return colors[stage as keyof typeof colors] || colors.invited;
};

export const getStageText = (stage: string) => {
    const texts = {
        invited: 'Invited',
        attended: 'Attended',
        discipled: 'Discipled',
        joined: 'Joined Workforce',
    };

    return texts[stage as keyof typeof texts] || stage;
};
