import { Language } from '../types';

export const SUPPORTED_LANGUAGES: Language[] = [
  {
    code: 'en-US',
    name: 'English',
    flag: '🇺🇸'
  },
  {
    code: 'hi-IN',
    name: 'हिन्दी',
    flag: '🇮🇳'
  },
  {
    code: 'bn-IN',
    name: 'বাংলা',
    flag: '🇮🇳'
  },
  {
    code: 'te-IN',
    name: 'తెలుగు',
    flag: '🇮🇳'
  },
  {
    code: 'mr-IN',
    name: 'मराठी',
    flag: '🇮🇳'
  },
  {
    code: 'ta-IN',
    name: 'தமிழ்',
    flag: '🇮🇳'
  },
  {
    code: 'gu-IN',
    name: 'ગુજરાતી',
    flag: '🇮🇳'
  },
  {
    code: 'kn-IN',
    name: 'ಕನ್ನಡ',
    flag: '🇮🇳'
  },
  {
    code: 'ml-IN',
    name: 'മലയാളം',
    flag: '🇮🇳'
  },
  {
    code: 'pa-IN',
    name: 'ਪੰਜਾਬੀ',
    flag: '🇮🇳'
  },
  {
    code: 'or-IN',
    name: 'ଓଡ଼ିଆ',
    flag: '🇮🇳'
  },
  {
    code: 'as-IN',
    name: 'অসমীয়া',
    flag: '🇮🇳'
  },
  {
    code: 'ur-IN',
    name: 'اردو',
    flag: '🇮🇳'
  },
  {
    code: 'sd-IN',
    name: 'سنڌي',
    flag: '🇮🇳'
  },
  {
    code: 'kok-IN',
    name: 'कोंकणी',
    flag: '🇮🇳'
  },
  {
    code: 'ne-IN',
    name: 'नेपाली',
    flag: '🇮🇳'
  },
  {
    code: 'mai-IN',
    name: 'मैथिली',
    flag: '🇮🇳'
  },
  {
    code: 'bho-IN',
    name: 'भोजपुरी',
    flag: '🇮🇳'
  },
  {
    code: 'mni-IN',
    name: 'মৈতৈলোন্',
    flag: '🇮🇳'
  },
  {
    code: 'sa-IN',
    name: 'संस्कृत',
    flag: '🇮🇳'
  }
];

export const getLanguageByCode = (code: string): Language => {
  return SUPPORTED_LANGUAGES.find(lang => lang.code === code) || SUPPORTED_LANGUAGES[0];
};