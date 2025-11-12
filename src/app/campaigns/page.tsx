'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { fetchCampaignsStart, fetchCampaignsSuccess, fetchCampaignsFailure, deleteCampaign } from '@/store/slices/campaignsSlice';
import { campaignsAPI } from '@/services/api';
import Navbar from '@/components/Navbar/Navbar';
import styles from './campaigns.module.scss';

export default function CampaignsPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { campaigns, loading, error } = useAppSelector((state) => state.campaigns);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
      return;
    }
    loadCampaigns();
  }, [isAuthenticated, router]);

  const loadCampaigns = async () => {
    try {
      dispatch(fetchCampaignsStart());
      const data = await campaignsAPI.getAll();
      dispatch(fetchCampaignsSuccess(data));
    } catch (error: any) {
      dispatch(fetchCampaignsFailure(error.message));
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this campaign?')) return;

    try {
      await campaignsAPI.delete(id);
      dispatch(deleteCampaign(id));
    } catch (error) {
      alert('Failed to delete campaign');
    }
  };

  const handleStart = async (id: number) => {
    try {
      await campaignsAPI.start(id);
      loadCampaigns();
    } catch (error) {
      alert('Failed to start campaign');
    }
  };

  const handlePause = async (id: number) => {
    try {
      await campaignsAPI.pause(id);
      loadCampaigns();
    } catch (error) {
      alert('Failed to pause campaign');
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
            <button onClick={() => router.push('/campaigns/new')} className={styles.createBtn}>
              ➕ Create Campaign
            </button>
          </div>

          {error && <div className="error-message">{error}</div>}

          {loading ? (
            <div className="loading">Loading campaigns...</div>
          ) : campaigns.length === 0 ? (
            <div className={styles.emptyState}>
              <p>No campaigns yet. Create your first campaign to get started!</p>
              <button onClick={() => router.push('/campaigns/new')} className={styles.createBtn}>
                Create Campaign
              </button>
            </div>
          ) : (
            <div className={styles.campaignsList}>
              {campaigns.map((campaign) => (
                <div key={campaign.id} className={styles.campaignCard}>
                  <div className={styles.campaignHeader}>
                    <h3>{campaign.name}</h3>
                    <span className={`${styles.badge} ${styles[campaign.status]}`}>
                      {campaign.status}
                    </span>
                  </div>
                  <p className={styles.subject}>{campaign.subject}</p>
                  <p className={styles.prospects}>Prospects: {campaign.total_prospects || 0}</p>
                  <div className={styles.actions}>
                    <button onClick={() => router.push(`/campaigns/${campaign.id}/edit`)} className={styles.editBtn}>
                      Edit
                    </button>
                    {campaign.status === 'draft' || campaign.status === 'paused' ? (
                      <button onClick={() => handleStart(campaign.id)} className={styles.startBtn}>
                        Start
                      </button>
                    ) : campaign.status === 'active' ? (
                      <button onClick={() => handlePause(campaign.id)} className={styles.pauseBtn}>
                        Pause
                      </button>
                    ) : null}
                    <button onClick={() => handleDelete(campaign.id)} className={styles.deleteBtn}>
                      Delete
                    </button>
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
