import React from "react";
import { useNavigate } from "react-router-dom";
import { Icons } from "../../constants/icons";
import TitleText from "./TitleText";

interface PageHeaderProps {
  title?: string;
  slug?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, slug }) => {
  const navigate = useNavigate();

  const handleBack = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.history.state && typeof window.history.state.idx === "number" && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  const formattedTitle = title
    ? title
    : slug
      ? slug
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(" ")
      : "";

  return (
    <div className="mb-4 flex items-center justify-between">
      <div className="">
        <TitleText title={formattedTitle} />
      </div>
      <div className="">
        <button
          type="button"
          onClick={handleBack}
          className="from-btn02 to-btn01 flex cursor-pointer items-center gap-1.5 rounded-full bg-linear-to-tr px-3.5 py-1.5 sm:px-5 sm:py-2 text-xs sm:text-sm font-semibold text-white shadow-xs transition-all duration-300 hover:scale-105 active:scale-95"
        >
          <Icons.leftArrow className="text-white h-3.5 w-3.5 sm:h-4 sm:w-4" />
          <span>Back</span>
        </button>
      </div>
    </div>
  );
};

export default PageHeader;
