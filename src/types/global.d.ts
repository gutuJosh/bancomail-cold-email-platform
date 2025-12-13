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

export interface CampaignFormData {
  apiKey?: string;
  name: string;
  subject: string;
  content: string;
  email_account_ids: [];
  settings: UnknownKeyedObject;
  steps: UnknownKeyedObject;
  timezone: string;
  daily_enroll: string;
  gdpr_unsubscribe: string;
  list_unsubscribe: string;
}

export interface CampaignSettingsProperties {
  apiKey?: string;
  path?: string;
  name: string;
  email_account_ids: number[];
  campaign_id: number;
  timezone: string;
  daily_enroll: number;
  gdpr_unsubscribe?: boolean;
  list_unsubscribe?: boolean;
  delivery_time?: { [key: string]: { from: string; to: string }[] };
}

export interface DelieveryTimeProps {
  dayName: string;
  hours: { from: string; to: string }[];
}
