import React from 'react';
import { Label } from '../../ui/label';
import { Input } from '../../ui/input';
import { User, Phone, MapPin, MessageSquare } from 'lucide-react';

interface FormFieldProps {
    id: string;
    label: string;
    icon: typeof User | typeof Phone | typeof MapPin | typeof MessageSquare;
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
    required?: boolean;
    type?: string;
    autoComplete?: string;
}

export function FormField({
    id,
    label,
    icon: Icon,
    value,
    onChange,
    placeholder,
    required = false,
    type = 'text',
    autoComplete,
}: FormFieldProps) {
    return (
        <div className="space-y-2">
            <Label htmlFor={id} className="flex items-center space-x-1">
                <Icon className="w-4 h-4" />
                <span>
                    {label}
                    {required && ' *'}
                </span>
            </Label>
            <Input
                id={id}
                type={type}
                value={value}
                onChange={e => onChange(e.target.value)}
                placeholder={placeholder}
                required={required}
                autoComplete={autoComplete}
            />
        </div>
    );
}
