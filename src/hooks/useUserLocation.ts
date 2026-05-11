
import { useEffect, useState } from "react";
import {
  locationService,
  type UserLocation,
} from "../services/location.service";

export const useUserLocation = () => {
  const [location, setLocation] =
    useState<UserLocation | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    initializeLocation();
  }, []);

  const initializeLocation = async () => {
    try {
      // 1. CHECK CACHE FIRST
      const cachedLocation =
        locationService.getCachedLocation();

      if (cachedLocation) {
        setLocation(cachedLocation);
        setLoading(false);
        return;
      }

      // 2. FETCH LOCATION
      const currentLocation =
        await locationService.getCurrentLocation();

      setLocation(currentLocation);
    } catch (err) {
      setError("Unable to get location");
    } finally {
      setLoading(false);
    }
  };

  return {
    location,
    loading,
    error,
  };
};