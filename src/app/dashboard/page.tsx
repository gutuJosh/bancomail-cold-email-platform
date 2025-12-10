"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import {
  fetchCampaignsStart,
  fetchCampaignsSuccess,
  fetchCampaignsFailure,
} from "@/store/slices/campaignsSlice";
import {
  fetchStatsStart,
  fetchStatsSuccess,
  fetchStatsFailure,
} from "@/store/slices/statsSlice";
import { campaignsAPI, statsAPI } from "@/services/api";
import Navbar from "@/components/Navbar/Navbar";
import styles from "./dashboard.module.scss";

export default function Dashboard() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated, apiKey } = useAppSelector((state) => state.auth);
  const { campaigns, loading } = useAppSelector((state) => state.campaigns);
  //const { stats, loading: statsLoading } = useAppSelector((state) => state.stats);

  const [overview, setOverview] = useState({
    totalCampaigns: 0,
    activeCampaigns: 0,
    totalCompleated: 0,
    totalDraft: 0,
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/");
      return;
    }

    loadData();
  }, [isAuthenticated, router]);

  useEffect(() => {
    const totalCampaigns = campaigns.length;
    const activeCampaigns = campaigns.filter(
      (c) => c.status === "RUNNING"
    ).length;
    const totalCompleated = campaigns.filter(
      (c) => c.status === "COMPLETED"
    ).length;

    const totalDraft = campaigns.filter((c) => c.status === "DRAFT").length;
    /*
    const totalSent =
      totalCompleated > 0
        ? campaigns.filter(
            (c) => c.stats !== undefined && c?.stats?.delivery !== 0
          ).length
        : 0;
    const totalReplies =
      totalCompleated > 0
        ? campaigns.filter(
            (c) => c.stats !== undefined && c?.stats?.replied !== 0
          ).length
        : 0;
    */
    setOverview({
      totalCampaigns,
      activeCampaigns,
      totalCompleated,
      totalDraft,
    });
  }, [campaigns]);

  const loadData = async () => {
    try {
      dispatch(fetchCampaignsStart());
      dispatch(fetchStatsStart());

      const [campaignsData /*statsData*/] = await Promise.all([
        campaignsAPI.getAll(apiKey as string),
        //statsAPI.getCampaignStats(apiKey as string),
      ]);

      console.log("campaignsData--->", campaignsData);

      dispatch(fetchCampaignsSuccess(campaignsData));
      //dispatch(fetchStatsSuccess(statsData));
    } catch (error: any) {
      dispatch(fetchCampaignsFailure(error.message));
      dispatch(fetchStatsFailure(error.message));
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <Navbar />
      <div className={styles.dashboard}>
        <div className="container">
          <h1 className="page-title">Dashboard</h1>

          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>📊</div>
              <div className={styles.statContent}>
                <h3>Total Campaigns</h3>
                <p className={styles.statNumber}>{overview.totalCampaigns}</p>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIcon}>▶️</div>
              <div className={styles.statContent}>
                <h3>Active Campaigns</h3>
                <p className={styles.statNumber}>{overview.activeCampaigns}</p>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIcon}>📧</div>
              <div className={styles.statContent}>
                <h3>Compleated Campaigns</h3>
                <p className={styles.statNumber}>{overview.totalCompleated}</p>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIcon}>💬</div>
              <div className={styles.statContent}>
                <h3>Draft Campaigns</h3>
                <p className={styles.statNumber}>{overview.totalDraft}</p>
              </div>
            </div>
          </div>

          <div className={styles.quickActions}>
            <h2>Quick Actions</h2>
            <div className={styles.actionButtons}>
              <button
                onClick={() => router.push("/campaigns/new")}
                className={styles.actionBtn}
              >
                ➕ Create Campaign
              </button>
              <button
                onClick={() => router.push("/prospects/upload")}
                className={styles.actionBtn}
              >
                📤 Upload Prospects
              </button>
              <button
                onClick={() => router.push("/email-accounts")}
                className={styles.actionBtn}
              >
                ✉️ Manage Email Accounts
              </button>
              <button
                onClick={() => router.push("/inbox")}
                className={styles.actionBtn}
              >
                📈 Inbox
              </button>
            </div>
          </div>

          {loading ? (
            <div className="loading">Loading dashboard data...</div>
          ) : (
            <div className={styles.recentCampaigns}>
              <h2>Recent Campaigns</h2>
              {campaigns.length === 0 ? (
                <p className={styles.noCampaigns}>
                  No campaigns yet. Create your first campaign to get started!
                </p>
              ) : (
                <div className={styles.campaignsList}>
                  {campaigns.slice(0, 5).map((campaign) => (
                    <div key={campaign.id} className={styles.campaignItem}>
                      <div className={styles.campaignInfo}>
                        <h3>{campaign.name}</h3>
                        <p>From: {campaign.from_email}</p>
                      </div>
                      <div
                        className={`${styles.campaignStatus} flex flex-align-center`}
                      >
                        <span
                          className={`${styles.badge} ${
                            styles[campaign.status]
                          }`}
                        >
                          {campaign.status}
                        </span>
                        {campaign.status === "COMPLETED" && (
                          <span
                            className={`underline ${styles.badge} ${
                              styles[campaign.status]
                            }`}
                            onClick={() =>
                              router.push(`/stats?campaign_id=${campaign.id}`)
                            }
                          >
                            VIEW STATS
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
