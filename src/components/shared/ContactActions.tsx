import React, { memo } from 'react';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Button } from '../ui/button';
import { Phone, MessageCircle } from 'lucide-react';

interface ContactActionsProps {
    name: string;
    phone: string;
    onPhoneClick?: () => void;
    onMessageClick?: () => void;
}

export const ContactActions = memo(({ name, phone, onPhoneClick, onMessageClick }: ContactActionsProps) => {
    const handlePhoneClick = () => {
        onPhoneClick?.() || window.open(`tel:${phone}`, '_self');
    };

    const handleMessageClick = () => {
        onMessageClick?.() || window.open(`https://wa.me/${phone.replace(/\D/g, '')}`, '_blank');
    };

    return (
        <div className="flex items-center space-x-3">
            <Avatar className="w-8 h-8">
                <AvatarFallback className="text-xs">
                    {name
                        .split(' ')
                        .map(n => n[0])
                        .join('')}
                </AvatarFallback>
            </Avatar>
            <div>
                <div className="font-medium">{name}</div>
                <div className="text-sm text-gray-500">{phone}</div>
                <div className="flex space-x-1 mt-1">
                    <Button size="sm" variant="outline" className="h-6 px-2" onClick={handlePhoneClick}>
                        <Phone className="w-3 h-3" />
                    </Button>
                    <Button size="sm" variant="outline" className="h-6 px-2" onClick={handleMessageClick}>
                        <MessageCircle className="w-3 h-3" />
                    </Button>
                </div>
            </div>
        </div>
    );
});
