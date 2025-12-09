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
import { AccountFormData } from "@/types/global";
import styles from "./email-accounts.module.scss";

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
      //console.log("----->", data);
    } catch (error: any) {
      dispatch(fetchAccountsFailure(error.message));
    }
  };

  const onSubmit = async (data: AccountFormData) => {
    try {
      const newAccount = await emailAccountsAPI.create(data);
      if (newAccount.status === "OK") {
        dispatch(addAccount(newAccount.body));
        reset();
        setShowForm(false);
      } else {
        alert(
          `Failed to add email account! ${newAccount?.failed_mailboxes[0]?.error_message}`
        );
      }
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
              <h3>SMTP</h3>
              <input
                type="hidden"
                value={apiKey as string}
                id="apiKey"
                {...register("apiKey")}
              />

              <div className={styles.formGroup}>
                <label htmlFor="email">Email *</label>
                <input
                  id="smtp_email"
                  type="email"
                  {...register("smtp_email", {
                    required: "Email is required",
                  })}
                  className={styles.input}
                />
                {errors.email && (
                  <span className={styles.error}>
                    {errors.smtp_email?.message}
                  </span>
                )}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="name">Password *</label>
                <input
                  id="smtp_password"
                  type="password"
                  {...register("smtp_password", {
                    required: "SMTP Password is required",
                  })}
                  className={styles.input}
                />
                {errors.name && (
                  <span className={styles.error}>
                    {errors.smtp_password?.message}
                  </span>
                )}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="name">Server *</label>
                <input
                  id="smtp_server"
                  type="text"
                  {...register("smtp_server", {
                    required: "SMTP Server is required",
                  })}
                  className={styles.input}
                />
                {errors.name && (
                  <span className={styles.error}>
                    {errors.smtp_server?.message}
                  </span>
                )}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="name">Port *</label>
                <input
                  id="smtp_port"
                  type="number"
                  {...register("smtp_port", {
                    required: "SMTP Port is required",
                  })}
                  className={styles.input}
                />
                {errors.name && (
                  <span className={styles.error}>
                    {errors.smtp_port?.message}
                  </span>
                )}
              </div>

              <h3>IMAP</h3>

              <div className={styles.formGroup}>
                <label htmlFor="email">Email *</label>
                <input
                  id="imap_email"
                  type="email"
                  {...register("imap_email", {
                    required: "IMAP email is required",
                  })}
                  className={styles.input}
                />
                {errors.email && (
                  <span className={styles.error}>
                    {errors.imap_email?.message}
                  </span>
                )}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="name">Password *</label>
                <input
                  id="imap_password"
                  type="password"
                  {...register("imap_password", {
                    required: "IMAP Password is required",
                  })}
                  className={styles.input}
                />
                {errors.name && (
                  <span className={styles.error}>
                    {errors.imap_password?.message}
                  </span>
                )}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="name">Server *</label>
                <input
                  id="imap_server"
                  type="text"
                  {...register("imap_server", {
                    required: "IMAP Server is required",
                  })}
                  className={styles.input}
                />
                {errors.name && (
                  <span className={styles.error}>
                    {errors.imap_server?.message}
                  </span>
                )}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="name">Port *</label>
                <input
                  id="imap_port"
                  type="number"
                  {...register("imap_port", {
                    required: "IMAP Port is required",
                  })}
                  className={styles.input}
                />
                {errors.name && (
                  <span className={styles.error}>
                    {errors.imap_port?.message}
                  </span>
                )}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="sending_wait_time_from">
                  Sending wait time from*
                </label>
                <input
                  id="sending_wait_time_from"
                  type="number"
                  required={true}
                  {...register("sending_wait_time_from")}
                  className={styles.input}
                  max={9999}
                  min={10}
                />
                <p>
                  <small>
                    Minimum pause between emails in seconds (range: 10-9999)
                  </small>
                </p>
                {errors.sending_wait_time_to && (
                  <span className={styles.error}>
                    {errors.sending_wait_time_to?.message}
                  </span>
                )}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="sending_wait_time_to">
                  Sending wait time to *
                </label>
                <input
                  id="sending_wait_time_to"
                  type="number"
                  required={true}
                  {...register("sending_wait_time_to")}
                  className={styles.input}
                  max={9999}
                  min={20}
                />
                <p>
                  <small>
                    Maximum pause between emails in seconds (range: 20-9999)
                  </small>
                </p>
                {errors.sending_wait_time_to && (
                  <span className={styles.error}>
                    {errors.sending_wait_time_to?.message}
                  </span>
                )}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="name">Signature</label>
                <textarea
                  id="footer"
                  {...register("footer")}
                  className={styles.input}
                ></textarea>
                {errors.name && (
                  <span className={styles.error}>{errors.footer?.message}</span>
                )}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="name">Bcc</label>
                <input
                  id="bcc"
                  type="text"
                  {...register("bcc")}
                  className={styles.input}
                />
                {errors.name && (
                  <span className={styles.error}>{errors.bcc?.message}</span>
                )}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="daily_sending_limit">Daily Sending Limit</label>
                <input
                  id="daily_sending_limit"
                  type="number"
                  placeholder="Default 500"
                  {...register("daily_sending_limit")}
                  className={styles.input}
                  max={5500}
                />
                <p>
                  <small>
                    Maximum number of sent emails allowed per day (range:
                    1-5500)
                  </small>
                </p>
                {errors.daily_sending_limit && (
                  <span className={styles.error}>
                    {errors.daily_sending_limit?.message}
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
