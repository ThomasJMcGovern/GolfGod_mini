import React from "react";

interface MetricItemProps {
  label: string;
  value: string | number | null;
  unit?: string;
  description?: string;
  className?: string;
}

export function MetricItem({ label, value, unit, description, className = "" }: MetricItemProps) {
  return (
    <div className={`flex flex-col ${className}`}>
      <span className="text-sm text-gray-600 mb-1">{label}</span>
      <div className="flex items-baseline">
        <span className="text-2xl font-bold text-gray-900">
          {value ?? "N/A"}
        </span>
        {unit && value !== null && (
          <span className="ml-1 text-sm text-gray-500">{unit}</span>
        )}
      </div>
      {description && (
        <span className="text-xs text-gray-500 mt-1">{description}</span>
      )}
    </div>
  );
}

interface MetricsCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function MetricsCard({ title, children, className = "" }: MetricsCardProps) {
  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      <h2 className="text-lg font-semibold text-gray-900 mb-4">{title}</h2>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

interface SplitMetricProps {
  label: string;
  delta: number | null;
  samples: { label: string; count: number }[];
  description?: string;
  positiveIsBetter?: boolean;
}

export function SplitMetric({ 
  label, 
  delta, 
  samples, 
  description, 
  positiveIsBetter = true 
}: SplitMetricProps) {
  const getDeltaColor = () => {
    if (delta === null || delta === 0) return "text-gray-900";
    const isPositive = delta > 0;
    if (positiveIsBetter) {
      return isPositive ? "text-green-600" : "text-red-600";
    } else {
      return isPositive ? "text-red-600" : "text-green-600";
    }
  };

  const getDeltaIcon = () => {
    if (delta === null || delta === 0) return null;
    if (delta > 0) {
      return (
        <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
        </svg>
      );
    } else {
      return (
        <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M14.707 12.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      );
    }
  };

  return (
    <div className="border-l-4 border-blue-500 pl-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <div className={`flex items-center font-bold ${getDeltaColor()}`}>
          <span>{delta !== null ? delta : "N/A"}</span>
          {getDeltaIcon()}
        </div>
      </div>
      <div className="flex gap-4 text-xs text-gray-500">
        {samples.map((sample, index) => (
          <span key={index}>
            {sample.label}: <strong>{sample.count}</strong>
          </span>
        ))}
      </div>
      {description && (
        <p className="text-xs text-gray-500 mt-1 italic">{description}</p>
      )}
    </div>
  );
}