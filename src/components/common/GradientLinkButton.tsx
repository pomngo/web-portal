import { Link } from "react-router";
import { Icons } from "../../constants/icons";

type GradientLinkButtonProps = {
  to: string;
  title?: string;
  className?: string;
};

const GradientLinkButton = ({
  to,
  title="",
  className = "",
}: GradientLinkButtonProps) => {
  return (
    <Link
      to={to}
      className={`
        bg-linear-to-tr from-btn02 to-btn01 to-75%
        bg-clip-text text-transparent
        transition-all duration-300
        hover:scale-105
        flex items-center gap-1 text-nowrap
        px-5 py-2
        ${className}
      `}
    >
      <span className="">{title ? title : "View All"}</span>
      <Icons.rightArrow className="text-btn01" />
    </Link>
  );
};

export default GradientLinkButton;
