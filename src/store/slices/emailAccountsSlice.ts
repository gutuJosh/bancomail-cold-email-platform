import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface EmailAccount {
  id: number;
  email: string;
  name: string;
  provider: string;
  status: 'active' | 'inactive' | 'error';
  created_at: string;
  from_email:string;
}

interface EmailAccountsState {
  accounts: EmailAccount[];
  loading: boolean;
  error: string | null;
}

const initialState: EmailAccountsState = {
  accounts: [],
  loading: false,
  error: null,
};

const emailAccountsSlice = createSlice({
  name: 'emailAccounts',
  initialState,
  reducers: {
    fetchAccountsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchAccountsSuccess: (state, action: PayloadAction<EmailAccount[]>) => {
      state.accounts = action.payload;
      state.loading = false;
    },
    fetchAccountsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    addAccount: (state, action: PayloadAction<EmailAccount>) => {
      state.accounts.push(action.payload);
    },
    deleteAccount: (state, action: PayloadAction<number>) => {
      state.accounts = state.accounts.filter(a => a.id !== action.payload);
    },
  },
});

export const {
  fetchAccountsStart,
  fetchAccountsSuccess,
  fetchAccountsFailure,
  addAccount,
  deleteAccount,
} = emailAccountsSlice.actions;

export default emailAccountsSlice.reducer;
