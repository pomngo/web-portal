type IconProps = {
  className?: string;
};

const HeartIcon = ({ className }: IconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="currentColor"
      className={`relative top-0.5 ${className}`}
    >
      <g clip-path="url(#clip0_5130_4775)">
        <path
          d="M15.8399 5.62125C15.8399 10.5212 8.57461 14.4874 8.26521 14.6512C8.09957 14.7404 7.90026 14.7404 7.73461 14.6512C7.42521 14.4874 0.159912 10.5212 0.159912 5.62125C0.162612 3.22545 2.10412 1.28395 4.49991 1.28125C5.94541 1.28125 7.21101 1.90285 7.99991 2.95355C8.78881 1.90285 10.0544 1.28125 11.4999 1.28125C13.8957 1.28395 15.8372 3.22545 15.8399 5.62125Z"
          fill="#575757"
        />
      </g>
      <defs>
        <clipPath id="clip0_5130_4775">
          <rect width="16" height="16" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

export default HeartIcon;
