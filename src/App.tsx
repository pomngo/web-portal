import { useEffect, useState } from "react";
import ScrollManager from "./components/common/ScrollManager";
import MainRouting from "./routes/MainRouting";
import SkeletonLoader from "./components/common/SkeletonLoader";

const App = () => {
  const [loader, setLoader] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoader(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (loader) {
    return (
      <div className="min-h-screen px-16 flex flex-col gap-16 py-10 tracking-tight">
        <SkeletonLoader />
      </div>
    );
  }
  return (
    <div className="min-h-screen overflow-y-auto bg-primary text-secondary scrollbar-hide">
      <ScrollManager />
      <MainRouting />
    </div>
  );
};

export default App;
