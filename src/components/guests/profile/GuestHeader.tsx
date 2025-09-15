import React from 'react';
import { Avatar, AvatarFallback } from '../../ui/avatar';
import { Badge } from '../../ui/badge';
import { Progress } from '../../ui/progress';
import { Card, CardContent } from '../../ui/card';
import { Phone, MessageCircle, MapPin, Calendar } from 'lucide-react';
import { Button } from '../../ui/button';
import { Guest } from '../../../store/types';

interface GuestHeaderProps {
    guest: Guest;
    stageColor: string;
    progressPercentage: number;
    onCall: () => void;
    onWhatsApp: () => void;
}

export function GuestHeader({ guest, stageColor, progressPercentage, onCall, onWhatsApp }: GuestHeaderProps) {
    return (
        <Card className="mb-6">
            <CardContent className="p-6">
                <div className="flex items-start space-x-4 mb-4">
                    <Avatar className="w-16 h-16">
                        <AvatarFallback className="text-lg">
                            {guest.name
                                .split(' ')
                                .map(n => n[0])
                                .join('')}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold mb-2">{guest.name}</h1>
                        <div className="flex items-center space-x-2 mb-2">
                            <Badge variant="secondary" className={stageColor}>
                                {guest.assimilationStage.charAt(0).toUpperCase() + guest.assimilationStage.slice(1)}
                            </Badge>
                            <span className="text-sm text-gray-500">{progressPercentage}% complete</span>
                        </div>
                        <Progress value={progressPercentage} className="mb-3" />
                    </div>
                </div>

                {/* Contact Actions */}
                <div className="flex space-x-2 mb-4">
                    <Button className="flex-1" onClick={onCall}>
                        <Phone className="w-4 h-4 mr-2" />
                        Call
                    </Button>
                    <Button variant="outline" className="flex-1" onClick={onWhatsApp}>
                        <MessageCircle className="w-4 h-4 mr-2" />
                        WhatsApp
                    </Button>
                </div>

                {/* Contact Details */}
                <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4 text-gray-500" />
                        <span>{guest.phone}</span>
                    </div>
                    {guest.address && (
                        <div className="flex items-start space-x-2">
                            <MapPin className="w-4 h-4 text-gray-500 mt-0.5" />
                            <span className="text-sm">{guest.address}</span>
                        </div>
                    )}
                    <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span className="text-sm">Added {new Date(guest.createdAt).toLocaleString()}</span>
                    </div>
                </div>

                {/* Prayer Request */}
                {guest.prayerRequest && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                        <h4 className="font-medium text-blue-900 mb-1">Prayer Request</h4>
                        <p className="text-sm text-blue-800">{guest.prayerRequest}</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
