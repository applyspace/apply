/**
 * Vercel Toolbar for local development only, to leave comments on localhost (needs `vercel link`, see EDITING.md).
 * `NODE_ENV` is replaced at build time, so in a build the early return makes the dynamic import unreachable and the
 * toolbar code is not bundled at all. A plain `NODE_ENV === 'development' && <VercelToolbar />` in the layout would
 * still leave its code in the client chunk shared by every page.
 */
export async function DevToolbar() {
  if (process.env.NODE_ENV !== 'development') return null;
  const { VercelToolbar } = await import('@vercel/toolbar/next');
  return <VercelToolbar />;
}
