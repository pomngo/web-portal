type IconProps = {
  className?: string;
};

const LeftArrow = ({ className }: IconProps) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="9" height="16" viewBox="0 0 9 16" fill="none" className={className}>
      <path
        d="M0.209044 8.34425L7.33596 15.4712C7.72411 15.8593 8.3869 15.6817 8.52898 15.1515C8.59491 14.9054 8.52456 14.6428 8.34441 14.4627L1.72084 7.84001L8.34441 1.21733C8.73257 0.829177 8.55498 0.16639 8.02474 0.0243149C7.77866 -0.0416226 7.5161 0.0287274 7.33596 0.208871L0.209044 7.33578C-0.0696554 7.61417 -0.0696554 8.06586 0.209044 8.34425Z"
        fill="currentColor"
      />
      <defs>
        <linearGradient
          id="paint0_linear_5163_362"
          x1="2.00272e-05"
          y1="7.84023"
          x2="8.55371"
          y2="7.84023"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#EF7F23" />
          <stop offset="1" stopColor="#E74728" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default LeftArrow;
