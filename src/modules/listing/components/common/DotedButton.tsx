type DotedButtonProps = {
  Icon?: React.ElementType;
  Label: string;
  value: string | number;
  day?: string;
};

const DotedButton = ({ Icon, Label, value, day = "" }: DotedButtonProps) => {
  return (
    <div className="rounded-full border-2 border-dashed border-secondary/20  px-5 py-2 transition-all duration-300 hover:scale-105 flex items-center gap-3 cursor-pointer">
      <div className="h-12 w-12 py-2 bg-secondary/5 rounded-full flex justify-center items-center">
        {Icon && <Icon className="text-btn01" />}
      </div>
      <div
        className={`${day ? "flex flex-col items-start" : "flex flex-col items-center"}`}
      >
        <span className="text-xs font-medium text-secondary/40">{Label}</span>
        <p className="text-sm font-medium text-primary-dark">{value}</p>
        {day && <p className="text-xs font-medium text-secondary/40">{day}</p>}
      </div>
    </div>
  );
};

export default DotedButton;
