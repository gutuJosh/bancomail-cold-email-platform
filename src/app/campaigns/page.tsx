"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import {
  fetchCampaignsStart,
  fetchCampaignsSuccess,
  fetchCampaignsFailure,
  deleteCampaign,
} from "@/store/slices/campaignsSlice";
import { campaignsAPI } from "@/services/api";
import Navbar from "@/components/Navbar/Navbar";
import CampaignBox from "@/components/campaigns/campaign-box";
import styles from "./campaigns.module.scss";

export default function CampaignsPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated, apiKey } = useAppSelector((state) => state.auth);
  const { campaigns, loading, error } = useAppSelector(
    (state) => state.campaigns
  );

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/");
      return;
    }
    loadCampaigns();
  }, [isAuthenticated, router]);

  const loadCampaigns = async () => {
    try {
      dispatch(fetchCampaignsStart());
      const data = await campaignsAPI.getAll(apiKey as string);
      //console.log("CAMPAIGNS---->", data);
      dispatch(fetchCampaignsSuccess(data));
    } catch (error: any) {
      dispatch(fetchCampaignsFailure(error.message));
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this campaign?")) return;

    try {
      const request = await campaignsAPI.delete(id, apiKey as string);
      const { status } = request;
      if (status === "OK") {
        dispatch(deleteCampaign(id));
      }
      return status;
    } catch (error) {
      alert("Failed to delete campaign");
    }
  };

  const handleStart = async (id: number) => {
    try {
      const request = await campaignsAPI.start(id, apiKey as string);
      return request.status;
      //loadCampaigns();
    } catch (error) {
      alert("Failed to start campaign");
    }
  };

  const handlePause = async (id: number) => {
    try {
      const request = await campaignsAPI.pause(id, apiKey as string);
      return request.status;
      //loadCampaigns();
    } catch (error) {
      alert("Failed to pause campaign");
    }
  };

  if (!isAuthenticated) return null;

  return (
    <>
      <Navbar />
      <div className={styles.campaignsPage}>
        <div className="container">
          <div className={styles.header}>
            <h1 className="page-title">Campaigns</h1>
            <button
              onClick={() => router.push("/campaigns/new")}
              className={styles.createBtn}
            >
              ➕ Create Campaign
            </button>
          </div>

          {error && <div className="error-message">{error}</div>}

          {loading ? (
            <div className="loading">Loading campaigns...</div>
          ) : campaigns.length === 0 ? (
            <div className={styles.emptyState}>
              <p>
                No campaigns yet. Create your first campaign to get started!
              </p>
              <button
                onClick={() => router.push("/campaigns/new")}
                className={styles.createBtn}
              >
                Create Campaign
              </button>
            </div>
          ) : (
            <div className={styles.campaignsList}>
              {campaigns.map((campaign) => (
                <CampaignBox
                  styles={styles}
                  key={campaign.id}
                  campaign={campaign}
                  handleEdit={(id) => router.push(`/campaigns/${id}/edit`)}
                  handleDelete={(id) => handleDelete(id)}
                  handlePause={(id) => handlePause(id)}
                  handleStart={(id) => handleStart(id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
