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
          onClick={() => navigate(-1)}
          className="from-btn02 to-btn01 flex cursor-pointer items-center gap-2 bg-linear-to-tr to-75% bg-clip-text px-5 py-2 text-transparent transition-all duration-300 hover:scale-105"
        >
          <Icons.leftArrow className="text-btn01" /> Back
        </button>
      </div>
    </div>
  );
};

export default PageHeader;
