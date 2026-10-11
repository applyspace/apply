/** Props of the product visuals (inline SVG, server-rendered, no JavaScript). */
export type VisualProps = {
  /** Makes gradient, mask and filter ids unique when the same visual appears twice on a page. */
  idPrefix?: string;
  className?: string;
  /** Hidden from assistive tech when the text next to it already says what it shows. */
  decorative?: boolean;
};
