'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { fetchProspectsStart, fetchProspectsSuccess, fetchProspectsFailure } from '@/store/slices/prospectsSlice';
import { prospectsAPI } from '@/services/api';
import Navbar from '@/components/Navbar/Navbar';
import styles from './prospects.module.scss';

export default function ProspectsPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { prospects, loading, error } = useAppSelector((state) => state.prospects);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
      return;
    }
    loadProspects();
  }, [isAuthenticated, router]);

  const loadProspects = async () => {
    try {
      dispatch(fetchProspectsStart());
      const data = await prospectsAPI.getAll();
      dispatch(fetchProspectsSuccess(data));
    } catch (error: any) {
      dispatch(fetchProspectsFailure(error.message));
    }
  };

  if (!isAuthenticated) return null;

  return (
    <>
      <Navbar />
      <div className={styles.prospectsPage}>
        <div className="container">
          <div className={styles.header}>
            <h1 className="page-title">Prospects</h1>
            <button onClick={() => router.push('/prospects/upload')} className={styles.uploadBtn}>
              📤 Upload Prospects
            </button>
          </div>

          {error && <div className="error-message">{error}</div>}

          {loading ? (
            <div className="loading">Loading prospects...</div>
          ) : prospects.length === 0 ? (
            <div className={styles.emptyState}>
              <p>No prospects yet. Upload your first CSV file to get started!</p>
              <button onClick={() => router.push('/prospects/upload')} className={styles.uploadBtn}>
                Upload Prospects
              </button>
            </div>
          ) : (
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Email</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Company</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {prospects.map((prospect) => (
                    <tr key={prospect.id}>
                      <td>{prospect.email}</td>
                      <td>{prospect.first_name}</td>
                      <td>{prospect.last_name}</td>
                      <td>{prospect.company || '-'}</td>
                      <td>
                        <span className={`${styles.badge} ${styles[prospect.status]}`}>
                          {prospect.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
