'use client';

import { CookiesProvider } from 'react-cookie';
import React from 'react';

// Define the Props type for clarity
interface CookiesProviderWrapperProps {
  children: React.ReactNode;
}

export default function CookiesProviderWrapper({ children }: CookiesProviderWrapperProps) {
  return (
    <CookiesProvider>
      {children}
    </CookiesProvider>
  );
}