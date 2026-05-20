import { useEffect, useLayoutEffect, useRef } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

const ScrollManager = (): null => {
  const location = useLocation();
  const navigationType = useNavigationType();
  const prevPathRef = useRef<string>(location.pathname);

  // Disable browser automatic restoration
  useEffect(() => {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }
  }, []);

  // Save scroll position when leaving current page
  useEffect(() => {
    const saveScrollPosition = () => {
      sessionStorage.setItem(
        `scroll-${prevPathRef.current}`,
        window.scrollY.toString(),
      );
    };

    const handleBeforeUnload = () => {
      saveScrollPosition();
    };

    window.addEventListener("scroll", saveScrollPosition);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("scroll", saveScrollPosition);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      // Save position when component unmounts or route changes
      saveScrollPosition();
    };
  }, []);

  // Restore scroll position when navigating to a page
  useLayoutEffect(() => {
    const savedPosition = sessionStorage.getItem(`scroll-${location.pathname}`);

    // Use setTimeout with longer delay to ensure DOM is ready
    const restoreScroll = () => {
      if (navigationType === "POP" && savedPosition) {
        window.scrollTo(0, Number(savedPosition));
      } else {
        window.scrollTo(0, 0);
      }
    };

    // Try multiple approaches to ensure scroll restoration
    requestAnimationFrame(() => {
      requestAnimationFrame(restoreScroll);
    });

    // Update the previous path for next navigation
    prevPathRef.current = location.pathname;
  }, [location.pathname, navigationType]);

  return null;
};

export default ScrollManager;
