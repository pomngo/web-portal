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
    <div className="flex flex-col items-center justify-center p-8 text-center bg-white border border-slate-100 rounded-3xl shadow-xs max-w-md mx-auto my-12 animate-fade-in">
      <div className={`flex items-center justify-center w-16 h-16 rounded-full mb-6 ${getIconClass()}`}>
        {getIcon()}
      </div>
      <h3 className="text-xl font-bold text-slate-800 mb-2">{title}</h3>
      <p className="text-slate-500 text-sm mb-8 max-w-xs leading-relaxed">
        {message || "We encountered an issue fetching the data. Please try again."}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 px-6 py-3 rounded-2xl text-white font-semibold bg-linear-to-tr from-btn02 to-btn01 transition-all duration-300 hover:scale-105 active:scale-95 shadow-md shadow-orange-500/10 cursor-pointer"
        >
          <Icons.refresh size={16} />
          Retry
        </button>
      )}
    </div>
  );
};

export default ErrorState;
