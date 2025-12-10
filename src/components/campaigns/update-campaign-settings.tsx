"use client";
import { FC } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useAppDispatch } from "@/store/hooks";
import { updateCampaign } from "@/store/slices/campaignsSlice";
import { campaignsAPI } from "@/services/api";
import styles from "../../campaigns/new/new.module.scss";
import { CampaignSettingsProperties } from "@/types/global";
import timezoneOptions from "@/config/timezones.json";

interface ComponentProperties {
  apiKey: string;
  campaign_data: {
    settings?: {
      daily_enroll: number;
      timezone: string;
      gdpr_unsubscribe: boolean;
      list_unsubscribe: boolean;
    };
    [key: string]: any;
  };
  styles: any;
}

const UpdateCampaignSettings: FC<ComponentProperties> = ({
  apiKey,
  campaign_data,
  styles,
}) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CampaignSettingsProperties>({
    defaultValues: {
      apiKey: apiKey as string,
      campaign_id: campaign_data?.id as number,
      name: campaign_data?.name as string,
      email_account_ids: campaign_data?.email_account_ids as number[],
      daily_enroll: campaign_data?.settings?.daily_enroll as number,
      timezone: campaign_data?.settings?.timezone as string,
      gdpr_unsubscribe:
        (campaign_data?.settings?.gdpr_unsubscribe as boolean) === true,
      list_unsubscribe: campaign_data?.settings?.list_unsubscribe as boolean,
    },
  });

  const emailAccounts = campaign_data?.email_account_ids as number[];

  const onSubmit = async (data: CampaignSettingsProperties) => {
    try {
      const updated = await campaignsAPI.update(data.campaign_id, data);
      if (updated.status === "OK") {
        alert("The campaign was successfully updated!");
      }
      dispatch(updateCampaign(updated));
      router.push("/campaigns");
    } catch (error) {
      alert("Failed to update campaign");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <h4 className="page-title">Edit settings</h4>
      <input type="hidden" id="apiKey" {...register("apiKey")} />
      <input
        type="hidden"
        id="path"
        {...register("path")}
        value={"update_campaign_settings"}
      />

      <div className={styles.formGroup}>
        <label htmlFor="name">Campaign Name</label>
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
        <label htmlFor="email_account_ids">Email Accounts *</label>
        <select
          multiple
          id="email_account_ids"
          {...register("email_account_ids", {
            required: "Email Accounts is required",
          })}
          className={styles.input}
        >
          {emailAccounts.map((item, index) => (
            <option key={index} value={item}>
              {item}
            </option>
          ))}
        </select>
        {errors.email_account_ids && (
          <span className={styles.error}>
            {errors.email_account_ids.message}
          </span>
        )}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="timezone">Timezone *</label>
        <select
          id="timezone"
          {...register("timezone", {
            required: "Timezone is required",
          })}
          className={styles.input}
        >
          {timezoneOptions.map((item, index) => (
            <option key={index} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="daily_enroll">Prospects number</label>
        <input
          id="daily_enroll"
          type="number"
          maxLength={3}
          max={500}
          {...register("daily_enroll", {
            required: "Daily enroll number is required",
          })}
          className={styles.input}
        />
        {errors.daily_enroll && (
          <span className={styles.error}>{errors.daily_enroll.message}</span>
        )}
        <span>
          Maximum number of prospects that can be contacted in the opening step
          of the campaign per day
        </span>
      </div>

      <div className={styles.formGroup}>
        <p className="flex flex-align-center">
          <input
            type="checkbox"
            id="gdpr_unsubscribe"
            {...register("gdpr_unsubscribe", {
              required: "Gdpr unsubscribe is required",
            })}
          />
          <label htmlFor="gdpr_unsubscribe">Gdpr Signature</label>
        </p>
        <span>{`Whether the unsubscribe link should provide prospects with an option for GDPR-compliant data removal. This option will work only if the '{{UNSUBSCRIBE}} snippet is included in your email or account signature`}</span>
      </div>

      <div className={styles.formGroup}>
        <p className="flex flex-align-center">
          <input
            type="checkbox"
            id="list_unsubscribe"
            {...register("list_unsubscribe", {
              required: "List unsubscribe is required",
            })}
          />
          <label htmlFor="track_opens">List unsubscribe</label>
        </p>
        <span>{`Whether to include List-Unsubscribe header. This option will work only if the {{UNSUBSCRIBE}} snippet is included in your email or account signature`}</span>
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
          Update Settings
        </button>
      </div>
    </form>
  );
};
export default UpdateCampaignSettings;
