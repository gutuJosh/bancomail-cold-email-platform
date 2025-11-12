'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { fetchStatsStart, fetchStatsSuccess, fetchStatsFailure } from '@/store/slices/statsSlice';
import { fetchCampaignsStart, fetchCampaignsSuccess } from '@/store/slices/campaignsSlice';
import { statsAPI, campaignsAPI } from '@/services/api';
import Navbar from '@/components/Navbar/Navbar';
import styles from './stats.module.scss';

export default function StatsPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { stats, loading, error } = useAppSelector((state) => state.stats);
  const { campaigns } = useAppSelector((state) => state.campaigns);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
      return;
    }
    loadData();
  }, [isAuthenticated, router]);

  const loadData = async () => {
    try {
      dispatch(fetchStatsStart());
      dispatch(fetchCampaignsStart());

      const [statsData, campaignsData] = await Promise.all([
        statsAPI.getCampaignStats(),
        campaignsAPI.getAll(),
      ]);

      dispatch(fetchStatsSuccess(statsData));
      dispatch(fetchCampaignsSuccess(campaignsData));
    } catch (error: any) {
      dispatch(fetchStatsFailure(error.message));
    }
  };

  const getCampaignName = (campaignId: number) => {
    const campaign = campaigns.find(c => c.id === campaignId);
    return campaign?.name || `Campaign #${campaignId}`;
  };

  if (!isAuthenticated) return null;

  return (
    <>
      <Navbar />
      <div className={styles.statsPage}>
        <div className="container">
          <h1 className="page-title">Campaign Statistics</h1>

          {error && <div className="error-message">{error}</div>}

          {loading ? (
            <div className="loading">Loading statistics...</div>
          ) : stats.length === 0 ? (
            <div className={styles.emptyState}>
              <p>No statistics available yet. Start a campaign to see performance metrics.</p>
            </div>
          ) : (
            <div className={styles.statsList}>
              {stats.map((stat) => (
                <div key={stat.campaign_id} className={styles.statCard}>
                  <h3>{getCampaignName(stat.campaign_id)}</h3>
                  
                  <div className={styles.metricsGrid}>
                    <div className={styles.metric}>
                      <span className={styles.label}>Sent</span>
                      <span className={styles.value}>{stat.total_sent}</span>
                    </div>
                    <div className={styles.metric}>
                      <span className={styles.label}>Opened</span>
                      <span className={styles.value}>{stat.total_opened}</span>
                    </div>
                    <div className={styles.metric}>
                      <span className={styles.label}>Replied</span>
                      <span className={styles.value}>{stat.total_replied}</span>
                    </div>
                    <div className={styles.metric}>
                      <span className={styles.label}>Bounced</span>
                      <span className={styles.value}>{stat.total_bounced}</span>
                    </div>
                  </div>

                  <div className={styles.ratesGrid}>
                    <div className={styles.rate}>
                      <span className={styles.rateLabel}>Open Rate</span>
                      <div className={styles.rateBar}>
                        <div 
                          className={styles.rateFill} 
                          style={{ width: `${stat.open_rate}%`, backgroundColor: '#3b82f6' }}
                        />
                      </div>
                      <span className={styles.rateValue}>{stat.open_rate.toFixed(1)}%</span>
                    </div>

                    <div className={styles.rate}>
                      <span className={styles.rateLabel}>Reply Rate</span>
                      <div className={styles.rateBar}>
                        <div 
                          className={styles.rateFill} 
                          style={{ width: `${stat.reply_rate}%`, backgroundColor: '#10b981' }}
                        />
                      </div>
                      <span className={styles.rateValue}>{stat.reply_rate.toFixed(1)}%</span>
                    </div>

                    <div className={styles.rate}>
                      <span className={styles.rateLabel}>Bounce Rate</span>
                      <div className={styles.rateBar}>
                        <div 
                          className={styles.rateFill} 
                          style={{ width: `${stat.bounce_rate}%`, backgroundColor: '#ef4444' }}
                        />
                      </div>
                      <span className={styles.rateValue}>{stat.bounce_rate.toFixed(1)}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
