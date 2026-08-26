import * as Dialog from "@radix-ui/react-dialog";
import { Icons } from "../../../../constants/icons";
import LocationIcon from "../../../../components/icons/LocationIcon";

type LocationPermissionPopupProps = {
  isOpen: boolean;
  onClose: () => void;
  onAllow: () => void;
};

const LocationPermissionPopup = ({ isOpen, onClose, onAllow }: LocationPermissionPopupProps) => {
  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs transition-opacity duration-300 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[92%] max-w-sm sm:max-w-md rounded-3xl bg-white p-6 sm:p-8 text-[14px] shadow-2xl border border-slate-100 text-center outline-none transition-all duration-300 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95">
          {/* Close Button */}
          <Dialog.Close className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 transition-colors p-1.5 rounded-full hover:bg-slate-50 cursor-pointer">
            <Icons.close size={20} />
          </Dialog.Close>

          {/* Banner/Icon area */}
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-orange-50 text-[#EF7F23]">
            <LocationIcon className="h-7 w-7" />
          </div>

          <Dialog.Title className="mb-2 text-lg sm:text-xl font-bold text-slate-800">
            Allow Location Access
          </Dialog.Title>

          <Dialog.Description className="mb-6 text-xs sm:text-sm leading-relaxed text-slate-500 max-w-xs mx-auto">
            FlocknGo needs your location permission to discover and connect you with local community groups, flocks, and activities happening near you.
          </Dialog.Description>

          {/* Buttons */}
          <div className="flex flex-col gap-3">
            <button
              onClick={() => {
                onAllow();
                onClose();
              }}
              className="from-btn01 to-btn02 w-full cursor-pointer rounded-xl bg-linear-to-tl to-75% py-3 sm:py-3.5 font-semibold text-white shadow-md shadow-orange-500/10 transition-all duration-300 hover:scale-[1.01] active:scale-95 text-xs sm:text-sm"
            >
              Allow Access
            </button>

            <button
              onClick={onClose}
              className="w-full py-2.5 font-semibold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer text-xs sm:text-sm"
            >
              Maybe Later
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default LocationPermissionPopup;

