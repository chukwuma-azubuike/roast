import React from 'react';

interface ProgressBarProps {
    progress: number;
    className?: string;
    barClassName?: string;
    showLabel?: boolean;
}

export function ProgressBar({ progress, className = '', barClassName = '', showLabel = true }: ProgressBarProps) {
    return (
        <div className="space-y-2">
            {showLabel && (
                <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600">Progress</span>
                    <span className="text-gray-500">{progress}% complete</span>
                </div>
            )}
            <div className={`w-full bg-gray-200 rounded-full h-2 ${className}`}>
                <div
                    className={`bg-blue-600 h-2 rounded-full transition-all duration-300 ${barClassName}`}
                    style={{ width: `${progress}%` }}
                />
            </div>
        </div>
    );
}
