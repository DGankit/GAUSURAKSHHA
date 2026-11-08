// Netlify Function: asks OpenStreetMap (Overpass) for the ward boundaries of one
// local unit and returns the answer to the app. It runs on the server, so the
// browser's CORS rule does not apply, and it can try more than one Overpass server.

const ENDPOINTS = [
  "https://overpass-api.de/api/interpreter",
  "https://overpass.kumi.systems/api/interpreter"
];

exports.handler = async function (event) {
  const p = event.queryStringParameters || {};

  // Only letters, digits and spaces are allowed in the name (everything else becomes ".")
  const name = String(p.name || "").replace(/[^A-Za-z0-9 ]/g, ".").slice(0, 60);
  const lat = Number(p.lat);
  const lng = Number(p.lng);

  // Nepal only: this stops the function being used as an open proxy
  if (!name || !isFinite(lat) || !isFinite(lng) || lat < 26 || lat > 31 || lng < 79 || lng > 89) {
    return { statusCode: 400, body: "bad request" };
  }

  const around = "(around:25000," + lat + "," + lng + ")";
  const query = "[out:json][timeout:25];" +
    'relation["boundary"="administrative"]["admin_level"="9"]' + around + "->.w;" +
    '(relation.w["name"~"^' + name + '[- ]",i];relation.w["name:en"~"^' + name + '[- ]",i];);' +
    "out geom;";

  const started = Date.now();
  let lastError = "no server answered";

  for (let i = 0; i < ENDPOINTS.length; i++) {
    // Netlify stops a function after about 10 seconds, so keep inside that
    const left = 9000 - (Date.now() - started);
    if (left < 1500) break;
    const controller = new AbortController();
    const timer = setTimeout(function () { controller.abort(); }, i === 0 ? Math.min(6000, left) : left);
    try {
      const res = await fetch(ENDPOINTS[i], {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: "data=" + encodeURIComponent(query),
        signal: controller.signal
      });
      if (!res.ok) throw new Error(ENDPOINTS[i].split("/")[2] + " answered HTTP " + res.status);
      const body = await res.text();
      JSON.parse(body); // make sure it really is JSON before passing it on
      clearTimeout(timer);
      return {
        statusCode: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "public, max-age=86400",
          // Netlify's CDN keeps the answer, so the next visitor from the same unit gets it instantly
          "Netlify-CDN-Cache-Control": "public, max-age=604800, stale-while-revalidate=2592000"
        },
        body: body
      };
    } catch (err) {
      clearTimeout(timer);
      lastError = String(err && err.message ? err.message : err);
    }
  }

  return { statusCode: 502, body: lastError };
};