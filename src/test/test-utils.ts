import { render as rtlRender } from '@testing-library/react';
import { configureStore, Store } from '@reduxjs/toolkit';
import { PropsWithChildren } from 'react';
import { Provider } from 'react-redux';
import { crmApi } from '../store/api';

type RootState = ReturnType<typeof createStore>['getState'];
type AppStore = ReturnType<typeof createStore>;

function createStore(preloadedState = {}) {
    return configureStore({
        reducer: {
            [crmApi.reducerPath]: crmApi.reducer,
        },
        middleware: getDefaultMiddleware => getDefaultMiddleware().concat(crmApi.middleware),
        preloadedState,
    });
}

interface RenderOptions {
    preloadedState?: Partial<RootState>;
    store?: AppStore;
}

interface Props {
    children: React.ReactNode;
    store?: AppStore;
}

function Wrapper({ children, store = createStore() }: Props) {
    return <Provider store={store}>{children}</Provider>;
}

function render(ui: React.ReactElement, { store, ...options }: RenderOptions = {}) {
    return {
        ...rtlRender(ui, {
            wrapper: props => <Wrapper {...props} store={store} />,
            ...options,
        }),
        store: store || createStore(),
    };
}

export * from '@testing-library/react';
export { render, createStore };
