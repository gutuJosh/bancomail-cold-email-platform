import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface CampaignStats {
  id: number;
  invalid: number;
  sent: number;
  replied: number;
  interested: number;
  not_interested: number;
  maybe_later: number;
  opened: number;
  delivery: number;
  bounced: number;
  optout: number;
}

interface StatsState {
  stats: CampaignStats[];
  loading: boolean;
  error: string | null;
}

const initialState: StatsState = {
  stats: [],
  loading: false,
  error: null,
};

const statsSlice = createSlice({
  name: "stats",
  initialState,
  reducers: {
    fetchStatsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchStatsSuccess: (state, action: PayloadAction<CampaignStats[]>) => {
      state.stats = action.payload;
      state.loading = false;
    },
    fetchStatsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { fetchStatsStart, fetchStatsSuccess, fetchStatsFailure } =
  statsSlice.actions;
export default statsSlice.reducer;
