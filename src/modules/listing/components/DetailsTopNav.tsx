import { useState, lazy, Suspense } from "react";
import { Link } from "react-router-dom";
import { images } from "../../../constants/images";

const LoginPopup = lazy(() => import("./common/LoginPopup"));

const DetailsTopNav = () => {
  const [open, setOpen] = useState(false);
  const [hasBeenOpened, setHasBeenOpened] = useState(false);

  return (
    <div className="from-nav01  px-4 py-2 sm:px-6 md:px-8 lg:px-12 xl:px-16">
      <div className="flex items-center justify-between">
        <Link to={"/"}>
          <img src={images.logo} alt="Logo" className="h-16" />
        </Link>

        <div>
          <button
            onClick={() => {
              setOpen(true);
              setHasBeenOpened(true);
            }}
            className="from-btn02 to-btn01 text-primary cursor-pointer rounded-full bg-linear-to-tr to-75% px-5 py-2 text-[12px] text-nowrap transition-all duration-300 hover:scale-105 active:scale-95 sm:text-[13px] md:text-[14px] lg:text-[15px] xl:text-[17px]"
          >
            Become Organizer
          </button>
          {hasBeenOpened && (
            <Suspense fallback={null}>
              <LoginPopup isOpen={open} onClose={() => setOpen(false)} />
            </Suspense>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailsTopNav;
