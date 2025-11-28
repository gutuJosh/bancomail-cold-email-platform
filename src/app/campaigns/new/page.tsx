'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { addCampaign } from '@/store/slices/campaignsSlice';
import{  fetchAccountsStart, fetchAccountsSuccess, fetchAccountsFailure } from '@/store/slices/emailAccountsSlice';
import { campaignsAPI, emailAccountsAPI, UnknownKeyedObject } from '@/services/api';
import Navbar from '@/components/Navbar/Navbar';
import styles from './new.module.scss';

interface CampaignFormData {
  name: string;
  subject: string;
  content: string;
  email_account_ids:[],
  settings:UnknownKeyedObject,
  steps:UnknownKeyedObject
}

export default function NewCampaignPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated, apiKey } = useAppSelector((state) => state.auth);
  const { accounts, loading, error } = useAppSelector((state) => state.emailAccounts);
  const { register, handleSubmit, formState: { errors } } = useForm<CampaignFormData>();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
      return;
    }

    loadsEmailAccounts();

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

  const loadsEmailAccounts = async () => {
      try {
        dispatch(fetchAccountsStart());
        const data = await campaignsAPI.getAll(apiKey as string);
        dispatch(fetchAccountsSuccess(data));
      } catch (error: any) {
        dispatch(fetchAccountsFailure(error.message));
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
              <label htmlFor="subject">Select Email Accounts *</label>
              <select
                multiple
                id="email_account_ids"
                {...register('subject', { required: 'Subject is required' })}
                className={styles.input}
                {...register("email_account_ids", { required: true })}
                onChange={(e) => {
                  if(e.target.value.includes('new')){
                    router.push('/email-accounts?add_new=1')
                  }
                }}
              >
              {accounts?.map((item) => (
                <option key={item.id} value={item.id}>{item.from_email}</option>
              ))}

               <option value="new" className="text-blue text-underline">Create new email account</option>
              </select>
              {errors.subject && <span className={styles.error}>{errors.subject.message}</span>}
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
