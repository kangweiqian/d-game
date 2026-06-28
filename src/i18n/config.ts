import { getRequestConfig } from 'next-intl/server';

const locales = ['zh', 'en'];

export default getRequestConfig(async ({ locale }) => {
  const validLocale = locale && locales.includes(locale as 'zh' | 'en') ? locale : 'zh';
  
  return {
    locale: validLocale,
    messages: (await import(`./messages/${validLocale}.json`)).default,
  };
});
