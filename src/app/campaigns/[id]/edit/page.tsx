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
  message: string;
  signature: boolean;
  track_opens: boolean;
  step: string;
  step_id: string;
  version_id: string;
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
  } = useForm<CampaignFormData>({
    defaultValues: {
      signature: true,
      track_opens: true,
    },
  });
  const [campaignName, setCampaignName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

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
      console.log("CAMPAIGN DATA---->", campaign);
      setCampaignName(campaign.name);
      setValue("apiKey", apiKey as string);
      setValue("name", campaign.name);
      setValue("subject", campaign.stats[0]?.stats?.emails[0]?.subject);
      setValue("message", campaign.stats[0]?.stats?.emails[0]?.msg);
      setValue("step_id", campaign.steps?.followup?.id);
      setValue("version_id", campaign.steps?.followup?.body?.versions[0]?.id);
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
      if (updated.status === "OK") {
        alert("The campaign was successfully updated!");
      }
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
          <h1 className="page-title">Edit Campaign {campaignName}</h1>

          <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
            <input type="hidden" id="apiKey" {...register("apiKey")} />
            <input
              type="hidden"
              id="step"
              {...register("step")}
              value={"update_step_version"}
            />
            <input type="hidden" id="step_id" {...register("step_id")} />
            <input type="hidden" id="version_id" {...register("version_id")} />
            <div className={styles.formGroup}>
              <label htmlFor="name">Campaign Name *</label>
              <input
                id="name"
                type="text"
                placeholder="Enter campaign name"
                {...register("name", { required: "Campaign name is required" })}
                className={styles.input}
                readOnly={true}
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
              <p>
                <small>
                  Email body content in HTML format. Supports snippets like{" "}
                  {`{{FIRST_NAME}}`}
                </small>
              </p>
              <textarea
                id="message"
                rows={10}
                placeholder="Enter email content..."
                {...register("message", { required: "Content is required" })}
                className={styles.textarea}
              />
              <p>
                <small>
                  To track individual link clicks{" "}
                  <span className="">(not recommended)</span>, enclose the href
                  attribute value in a {`{{CLICK}}`} snippet.&nbsp; Example:{" "}
                  {`<a href=\"{{CLICK=https://google.com}}\">click here</a>`}
                </small>
              </p>
              {errors.message && (
                <span className={styles.error}>{errors.message.message}</span>
              )}
            </div>

            <div className={styles.formGroup}>
              <p className="flex flex-align-center">
                <input
                  type="checkbox"
                  id="signature"
                  {...register("signature")}
                />
                <label htmlFor="signature">Signature</label>
              </p>
              <span>Whether to use the sender's email account signature</span>
            </div>

            <div className={styles.formGroup}>
              <p className="flex flex-align-center">
                <input
                  type="checkbox"
                  id="track_opens"
                  {...register("track_opens")}
                />
                <label htmlFor="track_opens">Track opens</label>
              </p>
              <span>Whether to track email opens for this email version</span>
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
