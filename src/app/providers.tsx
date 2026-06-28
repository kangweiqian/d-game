'use client';

import { ReactNode } from 'react';
import { I18nProvider } from '../context/I18nContext';

export default function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <I18nProvider>
      {children}
    </I18nProvider>
  );
}
