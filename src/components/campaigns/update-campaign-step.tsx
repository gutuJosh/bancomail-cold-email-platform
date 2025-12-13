"use client";
import { useState, FC } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useAppDispatch } from "@/store/hooks";
import { updateCampaign } from "@/store/slices/campaignsSlice";
import api, { campaignsAPI } from "@/services/api";
import DeliveryTime from "./delivery-time";
import styles from "../../app/campaigns/new/new.module.scss";
import { CampaignSettingsProperties, DelieveryTimeProps } from "@/types/global";
import timezoneOptions from "@/config/timezones.json";
import week from "@/config/days-of-the-week.json";

interface ComponentProperties {
  apiKey: string;
  campaign_data: {
    [key: string]: { from: string; to: string }[];
  };
}

const UpdateCampaignSetps: FC<ComponentProperties> = ({
  apiKey,
  campaign_data,
}) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CampaignSettingsProperties>({});

  const [deliveryTime, setDeliveryTime] = useState<DelieveryTimeProps[]>([]);

  const onSubmit = async (data: CampaignSettingsProperties) => {
    try {
      if (deliveryTime.length > 0) {
        let delivery_time: { [key: string]: { from: string; to: string }[] } =
          {};
        deliveryTime.forEach((item) => {
          delivery_time[item.dayName] = item.hours;
        });
        data["apiKey"] = apiKey;
        data["delivery_time"] = delivery_time;
        const updated = await campaignsAPI.update(data.campaign_id, data);
        if (updated.status === "OK") {
          alert("The campaign was successfully updated!");
        }
        dispatch(updateCampaign(updated));
        router.push("/campaigns");
      }
    } catch (error) {
      alert("Failed to update campaign");
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

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <h4 className="page-title">Edit Delivery Time</h4>
      <input type="hidden" id="apiKey" {...register("apiKey")} />
      <input
        type="hidden"
        id="path"
        {...register("path")}
        value={"update_campaign_settings"}
      />

      {week.map((item, index) => (
        <DeliveryTime
          day={item}
          callBack={handleDeliveryTime}
          key={index}
          defaultValue={campaign_data[item]}
        />
      ))}

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
export default UpdateCampaignSetps;
