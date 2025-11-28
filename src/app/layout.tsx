import type { Metadata } from 'next';
import { Providers } from './providers';
import '@/styles/globals.scss';

export const metadata: Metadata = {
  title: 'Bancomail Email Client',
  description: 'Email campaign management with Woodpecker API',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
