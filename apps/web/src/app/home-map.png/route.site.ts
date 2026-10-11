import { homeMapUrl } from '@/site/lib/homeMap';

/**
 * The Paris map behind the homepage Map view, served as a static image: fetched from Geoapify on the server with
 * GEOAPIFY_API_KEY (the app's key, never sent to the browser) and cached for a week. The `.png` path is outside the
 * proxy matcher, so signed-out visitors get it. 404 without a key: the homepage then draws its SVG map instead.
 */
export const revalidate = 604800;

export async function GET() {
  const key = process.env.GEOAPIFY_API_KEY;
  if (!key) return new Response(null, { status: 404 });
  try {
    const res = await fetch(homeMapUrl(key), { next: { revalidate } });
    if (!res.ok) return new Response(null, { status: 502 });
    return new Response(await res.arrayBuffer(), {
      headers: { 'Content-Type': 'image/png', 'Cache-Control': 'public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400' },
    });
  } catch {
    return new Response(null, { status: 502 });
  }
}
