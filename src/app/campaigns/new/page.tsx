'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { addCampaign } from '@/store/slices/campaignsSlice';
import { campaignsAPI } from '@/services/api';
import Navbar from '@/components/Navbar/Navbar';
import styles from './new.module.scss';

interface CampaignFormData {
  name: string;
  subject: string;
  content: string;
}

export default function NewCampaignPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { register, handleSubmit, formState: { errors } } = useForm<CampaignFormData>();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  const onSubmit = async (data: CampaignFormData) => {
    try {
      const newCampaign = await campaignsAPI.create(data);
      dispatch(addCampaign(newCampaign));
      router.push('/campaigns');
    } catch (error) {
      alert('Failed to create campaign');
    }
  };

  if (!isAuthenticated) return null;

  return (
    <>
      <Navbar />
      <div className={styles.newCampaignPage}>
        <div className="container">
          <h1 className="page-title">Create New Campaign</h1>

          <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="name">Campaign Name *</label>
              <input
                id="name"
                type="text"
                placeholder="Enter campaign name"
                {...register('name', { required: 'Campaign name is required' })}
                className={styles.input}
              />
              {errors.name && <span className={styles.error}>{errors.name.message}</span>}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="subject">Email Subject *</label>
              <input
                id="subject"
                type="text"
                placeholder="Enter email subject"
                {...register('subject', { required: 'Subject is required' })}
                className={styles.input}
              />
              {errors.subject && <span className={styles.error}>{errors.subject.message}</span>}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="content">Email Content *</label>
              <textarea
                id="content"
                rows={10}
                placeholder="Enter email content..."
                {...register('content', { required: 'Content is required' })}
                className={styles.textarea}
              />
              {errors.content && <span className={styles.error}>{errors.content.message}</span>}
            </div>

            <div className={styles.actions}>
              <button type="button" onClick={() => router.back()} className={styles.cancelBtn}>
                Cancel
              </button>
              <button type="submit" className={styles.submitBtn}>
                Create Campaign
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
