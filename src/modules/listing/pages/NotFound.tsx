import { Link, useNavigate } from "react-router-dom";
import SEOHead from "../../../components/common/SEOHead";

const NotFound = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center bg-white px-6 py-16 font-sans">
      <SEOHead
        title="Page Not Found | FlocknGo"
        description="The page you are looking for does not exist."
        canonicalPath="/not-found"
        domain="main"
      />

      <div className="max-w-md text-center space-y-6">
        <p className="text-sm font-bold tracking-widest text-[#E75B28] uppercase">404 error</p>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          Page not found
        </h1>
        <p className="text-base text-slate-500 font-normal leading-relaxed">
          Sorry, we couldn't find the page you are looking for. It might have been moved or deleted.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <button
            onClick={handleBack}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-50 transition cursor-pointer"
          >
            Go Back
          </button>
          <Link
            to="/"
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#E75B28] hover:bg-orange-600 text-white text-sm font-semibold transition cursor-pointer shadow-xs"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
