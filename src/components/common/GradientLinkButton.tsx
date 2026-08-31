import { Link } from "react-router-dom";
import { Icons } from "../../constants/icons";

type GradientLinkButtonProps = {
  to: string;
  title?: string;
  className?: string;
};

const GradientLinkButton = ({ to, title = "", className = "" }: GradientLinkButtonProps) => {
  return (
    <Link
      to={to}
      className={`from-btn02 to-btn01 flex items-center gap-1 bg-linear-to-tr to-75% bg-clip-text px-2 py-1 sm:px-5 sm:py-2 text-nowrap text-transparent transition-all duration-300 hover:scale-105 ${className} `}
    >
      <span className="hidden sm:inline">{title ? title : "View All"}</span>
      <Icons.rightArrow className="text-btn01" />
    </Link>
  );
};

export default GradientLinkButton;
