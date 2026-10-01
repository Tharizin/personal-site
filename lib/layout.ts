/** Shared inset for hero corner elements (contact icons, nav links). */
export const heroCornerInset = "top-5 left-5 sm:top-8 sm:left-8";
export const heroCornerInsetRight = "top-5 right-5 sm:top-8 sm:right-8";

/**
 * The same inset as `heroCornerInsetRight`, expressed as padding rather than
 * offsets. The hero nav is absolutely positioned over the image while the nav
 * on every other page lives in a sticky bar; routing both through this value
 * keeps the links at identical coordinates as you move between pages.
 */
export const navInsetPadding = "p-5 sm:p-8";
