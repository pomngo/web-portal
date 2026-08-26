import React from "react";
import { Icons } from "../../constants/icons";

interface EmptyStateProps {
  message?: string;
  icon?: React.ReactNode;
}

const EmptyState: React.FC<EmptyStateProps> = ({ message = "No data found", icon }) => {
  return (
    <div className="animate-fade-in my-4 flex w-full flex-col items-center justify-center rounded-3xl border border-slate-100 bg-white p-8 text-center shadow-xs">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-50 text-slate-400">
        {icon || <Icons.searchLucide size={24} />}
      </div>
      <p className="max-w-xs text-sm leading-relaxed font-medium text-slate-500">{message}</p>
    </div>
  );
};

export default EmptyState;
