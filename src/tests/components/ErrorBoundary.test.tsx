import React from 'react';
import { ErrorBoundary } from '../../components/ui/error-boundary';

const ErrorComponent = () => {
    throw new Error('Test error');
};

describe('ErrorBoundary', () => {
    const consoleError = console.error;
    beforeAll(() => {
        console.error = jest.fn();
    });

    afterAll(() => {
        console.error = consoleError;
    });

    it('renders children when there is no error', () => {
        const wrapper = render(
            <ErrorBoundary>
                <div>Test content</div>
            </ErrorBoundary>
        );
        expect(wrapper.getByText('Test content')).toBeInTheDocument();
    });

    it('renders error UI when an error occurs', () => {
        const wrapper = render(
            <ErrorBoundary>
                <ErrorComponent />
            </ErrorBoundary>
        );

        expect(wrapper.getByText('Something went wrong')).toBeInTheDocument();
        expect(wrapper.getByText('Test error')).toBeInTheDocument();
        expect(wrapper.getByRole('button', { name: 'Retry' })).toBeInTheDocument();
    });

    it('resets error state when retry button is clicked', () => {
        const wrapper = render(
            <ErrorBoundary>
                <div>Content</div>
            </ErrorBoundary>
        );

        // Force an error
        const error = new Error('Test error');
        wrapper.rerender(
            <ErrorBoundary>
                <ErrorComponent />
            </ErrorBoundary>
        );

        // Click retry
        fireEvent.click(wrapper.getByRole('button', { name: 'Retry' }));

        // Error should be cleared
        expect(wrapper.queryByText('Something went wrong')).not.toBeInTheDocument();
    });
});
