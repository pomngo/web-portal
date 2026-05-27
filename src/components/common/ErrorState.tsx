import React from "react";
import { Icons } from "../../constants/icons";

interface ErrorStateProps {
  title?: string;
  message?: string | null;
  onRetry?: () => void;
  variant?: "danger" | "info" | "neutral";
}

const ErrorState: React.FC<ErrorStateProps> = ({
  title = "Something went wrong",
  message = "We encountered an issue fetching the data. Please try again.",
  onRetry,
  variant = "danger",
}) => {
  const getIcon = () => {
    switch (variant) {
      case "info":
        return <Icons.info size={32} />;
      case "neutral":
        return <Icons.searchLucide size={32} />;
      default:
        return <Icons.alertTriangle size={32} />;
    }
  };

  const getIconClass = () => {
    switch (variant) {
      case "info":
        return "bg-blue-50 text-blue-500";
      case "neutral":
        return "bg-slate-50 text-slate-400";
      default:
        return "bg-red-50 text-red-500";
    }
  };

  return (
    <div className="animate-fade-in mx-auto my-12 flex max-w-md flex-col items-center justify-center rounded-3xl border border-slate-100 bg-white p-8 text-center shadow-xs">
      <div className={`mb-6 flex h-16 w-16 items-center justify-center rounded-full ${getIconClass()}`}>
        {getIcon()}
      </div>
      <h3 className="mb-2 text-xl font-bold text-slate-800">{title}</h3>
      <p className="mb-8 max-w-xs text-sm leading-relaxed text-slate-500">
        {message || "We encountered an issue fetching the data. Please try again."}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="from-btn02 to-btn01 flex cursor-pointer items-center gap-2 rounded-2xl bg-linear-to-tr px-6 py-3 font-semibold text-white shadow-md shadow-orange-500/10 transition-all duration-300 hover:scale-105 active:scale-95"
        >
          <Icons.refresh size={16} />
          Retry
        </button>
      )}
    </div>
  );
};

export default ErrorState;
