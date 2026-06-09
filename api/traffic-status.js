export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");

  const API_KEY = process.env.GOOGLE_MAPS_API_KEY;

  const destination = "Birch Dental Studio, Closter, NJ";

  const locations = [
    { key: "metlife", origin: "MetLife Stadium, East Rutherford, NJ", typical: 22 },
    { key: "fortlee", origin: "Fort Lee, NJ", typical: 12 },
    { key: "ewr", origin: "Newark Liberty International Airport, NJ", typical: 32 },
    { key: "secaucus", origin: "Secaucus, NJ", typical: 25 },
    { key: "timessquare", origin: "Times Square, New York, NY", typical: 28 }
  ];

  const results = {};

  for (const location of locations) {
    try {
      const url =
        "https://routes.googleapis.com/directions/v2:computeRoutes";

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": API_KEY,
          "X-Goog-FieldMask": "routes.duration,routes.staticDuration"
        },
        body: JSON.stringify({
          origin: { address: location.origin },
          destination: { address: destination },
          travelMode: "DRIVE",
          routingPreference: "TRAFFIC_AWARE"
        })
      });

      const data = await response.json();

      const seconds = parseInt(data.routes?.[0]?.duration || "0");
      const currentMinutes = Math.round(seconds / 60);

      const ratio = currentMinutes / location.typical;

      if (ratio >= 1.5) {
        results[location.key] = "traffic-heavy";
      } else if (ratio >= 1.2) {
        results[location.key] = "traffic-slow";
      } else {
        results[location.key] = "traffic-normal";
      }

    } catch (error) {
      results[location.key] = "traffic-normal";
    }
  }

  res.status(200).json(results);
}

