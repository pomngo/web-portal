import { useNavigate, useParams } from "react-router";
import { Icons } from "../../../../constants/icons";
import { nearbyActivities } from "../../../../constants/data";
import NearbyActivities from "../../components/home/NearbyActivities";
import { useEffect, useState } from "react";
import HomeLoader from "../../../../components/common/HomeLoader";

const AllActivities = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { search_by } = useParams();

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen px-16 flex flex-col gap-16 py-10">
        <HomeLoader />
      </div>
    );
  }
  return (
    <main className="min-h-screen px-4  sm:px-6 md:px-8 lg:px-12 xl:px-16 flex flex-col gap-16 py-10">
      {/* Nearby Flocks */}
      <section className="">
        {/* Heading */}
        <div className="flex justify-between items-center mb-4">
          <div className="">
            <h2 className="text-[18px] sm:text-[20px] md:text-[22px] lg:text-[24px] font-bold">
              {search_by
                ?.split("-")
                .map(
                  (word) =>
                    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
                )
                .join(" ")}
            </h2>
          </div>
          <div className="">
            <button
              onClick={() => navigate(-1)}
              className="bg-linear-to-tr from-btn02 to-btn01 to-75% px-5 py-2 bg-clip-text text-transparent transition-all duration-300 hover:scale-105 flex items-center gap-2 cursor-pointer"
            >
              <Icons.leftArrow className="text-btn01" /> Back
            </button>
          </div>
        </div>

        {/* Activities List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 gap-x-4 gap-y-16">
          {nearbyActivities.map((activity) => (
            <NearbyActivities key={activity.id} activity={activity} />
          ))}
        </div>
      </section>
    </main>
  );
};

export default AllActivities;
