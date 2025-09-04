import React, { useState } from "react";

interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  badge?: string;
  className?: string;
}

export default function CollapsibleSection({ 
  title, 
  children, 
  defaultOpen = false,
  badge,
  className = ""
}: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={`border border-gray-200 rounded-lg overflow-hidden ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 bg-white hover:bg-gray-50 transition-colors flex items-center justify-between group"
      >
        <div className="flex items-center gap-3">
          {/* Plus/Minus Icon */}
          <div className={`
            w-6 h-6 rounded-full border-2 border-gray-400 flex items-center justify-center
            transition-all duration-300 group-hover:border-green-600 group-hover:bg-green-50
            ${isOpen ? 'border-green-600 bg-green-50' : ''}
          `}>
            <span className={`
              text-lg font-medium transition-all duration-300
              ${isOpen ? 'text-green-600' : 'text-gray-400 group-hover:text-green-600'}
            `}>
              {isOpen ? '−' : '+'}
            </span>
          </div>
          
          {/* Title */}
          <span className="text-lg font-semibold text-gray-900">{title}</span>
          
          {/* Optional Badge */}
          {badge && (
            <span className="px-2 py-1 text-xs font-bold bg-yellow-400 text-gray-900 rounded-full">
              {badge}
            </span>
          )}
        </div>

        {/* Arrow Icon */}
        <svg 
          className={`
            w-5 h-5 text-gray-400 transition-transform duration-300
            ${isOpen ? 'rotate-180' : ''}
          `}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Collapsible Content */}
      <div className={`
        transition-all duration-300 ease-in-out
        ${isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}
      `}>
        <div className="p-4 bg-gray-50 border-t border-gray-200">
          {children}
        </div>
      </div>
    </div>
  );
}

// Sub-component for list items within collapsible sections
export function CollapsibleItem({ 
  label, 
  value, 
  onClick,
  isComingSoon = false 
}: { 
  label: string; 
  value?: string | number; 
  onClick?: () => void;
  isComingSoon?: boolean;
}) {
  const content = (
    <div className="flex items-center justify-between">
      <span className={`${isComingSoon ? 'text-gray-400' : 'text-gray-700'}`}>
        {label}
      </span>
      <div className="flex items-center gap-2">
        {isComingSoon && (
          <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full font-medium">
            Coming Soon
          </span>
        )}
        {value !== undefined && (
          <span className="font-bold text-gray-900">{value}</span>
        )}
        {onClick && !isComingSoon && (
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        )}
      </div>
    </div>
  );

  if (onClick && !isComingSoon) {
    return (
      <button
        onClick={onClick}
        className="w-full px-3 py-2 text-left hover:bg-white rounded-lg transition-colors"
      >
        {content}
      </button>
    );
  }

  return (
    <div className={`px-3 py-2 ${isComingSoon ? 'opacity-60 cursor-not-allowed' : ''}`}>
      {content}
    </div>
  );
}