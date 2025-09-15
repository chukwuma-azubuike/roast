import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Guest, AssimilationStage } from '../store/types';
import { toast } from 'sonner';

interface GuestContextState {
    viewMode: 'kanban' | 'list';
    selectedGuests: string[];
    filters: {
        stage: AssimilationStage | 'all';
        searchTerm: string;
    };
}

type GuestContextAction =
    | { type: 'SET_VIEW_MODE'; payload: 'kanban' | 'list' }
    | { type: 'SET_FILTER'; payload: Partial<GuestContextState['filters']> }
    | { type: 'SELECT_GUEST'; payload: string }
    | { type: 'DESELECT_GUEST'; payload: string }
    | { type: 'CLEAR_SELECTION' };

interface GuestContextValue extends GuestContextState {
    setViewMode: (mode: 'kanban' | 'list') => void;
    setFilter: (filters: Partial<GuestContextState['filters']>) => void;
    selectGuest: (guestId: string) => void;
    deselectGuest: (guestId: string) => void;
    clearSelection: () => void;
    moveGuest: (guestId: string, newStage: AssimilationStage) => void;
}

const initialState: GuestContextState = {
    viewMode: 'kanban',
    selectedGuests: [],
    filters: {
        stage: 'all',
        searchTerm: '',
    },
};

function guestReducer(state: GuestContextState, action: GuestContextAction): GuestContextState {
    switch (action.type) {
        case 'SET_VIEW_MODE':
            return { ...state, viewMode: action.payload };
        case 'SET_FILTER':
            return {
                ...state,
                filters: { ...state.filters, ...action.payload },
            };
        case 'SELECT_GUEST':
            return {
                ...state,
                selectedGuests: [...state.selectedGuests, action.payload],
            };
        case 'DESELECT_GUEST':
            return {
                ...state,
                selectedGuests: state.selectedGuests.filter(id => id !== action.payload),
            };
        case 'CLEAR_SELECTION':
            return {
                ...state,
                selectedGuests: [],
            };
        default:
            return state;
    }
}

const GuestContext = createContext<GuestContextValue | undefined>(undefined);

export function GuestProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(guestReducer, initialState);

    const value: GuestContextValue = {
        ...state,
        setViewMode: mode => dispatch({ type: 'SET_VIEW_MODE', payload: mode }),
        setFilter: filters => dispatch({ type: 'SET_FILTER', payload: filters }),
        selectGuest: guestId => dispatch({ type: 'SELECT_GUEST', payload: guestId }),
        deselectGuest: guestId => dispatch({ type: 'DESELECT_GUEST', payload: guestId }),
        clearSelection: () => dispatch({ type: 'CLEAR_SELECTION' }),
        moveGuest: (guestId, newStage) => {
            // This would typically involve an API call
            toast.success(`Guest moved to ${newStage} stage`);
        },
    };

    return <GuestContext.Provider value={value}>{children}</GuestContext.Provider>;
}

export function useGuest() {
    const context = useContext(GuestContext);
    if (!context) {
        throw new Error('useGuest must be used within a GuestProvider');
    }
    return context;
}
