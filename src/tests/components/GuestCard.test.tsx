import { render, screen, fireEvent } from '@testing-library/react';
import { GuestCard } from '../../components/guest-dashboard/GuestCard';
import { Guest, AssimilationStage, MilestoneStatus } from '../../store/types';

const mockGuest: Guest = {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    phone: '+1234567890',
    assimilationStage: AssimilationStage.INVITED,
    createdAt: new Date().toISOString(),
    lastContact: new Date().toISOString(),
    milestones: [
        {
            id: 'm1',
            title: 'Initial Contact',
            status: MilestoneStatus.COMPLETED,
            completedAt: new Date().toISOString(),
        },
        {
            id: 'm2',
            title: 'First Service',
            status: MilestoneStatus.PENDING,
            completedAt: null,
        },
    ],
    nextAction: 'Follow up call',
};

describe('GuestCard', () => {
    const mockViewGuest = jest.fn();
    const mockDragStart = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders guest information correctly', () => {
        render(<GuestCard guest={mockGuest} onViewGuest={mockViewGuest} onDragStart={mockDragStart} />);

        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.getByText('+1234567890')).toBeInTheDocument();
        expect(screen.getByText('50% complete')).toBeInTheDocument();
        expect(screen.getByText('Follow up call')).toBeInTheDocument();
    });

    it('calls onViewGuest when clicking View Profile', () => {
        render(<GuestCard guest={mockGuest} onViewGuest={mockViewGuest} onDragStart={mockDragStart} />);

        fireEvent.click(screen.getByText('View Profile'));
        expect(mockViewGuest).toHaveBeenCalledWith(mockGuest.id);
    });

    it('calls onDragStart when dragging starts', () => {
        render(<GuestCard guest={mockGuest} onViewGuest={mockViewGuest} onDragStart={mockDragStart} />);

        const card = screen.getByRole('article');
        fireEvent.dragStart(card);
        expect(mockDragStart).toHaveBeenCalledWith(expect.any(Object), mockGuest.id);
    });

    it('opens phone app when clicking call button', () => {
        const mockOpen = jest.fn();
        window.open = mockOpen;

        render(<GuestCard guest={mockGuest} onViewGuest={mockViewGuest} onDragStart={mockDragStart} />);

        fireEvent.click(screen.getByLabelText('Call'));
        expect(mockOpen).toHaveBeenCalledWith('tel:+1234567890', '_self');
    });

    it('opens WhatsApp when clicking WhatsApp button', () => {
        const mockOpen = jest.fn();
        window.open = mockOpen;

        render(<GuestCard guest={mockGuest} onViewGuest={mockViewGuest} onDragStart={mockDragStart} />);

        fireEvent.click(screen.getByLabelText('WhatsApp'));
        expect(mockOpen).toHaveBeenCalledWith('https://wa.me/1234567890', '_blank');
    });
});
