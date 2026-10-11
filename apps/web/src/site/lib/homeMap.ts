/**
 * The Paris map of the homepage Map view: one frame shared by the real map image (`/home-map.png`, Geoapify static
 * map fetched on the server with GEOAPIFY_API_KEY) and the SVG fallback, so pins land on the same places in both.
 * Web Mercator with 512 px tiles (Geoapify static maps follow the MapLibre zoom scale).
 */
export const HOME_MAP = { lon: 2.345, lat: 48.8595, zoom: 11.6, width: 930, height: 488 } as const;

function world(lon: number, lat: number, zoom: number): [number, number] {
  const size = 512 * 2 ** zoom;
  const sin = Math.sin((lat * Math.PI) / 180);
  return [((lon + 180) / 360) * size, (0.5 - Math.log((1 + sin) / (1 - sin)) / (4 * Math.PI)) * size];
}

/** Position of a place in the map frame, in pixels from its top-left corner. */
export function mapPoint(lon: number, lat: number): [number, number] {
  const [cx, cy] = world(HOME_MAP.lon, HOME_MAP.lat, HOME_MAP.zoom);
  const [x, y] = world(lon, lat, HOME_MAP.zoom);
  return [HOME_MAP.width / 2 + (x - cx), HOME_MAP.height / 2 + (y - cy)];
}

/** Geoapify static map URL (server only: it carries the key). */
export function homeMapUrl(apiKey: string): string {
  const params = new URLSearchParams({
    style: 'positron',
    width: String(HOME_MAP.width),
    height: String(HOME_MAP.height),
    center: `lonlat:${HOME_MAP.lon},${HOME_MAP.lat}`,
    zoom: String(HOME_MAP.zoom),
    scaleFactor: '2',
    format: 'png',
    apiKey,
  });
  return `https://maps.geoapify.com/v1/staticmap?${params.toString()}`;
}

/** Whether the real map can be served (read on the server at build or revalidation time). */
export function hasHomeMap(): boolean {
  return Boolean(process.env.GEOAPIFY_API_KEY);
}
