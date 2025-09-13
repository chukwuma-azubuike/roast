import { Loader2 } from 'lucide-react';

interface LoadingProps {
    message?: string;
}

export function Loading({ message = 'Loading...' }: LoadingProps) {
    return (
        <div className="flex flex-col items-center justify-center p-8 text-gray-500">
            <Loader2 className="w-8 h-8 animate-spin mb-2" />
            <p>{message}</p>
        </div>
    );
}
