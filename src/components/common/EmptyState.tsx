import React from "react";
import { Icons } from "../../constants/icons";

interface EmptyStateProps {
  message?: string;
  icon?: React.ReactNode;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  message = "No data found",
  icon,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-white border border-slate-100 rounded-3xl shadow-xs my-4 w-full animate-fade-in">
      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-slate-50 text-slate-400 mb-4">
        {icon || <Icons.searchLucide size={24} />}
      </div>
      <p className="text-slate-500 text-sm font-medium leading-relaxed max-w-xs">
        {message}
      </p>
    </div>
  );
};

export default EmptyState;
