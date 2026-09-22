import React, { useState, useRef, useEffect } from 'react';
import { Languages, ChevronDown, Check, Sparkles } from 'lucide-react';
import { SA_LANGUAGES, getLanguageByCode } from '../data/languages';

interface LanguageSelectTabProps {
  selectedLanguage: string;
  onLanguageChange: (langCode: string) => void;
  detectedLanguageCode?: string;
  detectedLanguageName?: string;
  className?: string;
  dropUp?: boolean;
  onOpenModal?: () => void;
}

export const LanguageSelectTab: React.FC<LanguageSelectTabProps> = ({
  selectedLanguage,
  onLanguageChange,
  detectedLanguageCode,
  detectedLanguageName,
  className = '',
  dropUp = true,
  onOpenModal
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const activeLang = getLanguageByCode(selectedLanguage);
  const isAuto = selectedLanguage === 'auto';
  const detectedDisplayName = detectedLanguageName || (detectedLanguageCode ? getLanguageByCode(detectedLanguageCode).name : undefined);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen]);

  const handleTriggerClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onOpenModal) {
      onOpenModal();
    } else {
      setIsOpen(prev => !prev);
    }
  };

  const handleSelect = (code: string) => {
    onLanguageChange(code);
    setIsOpen(false);
    setSearchFilter('');
  };

  const filteredLanguages = SA_LANGUAGES.filter(l => 
    l.name.toLowerCase().includes(searchFilter.toLowerCase()) || 
    l.nativeName.toLowerCase().includes(searchFilter.toLowerCase()) ||
    l.code.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className={`relative inline-block ${className}`} ref={dropdownRef}>
      {/* Compact, Convenient Language Trigger Pill */}
      <button
        type="button"
        id="btn-language-tab"
        onClick={handleTriggerClick}
        className={`flex items-center gap-1.5 px-2 py-0.5 h-7 rounded-full border text-[11px] font-medium shadow-2xs transition-all cursor-pointer select-none ${
          isAuto 
            ? 'bg-sky-50/90 border-sky-300/80 text-sky-900 hover:bg-sky-100 hover:border-sky-400' 
            : 'border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 text-slate-700'
        }`}
        title="Change conversation language (All 11 South African official languages)"
        aria-expanded={isOpen}
      >
        <Languages className="w-3 h-3 text-sky-600 flex-shrink-0" />
        <span className="text-xs leading-none">{activeLang.flagOrIcon}</span>
        <span className="max-w-[65px] sm:max-w-[90px] truncate font-semibold leading-none">
          {isAuto 
            ? (detectedDisplayName ? `Auto (${detectedDisplayName})` : 'Auto-detect') 
            : activeLang.name}
        </span>
        <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform duration-200 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Sleek, Non-Intrusive Compact Dropdown Panel */}
      {isOpen && (
        <div
          id="language-dropdown-panel"
          className={`absolute ${dropUp ? 'bottom-full mb-1.5' : 'top-full mt-1.5'} left-0 sm:left-auto sm:right-0 z-50 w-48 sm:w-52 bg-white rounded-xl border border-slate-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-100`}
        >
          {/* Header & Detection Status */}
          <div className="p-1.5 bg-slate-50/90 border-b border-slate-100 space-y-1">
            <div className="flex items-center justify-between px-0.5">
              <span className="text-[9.5px] font-bold text-slate-600 uppercase tracking-wider">
                Select Language
              </span>
              {detectedDisplayName && (
                <span className="text-[9px] text-sky-600 font-semibold flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5" />
                  {detectedDisplayName}
                </span>
              )}
            </div>

            {/* Micro search filter for quick navigation */}
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Search language..."
              className="w-full px-2 py-0.5 text-[10.5px] bg-white border border-slate-200 rounded-md focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
              autoFocus
            />
          </div>

          {/* Scrollable Language List */}
          <div className="max-h-40 overflow-y-auto p-1 space-y-0.5 custom-scrollbar">
            {filteredLanguages.map((lang) => {
              const isSelected = selectedLanguage === lang.code;

              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => handleSelect(lang.code)}
                  className={`w-full px-2 py-1 rounded-md text-[10.5px] transition-colors flex items-center justify-between text-left cursor-pointer ${
                    isSelected
                      ? 'bg-[#002138] text-white font-semibold'
                      : 'text-slate-700 hover:bg-sky-50 hover:text-sky-950'
                  }`}
                >
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="text-xs flex-shrink-0">{lang.flagOrIcon}</span>
                    <span className="truncate">{lang.name}</span>
                    <span className={`text-[9px] font-normal truncate opacity-60`}>
                      ({lang.nativeName})
                    </span>
                  </div>

                  {isSelected && (
                    <Check className="w-3 h-3 text-sky-300 flex-shrink-0 ml-1" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
