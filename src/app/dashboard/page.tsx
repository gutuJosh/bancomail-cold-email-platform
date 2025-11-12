'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { fetchCampaignsStart, fetchCampaignsSuccess, fetchCampaignsFailure } from '@/store/slices/campaignsSlice';
import { fetchStatsStart, fetchStatsSuccess, fetchStatsFailure } from '@/store/slices/statsSlice';
import { campaignsAPI, statsAPI } from '@/services/api';
import Navbar from '@/components/Navbar/Navbar';
import styles from './dashboard.module.scss';

export default function Dashboard() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { campaigns, loading: campaignsLoading } = useAppSelector((state) => state.campaigns);
  const { stats, loading: statsLoading } = useAppSelector((state) => state.stats);
  const [overview, setOverview] = useState({
    totalCampaigns: 0,
    activeCampaigns: 0,
    totalSent: 0,
    totalReplies: 0,
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
      return;
    }

    loadData();
  }, [isAuthenticated, router]);

  useEffect(() => {
    const totalCampaigns = campaigns.length;
    const activeCampaigns = campaigns.filter(c => c.status === 'active').length;
    const totalSent = stats.reduce((sum, s) => sum + s.total_sent, 0);
    const totalReplies = stats.reduce((sum, s) => sum + s.total_replied, 0);

    setOverview({ totalCampaigns, activeCampaigns, totalSent, totalReplies });
  }, [campaigns, stats]);

  const loadData = async () => {
    try {
      dispatch(fetchCampaignsStart());
      dispatch(fetchStatsStart());

      const [campaignsData, statsData] = await Promise.all([
        campaignsAPI.getAll(),
        statsAPI.getCampaignStats(),
      ]);

      dispatch(fetchCampaignsSuccess(campaignsData));
      dispatch(fetchStatsSuccess(statsData));
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
                <h3>Emails Sent</h3>
                <p className={styles.statNumber}>{overview.totalSent}</p>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIcon}>💬</div>
              <div className={styles.statContent}>
                <h3>Total Replies</h3>
                <p className={styles.statNumber}>{overview.totalReplies}</p>
              </div>
            </div>
          </div>

          <div className={styles.quickActions}>
            <h2>Quick Actions</h2>
            <div className={styles.actionButtons}>
              <button onClick={() => router.push('/campaigns/new')} className={styles.actionBtn}>
                ➕ Create Campaign
              </button>
              <button onClick={() => router.push('/prospects/upload')} className={styles.actionBtn}>
                📤 Upload Prospects
              </button>
              <button onClick={() => router.push('/email-accounts')} className={styles.actionBtn}>
                ✉️ Manage Email Accounts
              </button>
              <button onClick={() => router.push('/stats')} className={styles.actionBtn}>
                📈 View Statistics
              </button>
            </div>
          </div>

          {campaignsLoading || statsLoading ? (
            <div className="loading">Loading dashboard data...</div>
          ) : (
            <div className={styles.recentCampaigns}>
              <h2>Recent Campaigns</h2>
              {campaigns.length === 0 ? (
                <p className={styles.noCampaigns}>No campaigns yet. Create your first campaign to get started!</p>
              ) : (
                <div className={styles.campaignsList}>
                  {campaigns.slice(0, 5).map((campaign) => (
                    <div key={campaign.id} className={styles.campaignItem}>
                      <div className={styles.campaignInfo}>
                        <h3>{campaign.name}</h3>
                        <p>{campaign.subject}</p>
                      </div>
                      <div className={styles.campaignStatus}>
                        <span className={`${styles.badge} ${styles[campaign.status]}`}>
                          {campaign.status}
                        </span>
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
