'use client';

import { Provider } from 'react-redux';
import { store } from '@/store';
import CookiesProviderWrapper from '@/components/cookie-provider-wrapper';


export function Providers({ children }: { children: React.ReactNode }) {
  return(
        <Provider store={store}>
          <CookiesProviderWrapper>
            {children}
          </CookiesProviderWrapper>
        </Provider>
  );
}
