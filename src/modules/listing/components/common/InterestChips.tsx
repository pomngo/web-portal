import { useRef } from "react";

// List of categories matching the keys in keywordMap
const CATEGORIES = [
  { value: "", label: "All Interests", icon: "✨" },
  { value: "adventure", label: "Adventure", icon: "🚵" },
  { value: "social", label: "Social", icon: "🎉" },
  { value: "creative", label: "Creative", icon: "🎨" },
  { value: "tech", label: "Tech", icon: "💻" },
  { value: "wellness", label: "Wellness", icon: "🧘" },
  { value: "culinary", label: "Culinary", icon: "🍽️" },
  { value: "history", label: "History", icon: "🏛️" },
  { value: "music", label: "Music", icon: "🎵" },
  { value: "photography", label: "Photography", icon: "📷" },
  { value: "travel", label: "Travel", icon: "✈️" },
  { value: "fitness", label: "Fitness", icon: "💪" },
  { value: "gaming", label: "Gaming", icon: "🎮" },
  { value: "movies", label: "Movies & Shows", icon: "🎬" },
  { value: "nature", label: "Nature", icon: "🌳" }
];

interface InterestChipsProps {
  selectedFilter: string;
  setSelectedFilter: (value: React.SetStateAction<string>) => void;
}

const InterestChips = ({ selectedFilter, setSelectedFilter }: InterestChipsProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleSelect = (label: string) => {
    // If the label is "All Interests", we set it to empty string
    const filterValue = label === "All Interests" ? "" : label;
    setSelectedFilter(filterValue);
  };

  return (
    <div className="mt-8 flex w-full flex-col px-1">
      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-3 ml-2">
        Filter by Interest
      </span>
      {/* Horizontal Scrollable Container */}
      <div
        ref={containerRef}
        className="scrollbar-hide flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2"
      >
        {CATEGORIES.map((category) => {
          const isSelected =
            (!selectedFilter && category.label === "All Interests") ||
            selectedFilter.toLowerCase() === category.label.toLowerCase();

          return (
            <button
              key={category.label}
              onClick={() => handleSelect(category.label)}
              className={`flex snap-center items-center gap-2 rounded-full px-5 py-2.5 text-xs font-semibold tracking-wide border transition-all duration-300 outline-hidden cursor-pointer select-none whitespace-nowrap hover:scale-105 active:scale-95 ${
                isSelected
                  ? "bg-primary-dark/20 border-transparent shadow-md transform scale-[1.02]"
                  : "bg-white/80 text-[#1F2E4D] border-slate-200/60 hover:bg-slate-50 hover:border-slate-300 backdrop-blur-md"
              }`}
            >
              <span className="text-sm">{category.icon}</span>
              <span>{category.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default InterestChips;
