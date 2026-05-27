type DotedButtonProps = {
  Icon?: React.ElementType;
  Label: string;
  value: string | number;
  day?: string;
};

const DotedButton = ({ Icon, Label, value, day = "" }: DotedButtonProps) => {
  return (
    <div className="border-secondary/20 flex cursor-pointer items-center gap-3 rounded-full border-2 border-dashed px-5 py-2 transition-all duration-300 hover:scale-105">
      <div className="bg-secondary/5 flex h-12 w-12 items-center justify-center rounded-full py-2">
        {Icon && <Icon className="text-btn01" />}
      </div>
      <div className={`${day ? "flex flex-col items-start" : "flex flex-col items-center"}`}>
        <span className="text-secondary/40 text-xs font-medium">{Label}</span>
        <p className="text-primary-dark text-sm font-medium">{value}</p>
        {day && <p className="text-secondary/40 text-xs font-medium">{day}</p>}
      </div>
    </div>
  );
};

export default DotedButton;
