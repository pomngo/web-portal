export interface UserLocation {
  lat: number;
  lng: number;
  city?: string;
  source: "gps" | "ip";
}

class LocationService {
  async getCurrentLocation(): Promise<UserLocation> {
    try {
      const gpsLocation = await this.getGPSLocation();

      localStorage.setItem("user_location", JSON.stringify(gpsLocation));

      return gpsLocation;
    } catch {
      const ipLocation = await this.getIPLocation();

      localStorage.setItem("user_location", JSON.stringify(ipLocation));

      return ipLocation;
    }
  }

  private getGPSLocation(): Promise<UserLocation> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject("Geolocation not supported");
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            source: "gps",
          });
        },
        (error) => reject(error),
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 1000 * 60 * 10,
        }
      );
    });
  }

  private async getIPLocation(): Promise<UserLocation> {
    const response = await fetch("https://ipapi.co/json/");

    if (!response.ok) {
      throw new Error("Failed to fetch IP location");
    }

    const data = await response.json();

    return {
      lat: data.latitude,
      lng: data.longitude,
      city: data.city,
      source: "ip",
    };
  }

  getCachedLocation(): UserLocation | null {
    const cached = localStorage.getItem("user_location");

    if (!cached) return null;

    return JSON.parse(cached);
  }
}

export const locationService = new LocationService();
