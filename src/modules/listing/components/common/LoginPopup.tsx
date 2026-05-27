import Modal from "react-modal";

type LoginPopupProps = {
  isOpen: boolean;
  onClose: () => void;
};

Modal.setAppElement("#root");

const LoginPopup = ({ isOpen, onClose }: LoginPopupProps) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      closeTimeoutMS={300}
      shouldCloseOnOverlayClick={true}
      shouldCloseOnEsc={true}
      overlayClassName={{
        base: "fixed inset-0 z-50 transition-opacity duration-300",
        afterOpen: "opacity-100",
        beforeClose: "opacity-0",
      }}
      className={{
        base: `absolute top-20 right-10 scale-95 opacity-0 transition-all duration-300 outline-none`,
        afterOpen: "scale-100 opacity-100",
        beforeClose: "scale-95 opacity-0",
      }}
    >
      <div className="shadow-secondary w-105 rounded-3xl bg-white p-8 text-[14px] shadow-2xl">
        {/* Sign In */}
        <button className="hover:text-secondary/90 h-14 w-full rounded-2xl border border-gray-300 font-semibold transition duration-300">
          Sign In
        </button>

        {/* Create Account */}
        <button className="text-primary from-btn02 to-btn01 mt-5 h-14 w-full rounded-2xl bg-linear-to-r to-65% font-medium shadow-md transition duration-300 hover:opacity-90">
          Create Account
        </button>

        {/* Divider */}
        <div className="my-6 flex items-center">
          <div className="bg-secondary/20 h-px flex-1"></div>
          <span className="text-secondary/40 mx-4 text-sm">OR</span>
          <div className="bg-secondary/20 h-px flex-1"></div>
        </div>

        {/* Google */}
        <button className="border-secondary/20 flex h-14 w-full items-center justify-center gap-3 rounded-2xl border transition duration-300 hover:bg-gray-50">
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="google" className="h-6 w-6" />
          <span className="font-medium">Continue With Google</span>
        </button>

        {/* Apple */}
        <button className="border-secondary/20 mt-4 flex h-14 w-full items-center justify-center gap-3 rounded-2xl border transition duration-300 hover:bg-gray-50">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg"
            alt="apple"
            className="h-5 w-5"
          />
          <span className="font-medium">Continue With Apple</span>
        </button>
      </div>
    </Modal>
  );
};

export default LoginPopup;
