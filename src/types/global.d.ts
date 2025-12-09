export interface AccountFormData {
  apiKey: string;
  smtp_email: string;
  smtp_password: string;
  smtp_server: string;
  smtp_port: number;
  imap_email: string;
  imap_password: string;
  imap_server: string;
  imap_port: number;
  sending_wait_time_to: number;
  [key: string]: string | number;
}

export type UnknownKeyedObject = {
  [key: string | number]: unknown;
};

export type StringKeyedObject = {
  [key: string]: string;
};

export interface CampaignSettingsProperties {
  apiKey: string;
  path: string;
  name: string;
  email_account_ids: number[];
  campaign_id: number;
  timezone: string;
  daily_enroll: number;
  gdpr_unsubscribe?: boolean;
  list_unsubscribe?: boolean;
}
