export default function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  res.status(200).json({
    metlife: "traffic-normal",
    fortlee: "traffic-heavy",
    ewr: "traffic-heavy",
    secaucus: "traffic-heavy",
    timessquare: "traffic-heavy"
  });
}

