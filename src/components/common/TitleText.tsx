type TitleTextProps = {
  title: string;
  className?: string;
};

const TitleText = ({ title, className = "" }: TitleTextProps) => {
  return (
    <h2 className={`text-[18px] font-semibold uppercase sm:text-[20px] md:text-[22px] lg:text-[24px] ${className} `}>
      {title}
    </h2>
  );
};

export default TitleText;
