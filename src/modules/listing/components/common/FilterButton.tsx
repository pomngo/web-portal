import { memo } from "react";

type FilterButtonProps = {
  Icon: React.ElementType;
  label: string;
  selectedFilter: string;
  setSelectedFilter: React.Dispatch<React.SetStateAction<string>>;
};

const FilterButton = ({ Icon, label, selectedFilter, setSelectedFilter }: FilterButtonProps) => {
  return (
    <button
      onClick={() => setSelectedFilter(label === selectedFilter ? "" : label)}
      className={`flex cursor-pointer items-center gap-2 rounded-3xl px-5 py-2 font-medium transition-all duration-300 hover:scale-105 active:scale-95 ${
        selectedFilter === label
          ? "bg-primary-dark text-white"
          : "from-secondary/5 to-secondary/10 text-secondary bg-linear-to-tr to-75%"
      }`}
    >
      <Icon size={20} />
      {label}
    </button>
  );
};

export default memo(FilterButton);
