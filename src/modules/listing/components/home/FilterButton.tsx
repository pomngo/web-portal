type FilterButtonProps = {
  Icon: React.ElementType;
  label: string;
  selectedFilter: string;
  setSelectedFilter: React.Dispatch<React.SetStateAction<string>>;
};

const FilterButton = ({
  Icon,
  label,
  selectedFilter,
  setSelectedFilter,
}: FilterButtonProps) => {
  return (
    <button
      onClick={() => setSelectedFilter(label === selectedFilter ? "" : label)}
      className={`px-5 py-2 font-medium rounded-3xl transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-2
        ${selectedFilter === label
          ? "bg-primary-dark text-white"
          : "bg-linear-to-tr from-secondary/5 to-secondary/10 to-75% text-secondary"
        }`}
    >
      <Icon size={20} />
      {label}
    </button>
  );
};

export default FilterButton;
