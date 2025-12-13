"use client";
import { useState, FC } from "react";
import { UTCtoLocale } from "@/utils/helper";

interface Properties {
  styles: any;
  campaign: {
    name: string;
    id: number;
    status: string;
    subject: string;
    created?: any;
    from_email: string;
    cc: string;
    bcc: string;
  };
  handleStart: (id: number) => Promise<string>;
  handlePause: (id: number) => Promise<string>;
  handleDelete: (id: number) => Promise<string>;
  handleEdit: (id: number) => void;
  viewStats: (id: number) => void;
}

const CampaignBox: FC<Properties> = ({
  styles,
  campaign,
  handleStart,
  handlePause,
  handleDelete,
  handleEdit,
  viewStats,
}) => {
  const [status, setStatus] = useState<string>(campaign?.status);
  const [isDeleted, setIsDeleted] = useState<boolean>(false);

  return (
    <>
      {!isDeleted && (
        <div key={campaign.id} className={styles.campaignCard}>
          <div className={styles.campaignHeader}>
            <h3>{campaign.name}</h3>
            <span className={`${styles.badge} ${styles[campaign.status]}`}>
              {status}
            </span>
          </div>
          <p className={styles.subject}>{campaign.subject}</p>
          <p className={styles.prospects}>
            Created at:{" "}
            {campaign.created !== undefined && campaign.created !== null
              ? UTCtoLocale(campaign.created.split("+")[0].replace("T", " "))
              : ""}
            <br />
            From email: {campaign.from_email}
            <br />
            CC Recipients: {campaign.cc}
            <br />
            Bcc Recipients: {campaign.bcc}
          </p>
          <div className={styles.actions}>
            {(status === "DRAFT" || status === "EDITED") && (
              <button
                onClick={() => handleEdit(campaign.id)}
                className={styles.editBtn}
              >
                Edit
              </button>
            )}
            {status === "PAUSED" && (
              <button
                onClick={() =>
                  handleStart(campaign.id).then((response: string) => {
                    if (response === "OK") {
                      setStatus("RUNNING");
                    }
                  })
                }
                className={styles.startBtn}
              >
                Start
              </button>
            )}

            {status === "RUNNING" && (
              <button
                onClick={() =>
                  handlePause(campaign.id).then((response: string) => {
                    if (response === "OK") {
                      setStatus("PAUSED");
                    }
                  })
                }
                className={styles.pauseBtn}
              >
                Pause
              </button>
            )}

            <button
              onClick={() =>
                handleDelete(campaign.id).then((response: string) => {
                  if (response === "OK") {
                    setIsDeleted(true);
                  }
                })
              }
              className={styles.deleteBtn}
            >
              Delete
            </button>

            {status === "COMPLETED" && (
              <button
                onClick={() => viewStats(campaign.id)}
                className={styles.pauseBtn}
              >
                View Stats
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
};
export default CampaignBox;
