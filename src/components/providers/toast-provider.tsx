import { Toaster } from 'sonner';

export function ToastProvider() {
    return (
        <Toaster
            position="top-right"
            richColors
            toastOptions={{
                style: {
                    background: 'white',
                    color: 'black',
                },
                className: 'shadow-lg',
            }}
        />
    );
}
