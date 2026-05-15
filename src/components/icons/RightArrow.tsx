type IconProps = {
  className?: string;
};

const RightArrow = ({ className }: IconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      className={className}
    >
      <g clipPath="url(#clip0_5130_4799)">
        <path
          d="M12.0676 8.5044L4.94065 15.6313C4.5525 16.0195 3.88971 15.8419 3.74764 15.3116C3.6817 15.0656 3.75205 14.803 3.9322 14.6229L10.5558 8.00017L3.9322 1.37749C3.54404 0.989334 3.72164 0.326546 4.25187 0.184471C4.49795 0.118534 4.76051 0.188884 4.94065 0.369027L12.0676 7.49594C12.3463 7.77433 12.3463 8.22602 12.0676 8.5044Z"
          fill="currentColor"
        />
      </g>
      <defs>
        <linearGradient
          id="paint0_linear_5130_4799"
          x1="12.2766"
          y1="8.00038"
          x2="3.7229"
          y2="8.00038"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#EF7F23" />
          <stop offset="1" stopColor="#E74728" />
        </linearGradient>
        <clipPath id="clip0_5130_4799">
          <rect width="16" height="16" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

export default RightArrow;
