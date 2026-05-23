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
    <div className="flex justify-between items-center mb-4">
      <div className="">
        <TitleText title={formattedTitle} />
      </div>
      <div className="">
        <button
          onClick={() => navigate(-1)}
          className="bg-linear-to-tr from-btn02 to-btn01 to-75% px-5 py-2 bg-clip-text text-transparent transition-all duration-300 hover:scale-105 flex items-center gap-2 cursor-pointer"
        >
          <Icons.leftArrow className="text-btn01" /> Back
        </button>
      </div>
    </div>
  );
};

export default PageHeader;
