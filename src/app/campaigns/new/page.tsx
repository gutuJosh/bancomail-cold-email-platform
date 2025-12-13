"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { addCampaign } from "@/store/slices/campaignsSlice";
import {
  fetchAccountsStart,
  fetchAccountsSuccess,
  fetchAccountsFailure,
} from "@/store/slices/emailAccountsSlice";
import {
  campaignsAPI,
  emailAccountsAPI,
  UnknownKeyedObject,
} from "@/services/api";
import DeliveryTime from "@/components/campaigns/delivery-time";
import Navbar from "@/components/Navbar/Navbar";
import styles from "./new.module.scss";
import timezoneOptions from "@/config/timezones.json";
import { CampaignFormData } from "@/types/global";
import { DelieveryTimeProps } from "@/types/global";
import week from "../../../config/days-of-the-week.json";

export default function NewCampaignPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated, apiKey } = useAppSelector((state) => state.auth);
  const { accounts, loading, error } = useAppSelector(
    (state) => state.emailAccounts
  );
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CampaignFormData>();

  const [deliveryTime, setDeliveryTime] = useState<DelieveryTimeProps[]>([]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/");
      return;
    }

    loadsEmailAccounts();
  }, [isAuthenticated, router]);

  const onSubmit = async (data: CampaignFormData) => {
    try {
      let delivery_time: { [key: string]: { from: string; to: string }[] } = {};
      if (deliveryTime.length > 0) {
        deliveryTime.forEach((item) => {
          delivery_time[item.dayName] = item.hours;
        });
      }
      data["apiKey"] = apiKey as string;
      data["settings"] = delivery_time;

      const newCampaign = await campaignsAPI.create(data);

      if (newCampaign.status === "OK") {
        if (
          confirm(
            "The campaign was saved successfully as draft! Do you wish to continue edit the campaign?"
          )
        ) {
          router.push(`/campaigns/${newCampaign.id}/edit`);
          return;
        }
        dispatch(addCampaign(newCampaign));
      }
      router.push("/campaigns");
    } catch (error) {
      alert("Failed to create campaign");
    }
  };

  const loadsEmailAccounts = async () => {
    try {
      dispatch(fetchAccountsStart());
      const data = await emailAccountsAPI.getAll(apiKey as string);

      dispatch(
        fetchAccountsSuccess(
          data.filter(
            (email: {
              type: string;
              id: number;
              details: { [key: string]: string | number };
            }) => email.type === "SMTP"
          )
        )
      );
    } catch (error: any) {
      dispatch(fetchAccountsFailure(error.message));
    }
  };

  const handleDeliveryTime = (obj: DelieveryTimeProps) => {
    const { dayName } = obj;
    const delivery_time = [...deliveryTime];
    const item_exists = delivery_time.filter(
      (item) => item.dayName === dayName
    );
    if (item_exists.length > 0) {
      for (let i = 0; i < delivery_time.length; i++) {
        if (delivery_time[i].dayName === item_exists[0].dayName) {
          const { hours } = obj;
          delivery_time[i].hours = hours.filter(
            (item) => item.from.length > 0 && item.to.length > 0
          );
          break;
        }
      }
    } else {
      const hours = obj.hours.filter(
        (item) => item.from.length > 0 && item.to.length > 0
      );
      if (hours.length > 0) {
        delivery_time.push({
          dayName: dayName,
          hours: hours,
        });
      }
    }

    setDeliveryTime(delivery_time);
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
                {...register("name", { required: "Campaign name is required" })}
                className={styles.input}
              />
              {errors.name && (
                <span className={styles.error}>{errors.name.message}</span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="subject">Select Email Accounts *</label>
              <select
                multiple
                id="email_account_ids"
                {...register("subject", { required: "Subject is required" })}
                className={styles.input}
                {...register("email_account_ids", { required: true })}
                onChange={(e) => {
                  if (e.target.value.includes("new")) {
                    router.push("/email-accounts?add_new=1");
                  }
                }}
              >
                {accounts?.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item?.details?.from_name}
                    <span>({item?.details?.email})</span>
                  </option>
                ))}

                <option value="new" className="text-blue text-underline">
                  Create new email account
                </option>
              </select>
              {errors.subject && (
                <span className={styles.error}>{errors.subject.message}</span>
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

            {week.map((item, index) => (
              <DeliveryTime
                day={item}
                callBack={handleDeliveryTime}
                key={index}
              />
            ))}

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
                <span className={styles.error}>
                  {errors.daily_enroll.message}
                </span>
              )}
              <small>
                Maximum number of prospects that can be contacted in the opening
                step of the campaign per day
              </small>
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
              <small>{`Whether the unsubscribe link should provide prospects with an option for GDPR-compliant data removal. This option will work only if the '{{UNSUBSCRIBE}} snippet is included in your email or account signature`}</small>
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
              <small>{`Whether to include List-Unsubscribe header. This option will work only if the {{UNSUBSCRIBE}} snippet is included in your email or account signature`}</small>
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
                Create Campaign
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
