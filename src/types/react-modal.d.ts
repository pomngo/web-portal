declare module "react-modal" {
  export interface Props {
    isOpen: boolean;
    onRequestClose?: (event: import("react").MouseEvent | import("react").KeyboardEvent) => void;
    closeTimeoutMS?: number;
    shouldCloseOnOverlayClick?: boolean;
    shouldCloseOnEsc?: boolean;
    overlayClassName?: string | { base: string; afterOpen: string; beforeClose: string };
    className?: string | { base: string; afterOpen: string; beforeClose: string };
    children?: import("react").ReactNode;
  }
  const Modal: import("react").ComponentType<Props> & {
    setAppElement(element: string | HTMLElement): void;
  };
  export default Modal;
}
