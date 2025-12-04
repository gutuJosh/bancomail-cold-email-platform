import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UnknownKeyedObject } from "@/types/global";

export interface Campaign {
  id: number;
  name: string;
  subject: string;
  content: string;
  status: "DRAFT" | "STOPPED" | "PAUSED" | "COMPLETED" | "RUNNING" | "EDITED";
  created: string;
  from_email: string;
  cc: string;
  bcc: string;
  stats?: UnknownKeyedObject;
}

interface CampaignsState {
  campaigns: Campaign[];
  selectedCampaign: Campaign | null;
  loading: boolean;
  error: string | null;
}

const initialState: CampaignsState = {
  campaigns: [],
  selectedCampaign: null,
  loading: false,
  error: null,
};

const campaignsSlice = createSlice({
  name: "campaigns",
  initialState,
  reducers: {
    fetchCampaignsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchCampaignsSuccess: (state, action: PayloadAction<Campaign[]>) => {
      state.campaigns = action.payload;
      state.loading = false;
    },
    fetchCampaignsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    selectCampaign: (state, action: PayloadAction<Campaign>) => {
      state.selectedCampaign = action.payload;
    },
    addCampaign: (state, action: PayloadAction<Campaign>) => {
      state.campaigns.push(action.payload);
    },
    updateCampaign: (state, action: PayloadAction<Campaign>) => {
      const index = state.campaigns.findIndex(
        (c) => c.id === action.payload.id
      );
      if (index !== -1) {
        state.campaigns[index] = action.payload;
      }
    },
    deleteCampaign: (state, action: PayloadAction<number>) => {
      state.campaigns = state.campaigns.filter((c) => c.id !== action.payload);
    },
  },
});

export const {
  fetchCampaignsStart,
  fetchCampaignsSuccess,
  fetchCampaignsFailure,
  selectCampaign,
  addCampaign,
  updateCampaign,
  deleteCampaign,
} = campaignsSlice.actions;

export default campaignsSlice.reducer;
