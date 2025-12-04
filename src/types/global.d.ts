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
  [key: string]: string | number;
}

export type UnknownKeyedObject = {
  [key: string | number]: unknown;
};

export type StringKeyedObject = {
  [key: string]: string;
};
