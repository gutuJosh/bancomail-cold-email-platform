"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { updateCampaign } from "@/store/slices/campaignsSlice";
import { campaignsAPI } from "@/services/api";
import Navbar from "@/components/Navbar/Navbar";
import styles from "../../new/new.module.scss";

interface CampaignFormData {
  apiKey: string;
  name: string;
  subject: string;
  content: string;
}

export default function EditCampaignPage() {
  const router = useRouter();
  const params = useParams();
  const dispatch = useAppDispatch();
  const { isAuthenticated, apiKey } = useAppSelector((state) => state.auth);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CampaignFormData>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/");
      return;
    }
    loadCampaign();
  }, [isAuthenticated, router]);

  const loadCampaign = async () => {
    try {
      const id = Number(params.id);
      const campaign = await campaignsAPI.getById(id, apiKey as string);
      setValue("name", campaign.name);
      setValue("subject", campaign.subject);
      setValue("content", campaign.content);
      setLoading(false);
    } catch (error) {
      alert("Failed to load campaign");
      router.push("/campaigns");
    }
  };

  const onSubmit = async (data: CampaignFormData) => {
    try {
      const id = Number(params.id);
      const updated = await campaignsAPI.update(id, data);
      dispatch(updateCampaign(updated));
      router.push("/campaigns");
    } catch (error) {
      alert("Failed to update campaign");
    }
  };

  if (!isAuthenticated || loading) return null;

  return (
    <>
      <Navbar />
      <div className={styles.newCampaignPage}>
        <div className="container">
          <h1 className="page-title">Edit Campaign</h1>

          <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="name">Campaign Name *</label>
              <input
                id="name"
                type="text"
                placeholder="Enter campaign name"
                {...register("name", { required: "Campaign name is required" })}
                className={styles.input}
              />
              {errors.name && (
                <span className={styles.error}>{errors.name.message}</span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="subject">Email Subject *</label>
              <input
                id="subject"
                type="text"
                placeholder="Enter email subject"
                {...register("subject", { required: "Subject is required" })}
                className={styles.input}
              />
              {errors.subject && (
                <span className={styles.error}>{errors.subject.message}</span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="content">Email Content *</label>
              <textarea
                id="content"
                rows={10}
                placeholder="Enter email content..."
                {...register("content", { required: "Content is required" })}
                className={styles.textarea}
              />
              {errors.content && (
                <span className={styles.error}>{errors.content.message}</span>
              )}
            </div>

            <div className={styles.actions}>
              <button
                type="button"
                onClick={() => router.back()}
                className={styles.cancelBtn}
              >
                Cancel
              </button>
              <button type="submit" className={styles.submitBtn}>
                Update Campaign
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
