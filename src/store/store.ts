import { configureStore } from '@reduxjs/toolkit';
import { crmApi } from './api';

export const store = configureStore({
    reducer: {
        [crmApi.reducerPath]: crmApi.reducer,
        // ... other reducers
    },
    middleware: getDefaultMiddleware => getDefaultMiddleware().concat(crmApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
