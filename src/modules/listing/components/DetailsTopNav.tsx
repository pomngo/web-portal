import { Link } from "react-router-dom";
import { images } from "../../../constants/images";

const DetailsTopNav = () => {
  return (
    <div className="bg-linear-to-b from-nav01 via-nav02 to-[10%_15%] px-4  sm:px-6 md:px-8 lg:px-12 xl:px-16 py-2">

      <div className="flex items-center justify-between">

        <Link to={"/"}>
          <img src={images.logo} alt="Logo" className="h-16" />
        </Link>

        <div>
          <button className="text-[12px] sm:text-[13px] md:text-[14px] lg:text-[15px] xl:text-[17px] text-nowrap  rounded-full bg-linear-to-tr from-btn02 to-btn01 to-75% px-5 py-2 text-primary transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer">
            Become Organizer
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailsTopNav;
