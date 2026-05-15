import React from "react";
import Modal from "react-modal";

Modal.setAppElement("#root");

const LoginPopup = ({ isOpen, onClose }) => {
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
        base: `
          absolute top-20 right-10
          outline-none
          transition-all duration-300
          opacity-0 scale-95
        `,
        afterOpen: "opacity-100 scale-100",
        beforeClose: "opacity-0 scale-95",
      }}
    >
      <div className="w-[420px] bg-white rounded-3xl shadow-2xl shadow-secondary p-8 text-[14px]">
        
        {/* Sign In */}
        <button className="w-full h-14 border border-gray-300 rounded-2xl font-semibold hover:text-secondary/90 transition duration-300">
          Sign In
        </button>

        {/* Create Account */}
        <button className="w-full h-14 mt-5 rounded-2xl font-medium text-primary bg-linear-to-r from-btn02 to-btn01 to-65% hover:opacity-90 transition duration-300 shadow-md">
          Create Account
        </button>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-secondary/20"></div>
          <span className="mx-4 text-secondary/40 text-sm">OR</span>
          <div className="flex-1 h-px bg-secondary/20"></div>
        </div>

        {/* Google */}
        <button className="w-full h-14 border border-secondary/20 rounded-2xl flex items-center justify-center gap-3 hover:bg-gray-50 transition duration-300">
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="google"
            className="w-6 h-6"
          />
          <span className="font-medium">
            Continue With Google
          </span>
        </button>

        {/* Apple */}
        <button className="w-full h-14 mt-4 border border-secondary/20 rounded-2xl flex items-center justify-center gap-3 hover:bg-gray-50 transition duration-300">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg"
            alt="apple"
            className="w-5 h-5"
          />
          <span className="font-medium" >
            Continue With Apple
          </span>
        </button>
      </div>
    </Modal>
  );
};

export default LoginPopup;