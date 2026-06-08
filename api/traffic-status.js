export default function handler(req, res) {
  res.status(200).json({
    metlife: "traffic-normal",
    fortlee: "traffic-heavy",
    ewr: "traffic-slow",
    secaucus: "traffic-normal",
    timessquare: "traffic-slow"
  });
}
