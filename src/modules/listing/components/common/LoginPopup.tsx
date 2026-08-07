import * as Dialog from "@radix-ui/react-dialog";
import { Icons } from "../../../../constants/icons";

type LoginPopupProps = {
  isOpen: boolean;
  onClose: () => void;
};

const LoginPopup = ({ isOpen, onClose }: LoginPopupProps) => {
  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs transition-opacity duration-300 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[92%] max-w-sm sm:max-w-md rounded-3xl bg-white p-6 sm:p-8 text-[14px] shadow-2xl border border-slate-100 outline-none transition-all duration-300 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95">
          {/* Header & Close Button */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <Dialog.Title className="text-xl font-bold text-slate-800">
                Welcome to FlocknGo
              </Dialog.Title>
              <Dialog.Description className="text-xs text-slate-500 mt-0.5">
                Sign in or create an account to get started
              </Dialog.Description>
            </div>
            <Dialog.Close className="text-slate-400 hover:text-slate-600 transition-colors p-1.5 rounded-full hover:bg-slate-50 cursor-pointer">
              <Icons.close size={20} />
            </Dialog.Close>
          </div>

          {/* Sign In */}
          <button className="hover:text-secondary/90 flex items-center justify-center h-12 sm:h-14 w-full rounded-2xl border border-gray-300 font-semibold transition duration-300 cursor-pointer active:scale-98">
            Sign In
          </button>

          {/* Create Account */}
          <button className="text-white from-btn02 to-btn01 mt-4 flex items-center justify-center h-12 sm:h-14 w-full rounded-2xl bg-linear-to-r to-65% font-semibold shadow-md transition duration-300 hover:opacity-90 cursor-pointer active:scale-98">
            Create Account
          </button>

          {/* Divider */}
          <div className="my-5 flex items-center">
            <div className="bg-secondary/20 h-px flex-1"></div>
            <span className="text-secondary/40 mx-4 text-xs font-semibold uppercase">OR</span>
            <div className="bg-secondary/20 h-px flex-1"></div>
          </div>

          {/* Google */}
          <button className="border-secondary/20 flex h-12 sm:h-14 w-full items-center justify-center gap-3 rounded-2xl border transition duration-300 hover:bg-gray-50 cursor-pointer active:scale-98">
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="google" className="h-5 w-5" />
            <span className="font-medium text-slate-700 text-xs sm:text-sm">Continue With Google</span>
          </button>

          {/* Apple */}
          <button className="border-secondary/20 mt-3 flex h-12 sm:h-14 w-full items-center justify-center gap-3 rounded-2xl border transition duration-300 hover:bg-gray-50 cursor-pointer active:scale-98">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg"
              alt="apple"
              className="h-5 w-5"
            />
            <span className="font-medium text-slate-700 text-xs sm:text-sm">Continue With Apple</span>
          </button>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default LoginPopup;

