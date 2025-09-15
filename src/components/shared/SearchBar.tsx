import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '../ui/input';

interface SearchBarProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
}

export function SearchBar({ value, onChange, placeholder = 'Search...', className = '' }: SearchBarProps) {
    return (
        <div className={`relative ${className}`}>
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <Input placeholder={placeholder} value={value} onChange={e => onChange(e.target.value)} className="pl-10" />
        </div>
    );
}
