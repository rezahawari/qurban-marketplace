
import React from 'react';
import { Language } from '../types';

interface Props {
  current: Language;
  onChange: (lang: Language) => void;
}

const LanguageSwitcher: React.FC<Props> = ({ current, onChange }) => {
  return (
    <div className="flex gap-2 bg-emerald-900/10 p-1 rounded-full border border-emerald-900/20">
      {(['id', 'en', 'ar'] as Language[]).map((lang) => (
        <button
          key={lang}
          onClick={() => onChange(lang)}
          className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
            current === lang 
              ? 'bg-brand-maroon text-white shadow-md' 
              : 'text-brand-maroon-700 hover:bg-brand-maroon-100'
          }`}
        >
          {lang.toUpperCase()}
        </button>
      ))}
    </div>
  );
};

export default LanguageSwitcher;
