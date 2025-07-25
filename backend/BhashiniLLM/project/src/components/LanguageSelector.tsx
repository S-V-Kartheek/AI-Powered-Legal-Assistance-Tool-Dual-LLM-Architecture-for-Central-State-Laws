import React from 'react';
import { ChevronDown } from 'lucide-react';
import { Language } from '../types';
import { SUPPORTED_LANGUAGES } from '../data/languages';

interface LanguageSelectorProps {
  selectedLanguage: Language;
  onLanguageChange: (language: Language) => void;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  selectedLanguage,
  onLanguageChange,
}) => {
  return (
    <div className="relative">
      <select
        value={selectedLanguage.code}
        onChange={(e) => {
          const language = SUPPORTED_LANGUAGES.find(lang => lang.code === e.target.value);
          if (language) onLanguageChange(language);
        }}
        className="appearance-none bg-white border-2 border-blue-200 rounded-lg px-4 py-2 pr-8 text-sm font-medium text-gray-700 hover:border-blue-300 focus:outline-none focus:border-blue-500 transition-colors"
      >
        {SUPPORTED_LANGUAGES.map((language) => (
          <option key={language.code} value={language.code}>
            {language.flag} {language.name}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
    </div>
  );
};