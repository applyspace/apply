/**
 * Development-only reference overlay (see EDITING.md). Same early return and dynamic import as `DevToolbar`, so
 * nothing of it reaches a production bundle.
 */
export async function DevReference() {
  if (process.env.NODE_ENV !== 'development') return null;
  const { DevReferenceOverlay } = await import('./DevReferenceOverlay');
  return <DevReferenceOverlay />;
}
