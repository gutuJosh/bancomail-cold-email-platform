'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAppDispatch } from '@/store/hooks';
import { loginStart, loginSuccess, loginFailure } from '@/store/slices/authSlice';
import { authAPI } from '@/services/api';
import styles from './Login.module.scss';

interface LoginFormData {
  apiKey: string;
}

export default function Login() {
  const dispatch = useAppDispatch();
  const [error, setError] = useState<string | null>(null);
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>();

  const onSubmit = async (data: LoginFormData) => {
    dispatch(loginStart());
    setError(null);

    try {
      const result = await authAPI.login(data.apiKey);
      dispatch(loginSuccess({
        apiKey: data.apiKey,
        user: result.user,
      }));
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Failed to authenticate. Please check your API key.';
      setError(errorMessage);
      dispatch(loginFailure(errorMessage));
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <h1 className={styles.title}>Woodpecker Email Client</h1>
        <p className={styles.subtitle}>Enter your Woodpecker API key to continue</p>
        
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="apiKey">API Key</label>
            <input
              id="apiKey"
              type="password"
              placeholder="Enter your Woodpecker API key"
              {...register('apiKey', { required: 'API key is required' })}
              className={styles.input}
            />
            {errors.apiKey && (
              <span className={styles.errorText}>{errors.apiKey.message}</span>
            )}
          </div>

          {error && (
            <div className={styles.errorMessage}>
              {error}
            </div>
          )}

          <button type="submit" className={styles.submitBtn}>
            Login
          </button>
        </form>

        <div className={styles.help}>
          <p>Don&apos;t have an API key?</p>
          <a href="https://app.woodpecker.co/settings/api" target="_blank" rel="noopener noreferrer">
            Get your API key from Woodpecker
          </a>
        </div>
      </div>
    </div>
  );
}
