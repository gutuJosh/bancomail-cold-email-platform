import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Prospect {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  company?: string;
  campaign_id?: number;
  status: 'pending' | 'sent' | 'opened' | 'replied' | 'bounced';
}

interface ProspectsState {
  prospects: Prospect[];
  loading: boolean;
  error: string | null;
  uploadProgress: number;
}

const initialState: ProspectsState = {
  prospects: [],
  loading: false,
  error: null,
  uploadProgress: 0,
};

const prospectsSlice = createSlice({
  name: 'prospects',
  initialState,
  reducers: {
    fetchProspectsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchProspectsSuccess: (state, action: PayloadAction<Prospect[]>) => {
      state.prospects = action.payload;
      state.loading = false;
    },
    fetchProspectsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    uploadProspectsStart: (state) => {
      state.loading = true;
      state.uploadProgress = 0;
      state.error = null;
    },
    uploadProspectsProgress: (state, action: PayloadAction<number>) => {
      state.uploadProgress = action.payload;
    },
    uploadProspectsSuccess: (state, action: PayloadAction<Prospect[]>) => {
      state.prospects = [...state.prospects, ...action.payload];
      state.loading = false;
      state.uploadProgress = 100;
    },
    uploadProspectsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
      state.uploadProgress = 0;
    },
  },
});

export const {
  fetchProspectsStart,
  fetchProspectsSuccess,
  fetchProspectsFailure,
  uploadProspectsStart,
  uploadProspectsProgress,
  uploadProspectsSuccess,
  uploadProspectsFailure,
} = prospectsSlice.actions;

export default prospectsSlice.reducer;
