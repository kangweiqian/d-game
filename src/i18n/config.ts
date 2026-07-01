import { getRequestConfig } from 'next-intl/server';

const locales = ['zh', 'en'];

export default getRequestConfig(async ({ locale }) => {
  // 默认英文
  const validLocale = locale && locales.includes(locale as 'zh' | 'en') ? locale : 'en';
  
  return {
    locale: validLocale,
    messages: (await import(`./messages/${validLocale}.json`)).default,
  };
});
