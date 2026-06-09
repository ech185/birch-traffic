export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");

  const API_KEY = process.env.GOOGLE_MAPS_API_KEY;

  const destination = "136 Oakland Avenue, Closter, NJ 07624";

  const locations = [
    { key: "metlife", origin: "MetLife Stadium, East Rutherford, NJ", typical: 22 },
    { key: "fortlee", origin: "Fort Lee, NJ", typical: 12 },
    { key: "ewr", origin: "Newark Liberty International Airport, NJ", typical: 32 },
    { key: "secaucus", origin: "Secaucus, NJ", typical: 25 },
    { key: "timessquare", origin: "Times Square, New York, NY", typical: 28 }
  ];

  const results = {};

  function secondsFromDuration(duration) {
    return Number(String(duration || "0s").replace("s", ""));
  }

  for (const location of locations) {
    try {
      const response = await fetch("https://routes.googleapis.com/directions/v2:computeRoutes", {
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

      const route = data.routes?.[0];

      if (!route) {
        results[location.key] = "traffic-normal";
        continue;
      }

      const currentMinutes = Math.round(secondsFromDuration(route.duration) / 60);
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
