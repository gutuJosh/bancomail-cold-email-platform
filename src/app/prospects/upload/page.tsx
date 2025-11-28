'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { fetchCampaignsStart, fetchCampaignsSuccess } from '@/store/slices/campaignsSlice';
import { uploadProspectsStart, uploadProspectsSuccess, uploadProspectsFailure } from '@/store/slices/prospectsSlice';
import { campaignsAPI, prospectsAPI } from '@/services/api';
import { parseCSV, validateProspects } from '@/utils/csvParser';
import Navbar from '@/components/Navbar/Navbar';
import styles from './upload.module.scss';

export default function UploadProspectsPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated, apiKey } = useAppSelector((state) => state.auth);
  const { campaigns } = useAppSelector((state) => state.campaigns);
  const { uploadProgress } = useAppSelector((state) => state.prospects);
  const [selectedCampaign, setSelectedCampaign] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<string[]>([]);

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
      const data = await campaignsAPI.getAll(apiKey as string);
      dispatch(fetchCampaignsSuccess(data));
    } catch (error) {
      console.error('Failed to load campaigns');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setErrors([]);
    }
  };

  const handleUpload = async (event : FormEvent) => {
    event.preventDefault();
    if (!file || !selectedCampaign) {
      alert('Please select a campaign and CSV file');
      return;
    }


      dispatch(uploadProspectsStart());

      const formData = new FormData();
      formData.append('csvFile', file);
      formData.append('apiKey', apiKey as string);
      formData.append('campaignId', selectedCampaign);

      try {
        const response = await fetch('/api/prospects/upload', {
          method: 'POST',
          // DO NOT set Content-Type header; FormData does this automatically
          body: formData,
        });

        const result = await response.json();
      
        if (response.ok) {
          
          console.log(result.data);
        } else {
          console.log(response)
        }
    } catch (error:any) {
       dispatch(uploadProspectsFailure(error?.message));
    }

    return;
     /*  
      const parsed = await parseCSV(file);
     
      const { valid, errors: validationErrors } = validateProspects(parsed);
  
      if (validationErrors.length > 0) {
        setErrors(validationErrors);
        dispatch(uploadProspectsFailure('Validation errors found'));
        return;
      }

      const uploaded = await prospectsAPI.upload(apiKey as string, selectedCampaign, valid);
      dispatch(uploadProspectsSuccess(uploaded));
      
      alert(`Successfully uploaded ${valid.length} prospects!`);
      router.push('/prospects');
    } catch (error: any) {
      dispatch(uploadProspectsFailure(error.message));
      alert('Failed to upload prospects');
    }
   */
  };

  if (!isAuthenticated) return null;

  return (
    <>
      <Navbar />
      <div className={styles.uploadPage}>
        <div className="container">
          <h1 className="page-title">Upload Prospects</h1>

          <form className={styles.uploadCard} encType="multipart/form-data">
            <div className={styles.formGroup}>
              <label htmlFor="campaign">Select Campaign *</label>
              <select
                id="campaign"
                value={selectedCampaign || ''}
                onChange={(e) => setSelectedCampaign(Number(e.target.value))}
                className={styles.select}
              >
                <option value="">Choose a campaign...</option>
                {campaigns.map((campaign) => (
                  <option key={campaign.id} value={campaign.id}>
                    {campaign.name}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="file">CSV File *</label>
              <input
                id="file"
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className={styles.fileInput}
              />
              <p className={styles.hint}>
                CSV should have columns: email, first_name, last_name, company (optional)
              </p>
            </div>

            {errors.length > 0 && (
              <div className={styles.errors}>
                <h4>Validation Errors:</h4>
                <ul>
                  {errors.slice(0, 10).map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
                {errors.length > 10 && <p>...and {errors.length - 10} more errors</p>}
              </div>
            )}

            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className={styles.progress}>
                <div className={styles.progressBar} style={{ width: `${uploadProgress}%` }} />
              </div>
            )}

            <div className={styles.actions}>
              <button onClick={() => router.back()} className={styles.cancelBtn}>
                Cancel
              </button>
              <button onClick={handleUpload} className={styles.uploadBtn}>
                Upload Prospects
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
