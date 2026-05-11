type IconProps = {
  className?: string;
};

const HomeIcon = ({ className }: IconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      className={className}
    >
      <path
        d="M14.6849 6.63903L8.413 0.367111C7.9232 -0.12237 7.12941 -0.12237 6.63961 0.367111L0.367695 6.63903C0.13127 6.8737 -0.00117958 7.19339 7.91668e-06 7.5265V15.0528C7.91668e-06 15.3992 0.280808 15.68 0.627195 15.68H5.64473C5.99112 15.68 6.27193 15.3992 6.27193 15.0528V10.6625H8.78069V15.0528C8.78069 15.3992 9.06149 15.68 9.40788 15.68H14.4254C14.7718 15.68 15.0526 15.3992 15.0526 15.0528V7.5265C15.0538 7.19339 14.9213 6.8737 14.6849 6.63903ZM13.7982 14.4256H10.0351V10.0353C10.0351 9.68889 9.75426 9.40809 9.40788 9.40808H5.64473C5.29833 9.40807 5.01754 9.68887 5.01754 10.0353V14.4256H1.25439V7.5265L7.52631 1.25459L13.7982 7.5265V14.4256Z"
        fill="currentColor"
      />
      <defs>
        <linearGradient
          id="paint0_linear_5130_5068"
          x1="15.0526"
          y1="7.84"
          x2="0"
          y2="7.84"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#EF7F23" />
          <stop offset="1" stop-color="#E74728" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default HomeIcon;
