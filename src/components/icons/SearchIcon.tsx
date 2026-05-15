type IconProps = {
  className?: string;
};

const SearchIcon = ({ className }: IconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <g clip-path="url(#clip0_5130_4789)">
        <path
          d="M23.4952 22.2169L17.8395 16.5624C22.7429 10.6757 19.4348 1.68842 11.8851 0.385386C4.33533 -0.917636 -1.79383 6.44081 0.852587 13.6306C3.22817 20.0846 11.2777 22.2415 16.562 17.8399L22.2165 23.4956C22.7087 23.9877 23.549 23.7625 23.7292 23.0902C23.8128 22.7782 23.7236 22.4453 23.4952 22.2169ZM2.07222 10.2053C2.07222 3.94477 8.84948 0.0319111 14.2713 3.1622C19.6931 6.29249 19.6931 14.1182 14.2713 17.2485C13.0351 17.9622 11.6324 18.338 10.2049 18.3381C5.71543 18.3331 2.0772 14.6949 2.07222 10.2053Z"
          fill="url(#paint0_linear_5130_4789)"
        />
      </g>
      <defs>
        <linearGradient
          id="paint0_linear_5130_4789"
          x1="23.76"
          y1="11.9977"
          x2="0.226074"
          y2="11.9977"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#EF7F23" />
          <stop offset="1" stop-color="#E74728" />
        </linearGradient>
        <clipPath id="clip0_5130_4789">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

export default SearchIcon;
