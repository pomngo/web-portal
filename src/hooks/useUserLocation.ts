import { useEffect, useState } from "react";
import { locationService, type UserLocation } from "../services/location.service";

export const useUserLocation = () => {
  const [location, setLocation] = useState<UserLocation | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const initializeLocation = async () => {
    try {
      // 1. CHECK CACHE FIRST
      const cachedLocation = locationService.getCachedLocation();

      if (cachedLocation) {
        setLocation(cachedLocation);
      } else {
        setLocation(null);
      }
    } catch {
      setError("Unable to get location");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    initializeLocation();
  }, []);

  return {
    location,
    loading,
    error,
  };
};
