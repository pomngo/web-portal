import React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface ErrorStateProps {
  title?: string;
  message?: string | null;
  onRetry?: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({
  title = "Something went wrong",
  message = "We encountered an issue fetching the data. Please try again.",
  onRetry,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-white border border-slate-100 rounded-3xl shadow-xs max-w-md mx-auto my-12 animate-fade-in">
      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-red-50 text-red-500 mb-6">
        <AlertTriangle size={32} />
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
          <RefreshCw size={16} />
          Retry
        </button>
      )}
    </div>
  );
};

export default ErrorState;
