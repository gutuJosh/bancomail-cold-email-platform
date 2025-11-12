import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import campaignsReducer from './slices/campaignsSlice';
import prospectsReducer from './slices/prospectsSlice';
import statsReducer from './slices/statsSlice';
import emailAccountsReducer from './slices/emailAccountsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    campaigns: campaignsReducer,
    prospects: prospectsReducer,
    stats: statsReducer,
    emailAccounts: emailAccountsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
