import Modal from "react-modal";
import { Icons } from "../../../../constants/icons";

type JoinPromptPopupProps = {
  isOpen: boolean;
  onClose: () => void;
  message: string;
  onJoin?: () => void;
};

Modal.setAppElement("#root");

const JoinPromptPopup = ({ isOpen, onClose, message, onJoin }: JoinPromptPopupProps) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      closeTimeoutMS={300}
      shouldCloseOnOverlayClick={true}
      shouldCloseOnEsc={true}
      overlayClassName={{
        base: "fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center transition-opacity duration-300",
        afterOpen: "opacity-100",
        beforeClose: "opacity-0",
      }}
      className={{
        base: `relative w-[90%] max-w-md scale-95 opacity-0 transition-all duration-300 outline-none`,
        afterOpen: "scale-100 opacity-100",
        beforeClose: "scale-95 opacity-0",
      }}
    >
      <div className="relative rounded-3xl bg-white p-8 text-[14px] shadow-2xl border border-slate-100 text-center">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 transition-colors p-1.5 rounded-full hover:bg-slate-50 cursor-pointer"
        >
          <Icons.close size={20} />
        </button>

        {/* Banner/Icon area */}
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-orange-50 text-orange-500">
          <Icons.users width={32} height={32} />
        </div>

        <h3 className="mb-3 text-lg font-bold text-slate-800">Become a Member</h3>
        
        <p className="mb-8 text-sm leading-relaxed text-slate-500 max-w-xs mx-auto">
          {message}
        </p>

        {/* Buttons */}
        <div className="flex flex-col gap-3">
          <button
            onClick={() => {
              if (onJoin) onJoin();
              onClose();
            }}
            className="from-btn01 to-btn02 w-full cursor-pointer rounded-xl bg-linear-to-tl to-75% py-3.5 font-semibold text-white shadow-md shadow-orange-500/10 transition-all duration-300 hover:scale-[1.01] active:scale-95"
          >
            Join Now
          </button>
          
          <button
            onClick={onClose}
            className="w-full py-3 font-semibold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
          >
            Maybe Later
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default JoinPromptPopup;
