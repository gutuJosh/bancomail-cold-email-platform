"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import {
  fetchAccountsStart,
  fetchAccountsSuccess,
  fetchAccountsFailure,
  addAccount,
  deleteAccount,
} from "@/store/slices/emailAccountsSlice";
import { emailAccountsAPI } from "@/services/api";
import Navbar from "@/components/Navbar/Navbar";
import styles from "./email-accounts.module.scss";

interface AccountFormData {
  apiKey: string;
  email: string;
  name: string;
  provider: string;
}

export default function EmailAccountsPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated, apiKey } = useAppSelector((state) => state.auth);
  const { accounts, loading, error } = useAppSelector(
    (state) => state.emailAccounts
  );
  const [showForm, setShowForm] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AccountFormData>();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/");
      return;
    }
    loadAccounts();
  }, [isAuthenticated, router]);

  const loadAccounts = async () => {
    try {
      dispatch(fetchAccountsStart());
      const data = await emailAccountsAPI.getAll(apiKey as string);
      const accounts_data = data.map((item: any) => {
        const { id, type, details } = item;
        const { email, provider, signature, from_name } = details;
        return {
          id: id,
          type: type,
          email: email,
          provider: provider,
          signature: signature,
          from_name: from_name,
        };
      });

      dispatch(fetchAccountsSuccess(accounts_data));
      console.log("----->", data);
    } catch (error: any) {
      dispatch(fetchAccountsFailure(error.message));
    }
  };

  const onSubmit = async (data: AccountFormData) => {
    try {
      const newAccount = await emailAccountsAPI.create(data);
      dispatch(addAccount(newAccount));
      reset();
      setShowForm(false);
    } catch (error) {
      alert("Failed to add email account");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to remove this email account?")) return;

    try {
      await emailAccountsAPI.delete(id);
      dispatch(deleteAccount(id));
    } catch (error) {
      alert("Failed to delete account");
    }
  };

  if (!isAuthenticated) return null;

  return (
    <>
      <Navbar />
      <div className={styles.accountsPage}>
        <div className="container">
          <div className={styles.header}>
            <h1 className="page-title">Email Accounts</h1>
            <button
              onClick={() => setShowForm(!showForm)}
              className={styles.addBtn}
            >
              {showForm ? "Cancel" : "➕ Add Account"}
            </button>
          </div>

          {showForm && (
            <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
              <div className={styles.formGroup}>
                <label htmlFor="email">Email *</label>
                <input
                  id="email"
                  type="email"
                  {...register("email", { required: "Email is required" })}
                  className={styles.input}
                />
                {errors.email && (
                  <span className={styles.error}>{errors.email.message}</span>
                )}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="name">Name *</label>
                <input
                  id="name"
                  type="text"
                  {...register("name", { required: "Name is required" })}
                  className={styles.input}
                />
                {errors.name && (
                  <span className={styles.error}>{errors.name.message}</span>
                )}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="provider">Provider *</label>
                <select
                  id="provider"
                  {...register("provider", {
                    required: "Provider is required",
                  })}
                  className={styles.input}
                >
                  <option value="">Select provider...</option>
                  <option value="gmail">Gmail</option>
                  <option value="outlook">Outlook</option>
                  <option value="custom">Custom SMTP</option>
                </select>
                {errors.provider && (
                  <span className={styles.error}>
                    {errors.provider.message}
                  </span>
                )}
              </div>

              <button type="submit" className={styles.submitBtn}>
                Add Account
              </button>
            </form>
          )}

          {error && <div className="error-message">{error}</div>}

          {loading ? (
            <div className="loading">Loading accounts...</div>
          ) : accounts.length === 0 ? (
            <div className={styles.emptyState}>
              <p>
                No email accounts configured. Add your first account to start
                sending campaigns.
              </p>
            </div>
          ) : (
            <div className={styles.accountsList}>
              {accounts.map((account) => (
                <div key={account.id} className={styles.accountCard}>
                  <div className={styles.accountInfo}>
                    <h3>{account.email}</h3>
                    <p>{account.type}</p>
                    <span className={styles.provider}>{account.provider}</span>
                  </div>
                  <div className={styles.accountActions}>
                    <span
                      className={`${styles.badge} ${styles["ACTIVE"]}`}
                      dangerouslySetInnerHTML={{ __html: account.signature }}
                    ></span>
                    <button
                      onClick={() => handleDelete(account.id)}
                      className={styles.deleteBtn}
                    >
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
