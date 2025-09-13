import { cleanup, render } from '@testing-library/react';
import { afterEach } from '@jest/globals';

afterEach(() => {
    cleanup();
});

function renderComponent(component: React.ReactElement) {
    return render(component);
}

export * from '@testing-library/react';
export { renderComponent as render };
